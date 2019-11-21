import { Component, Input, OnInit } from '@angular/core';

enum ALIGNMENTS {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  SPACE_BETWEEN = 'space-between',
}

@Component({
  selector: 'mpp-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss'],
})
export class ModalFooterComponent implements OnInit {

  constructor() { }

  @Input() align: ALIGNMENTS = ALIGNMENTS.RIGHT;
  @Input() offWhite = false;
  @Input() withSpacing = true;

  get classes() {
    return {
      [`mpp-modal-footer--${this.align}`]: true,
      ['mpp-modal-footer--off-white']: this.offWhite,
      ['mpp-modal-footer--with-spacing']: this.withSpacing,
    };
  }

  ngOnInit() {
  }

}
