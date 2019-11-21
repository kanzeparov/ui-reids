import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mpp-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent implements OnInit {

  constructor() { }

  @Input() icon!: string;
  @Input() offWhite = false;
  @Input() withSpacing = true;

  ngOnInit() {
  }

  get classes() {
    return {
      [`mpp-modal-header--with-spacing`]: this.withSpacing,
      ['mpp-modal-header--off-white']: this.offWhite,
    };
  }
}
