import { Component, OnInit, Input } from '@angular/core';
import { Anchor } from '@dashboard/models';

@Component({
  selector: 'mpp-anchors-table',
  templateUrl: './anchors-table.component.html',
  styleUrls: ['./anchors-table.component.scss']
})
export class AnchorsTableComponent implements OnInit {

  @Input() data!: Anchor[];

  constructor() { }

  ngOnInit() {
  }

}
