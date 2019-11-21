import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageService } from '@shared/services/storage.service';
import { 
  OffsetBlockComponent, 
  SelectorComponent,
  ButtonGroupComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  TableHeaderComponent,
  TableComponent,
  TableBodyComponent,
  TableRowComponent,
  TableCellComponent,
} from './components';
import {
  ShortUuidPipe,
  ToFixedPipe,
  FormatWithCommasPipe,
  FormatPercentagePipe,
  SlicePipe,
  SafeHtmlPipe
} from './pipes';
import { ClickOutsideDirective } from './directives';

const COMPONENTS = [
  OffsetBlockComponent,
  SelectorComponent,
  ButtonGroupComponent,

  ModalComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalHeaderComponent,

  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableCellComponent,
];

const PIPES = [
  ShortUuidPipe,
  ToFixedPipe,
  FormatWithCommasPipe,
  FormatPercentagePipe,
  SlicePipe,
  SafeHtmlPipe,
];

const DIRECTIVES = [
  ClickOutsideDirective,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent,
  ],
  exports: [
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    StorageService,
  ]
})
export class SharedModule { }
