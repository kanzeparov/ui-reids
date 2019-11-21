import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Input() label!: string;
  @Input()
  set items(items: any[]) {
    this._items = items;
    if (!!items.length) {
      this.selectedItem = items[0];
      this.select.emit(this.selectedItem);
    }
  }

  get items(): any[] {
    return this._items;
  }

  set selectedItem(item: any) {
    this._selectedItem = item;
  }

  get selectedItem() {
    return this._selectedItem;
  }

  get selectedItemName() {
    return this.selectedItem && this.selectedItem.name;
  }

  private _items!: any[];
  private _selectedItem!: any;

  constructor() { }

  ngOnInit() { }

  onSelect(item: any) {
    this.selectedItem = item;
    this.select.emit(this.selectedItem);
  }

}
