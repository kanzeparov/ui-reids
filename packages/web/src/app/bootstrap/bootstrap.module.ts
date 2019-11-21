import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

const BOOTSTRAP_MODULES = [
  NgbModule,
  NgbDropdownModule,
  NgbButtonsModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...BOOTSTRAP_MODULES,
  ],
  exports: [
    ...BOOTSTRAP_MODULES,
  ],
})
export class BootstrapModule { }
