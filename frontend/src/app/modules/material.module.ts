import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatCardModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatSelectModule,
  MatBottomSheetModule,
  MatInputModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSliderModule,
} from '@angular/material';

const materialComponentModules = [
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatCardModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatSelectModule,
  MatBottomSheetModule,
  MatInputModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  // Add imports for Angular Material Modules here...
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...materialComponentModules,
  ],
  exports: [
    ...materialComponentModules,
  ]
})
export class MaterialModule { }
