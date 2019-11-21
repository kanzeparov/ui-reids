import { Component, OnInit, Input } from '@angular/core';

enum BACKGROUND_COLORS {
  WHITE = 'white',
  OFF_WHITE = 'off-white',
}

@Component({
  selector: 'mpp-modal-body',
  templateUrl: './modal-body.component.html',
  styleUrls: ['./modal-body.component.scss'],
})
export class ModalBodyComponent implements OnInit {

  constructor() { }

  @Input() withSpacing = true;
  @Input() bgColor: BACKGROUND_COLORS = BACKGROUND_COLORS.OFF_WHITE;

  ngOnInit() {
  }

}
