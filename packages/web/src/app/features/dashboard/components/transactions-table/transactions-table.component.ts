import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '@dashboard/models';

@Component({
  selector: 'mpp-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  @Input() data!: Transaction[];

  constructor() { }

  ngOnInit() {
  }

}
