import { Component, OnInit, Input } from '@angular/core';

enum SIZES {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
@Component({
  selector: 'mpp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  constructor() { }

  @Input() size: SIZES = SIZES.MEDIUM;
  @Input() loading: boolean = false;
  @Input() lockedBg = true;

  ngOnInit() {
  }

}
