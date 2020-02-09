import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { delay, exhaustMap, takeUntil, withLatestFrom, throttleTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { beginTrackAction, setScaleAction, setMapRenderViewport, endTrackAction } from 'src/app/actions/map.actions';
import { Maps } from '@tb/interfaces';
import { coordsToPixel, roundIPoint } from 'src/app/lib/coord-pixel';
import { IExtendedChunk } from 'src/app/reducers/map.reducer';
import * as Hammer from 'hammerjs';
import { HermiteInterpolation } from 'src/app/lib/hermite-interpolation';
import { renderMap } from 'src/app/lib/draw-map/map-renderer';
import { environment } from '@tb/environment/dist/prod';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent implements OnInit, OnDestroy {

  public isTracking$: Observable<boolean>;

  public showDebugData: boolean = false;
  public debugData$: Observable<string>;

  private offsetCanvas1: Maps.IPoint = { x: environment.map.preRenderBorderWidth, y: environment.map.preRenderBorderWidth };
  private offsetCanvas2: Maps.IPoint = { x: 0, y: 0 };
  private route: Maps.ICoords[] = [];

  @ViewChild('canvas1', { static: true }) private canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true }) private canvas2: ElementRef<HTMLCanvasElement>;

  private destroy: Subject<void> = new Subject();
  constructor(
    public store: Store<IState>,
  ) { }

  public ngOnDestroy(): void {
    this.store.dispatch(setMapRenderViewport({ viewport: { width: 0, height: 0, scale: 0, preRenderBorderWidth: 0 } }));
    this.store.dispatch(endTrackAction());
    this.destroy.next();
  }

  public ngOnInit(): void {
    this.setViewport();
    this.hammerPinch();
    this.getRoute();
    this.beginRender();
    this.isTracking$ = this.store.pipe(select('map', 'isTracking'));
    this.debugData$ = this.store.pipe(select('map', 'debugData'));
  }

  public track(): void {
    this.store.dispatch(beginTrackAction());
  }

  public trackDetailed(event: Event): void {
    event.preventDefault();
    this.track();
    this.showDebugData = true;
  }

  private hammerPinch(): void {
    const hammer = new Hammer(this.canvas2.nativeElement);
    hammer.get('pinch').set({ enable: true });
    let scale = 50;
    let scaleInterpol = new HermiteInterpolation(0, 100, 10000, 1000000);
    let tmpScale = scale;
    hammer.on('pinch pinchend', ev => {
      if (ev.type === 'pinch') {
        tmpScale = scale * ev.scale;
        if (tmpScale < 0)
          tmpScale = 0;
        if (tmpScale > 100)
          tmpScale = 100;
        this.store.dispatch(setScaleAction({ scale: scaleInterpol.eval(tmpScale) }));
      }
      if (ev.type === 'pinchend') {
        scale = tmpScale;
        if (scale < 0)
          scale = 0;
        if (scale > 100)
          scale = 100;
        this.store.dispatch(setScaleAction({ scale: scaleInterpol.eval(scale) }));
      }
    });
  }

  private getRoute(): void {
    this.store
      .pipe(
        select('hikingRoute', 'hikingRoute'),
        withLatestFrom(this.store.pipe(select('map', 'position'))),
        withLatestFrom(this.store.pipe(select('map', 'viewport'))),
        takeUntil(this.destroy),
      )
      .subscribe({
        next: ([[hikingRoute, position], viewport]) => {
          this.route = hikingRoute.geometry.split(' ').map(x => {
            const [lon, lat/*, height*/] = x.split(',');
            return ({ lat: parseFloat(lat), lon: parseFloat(lon) });
          });
          this.drawCanvas2(position, this.offsetCanvas2, viewport);
        },
      });
  }

  private setViewport(): void {
    const toolbarHeight = 56/*px*/;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight - toolbarHeight;
    const preRenderBorderWidth = environment.map.preRenderBorderWidth;
    const scale = environment.map.defaultScale;
    this.store.dispatch(setMapRenderViewport({ viewport: { width, height, scale, preRenderBorderWidth } }));
    this.canvas1.nativeElement.width = width + (preRenderBorderWidth * 2);
    this.canvas1.nativeElement.height = height + (preRenderBorderWidth * 2);
    this.canvas2.nativeElement.width = width;
    this.canvas2.nativeElement.height = height;
  }

  private beginRender(): void {
    let drawingBase: Maps.ICoords = { lat: 0, lon: 0 };
    let lastDrawedBase: Maps.ICoords = { lat: 0, lon: 0 };
    let lastDrawedScale: number = 1;
    let scale: number;
    combineLatest([
      this.store.pipe(select('map', 'position')),
      this.store.pipe(select('map', 'viewport')),
    ])
      .pipe(takeUntil(this.destroy), delay(0), exhaustMap(<T extends any>(x: T) => new Promise<T>(resolve => window.requestAnimationFrame(() => resolve(x)))))
      .subscribe({
        next: ([position, viewport]) => {
          this.offsetCanvas2 = {
            x: viewport.width / 2,
            y: viewport.height / 2,
          };
          this.offsetCanvas1 = {
            x: this.offsetCanvas2.x + viewport.preRenderBorderWidth,
            y: this.offsetCanvas2.y + viewport.preRenderBorderWidth,
          };
          scale = viewport.scale;
          drawingBase = position;
          this.drawCanvas2(position, this.offsetCanvas2, viewport);
          this.translateCanvas1(position, lastDrawedBase, lastDrawedScale, viewport);
        },
      });

    combineLatest([
      this.store.pipe(select('map', 'reducedChunk')),
      this.store.pipe(select('map', 'viewport')),
    ]).pipe(
      takeUntil(this.destroy),
      throttleTime(1000),
    )
      .subscribe({
        next: ([chunk, viewPort]) => {
          this.drawCanvas1(drawingBase, chunk, this.offsetCanvas1, viewPort);
          lastDrawedBase = drawingBase;
          lastDrawedScale = viewPort.scale;
        },
      });
  }

  private drawCanvas1(position: Maps.ICoords, chunk: IExtendedChunk, offset: Maps.IPoint, viewport: Maps.IViewport): void {
    const ctx = this.canvas1.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, viewport.width + (2 * viewport.preRenderBorderWidth), viewport.height + (2 * viewport.preRenderBorderWidth));
    renderMap(ctx, chunk, position, offset, viewport.scale);
    this.drawRoute(ctx, position, this.route, offset, viewport.scale);
    this.translateCanvas1(position, position, viewport.scale, viewport);
  }

  private translateCanvas1(position: Maps.ICoords, base: Maps.ICoords, lastDrawedScale: number, viewport: Maps.IViewport): void {
    const scaleFactor = viewport.scale / lastDrawedScale;
    const scaleWidth = (viewport.width + (viewport.preRenderBorderWidth * 2)) * scaleFactor;
    // its enough to scale one dimension, the other will be adapted.
    this.canvas1.nativeElement.style.width = scaleWidth + 'px';
    const halfHeight = viewport.height / 2;
    const halfWidth = viewport.width / 2;
    const offset = {
      x: halfWidth - (halfWidth * scaleFactor) - (viewport.preRenderBorderWidth * scaleFactor),
      y: halfHeight - (halfHeight * scaleFactor) - (viewport.preRenderBorderWidth * scaleFactor),
    };
    const translation = coordsToPixel(position, base, offset, lastDrawedScale);
    this.canvas1.nativeElement.style.left = translation.x + 'px';
    this.canvas1.nativeElement.style.top = translation.y + 'px';
  }

  private drawCanvas2(position: Maps.ICoords, offset: Maps.IPoint, viewport: Maps.IViewport): void {
    const ctx: CanvasRenderingContext2D = this.canvas2.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    this.drawMyPosition(ctx, position, offset, viewport.scale);
  }

  private drawMyPosition(ctx: CanvasRenderingContext2D, position: Maps.ICoords, offset: Maps.IPoint, scale: number): void {
    const point = coordsToPixel(position, position, offset, scale);
    ctx.beginPath();
    ctx.arc(point.x - 5, point.y - 5, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
  }

  private drawRoute(ctx: CanvasRenderingContext2D, position: Maps.ICoords, route: Maps.ICoords[], offset: Maps.IPoint, scale: number): void {
    let i = 0;
    const firstPoint = roundIPoint(coordsToPixel(position, route[i], offset, scale));
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (; i < route.length; i++) {
      if (!route[i]) {
        while (!route[i]) {
          i++;
          if (route.length === i - 1) return;
        }
        const point = roundIPoint(coordsToPixel(position, route[i], offset, scale));
        ctx.moveTo(point.x, point.y);
      } else {
        const point = roundIPoint(coordsToPixel(position, route[i], offset, scale));
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.strokeStyle = '#150D69';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

}
