import { Injectable } from '@angular/core';
import { Maps } from '@tb/interfaces';
import { Observable, EMPTY, concat } from 'rxjs';
import { environment } from '@tb/environment/dist/prod';
import { HttpService } from '../http/http.service';

// The maximum amount of chunks to request at once.
const MAX_CHUNK_ID_REQUEST_COUNT = 200;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private http: HttpService,
  ) { }

  public loadChunk(chunkId: string): Observable<Maps.IChunk> {
    return this.http.get<Maps.IChunk>(environment.api.map.route + '/chunk/' + chunkId);
  }

  public loadChunks(chunkIds: string[]): Observable<Maps.IChunk[]> {
    if (chunkIds.length === 0) return EMPTY;
    if (chunkIds.length > MAX_CHUNK_ID_REQUEST_COUNT) {
      const chunkIdsBulks: string[][] = [];
      for (let i = 0; i < chunkIds.length + MAX_CHUNK_ID_REQUEST_COUNT; i += MAX_CHUNK_ID_REQUEST_COUNT) {
        chunkIdsBulks.push(chunkIds.slice(i, i + MAX_CHUNK_ID_REQUEST_COUNT));
      }
      return concat(...chunkIdsBulks.map(idBulk => this.http.put<Maps.IChunk[]>(environment.api.map.route + '/chunk/', { chunks: idBulk })));
    } else {
      return this.http.put<Maps.IChunk[]>(environment.api.map.route + '/chunk/', { chunks: chunkIds });
    }
  }
}
