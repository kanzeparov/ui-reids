import {
  Directive,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Directive({
  selector: '[mppClickOutside]',
})
export class ClickOutsideDirective implements OnInit {
  private listening = false;
  private globalClick$!: Subscription;

  @Input() mppClickOutside!: (_: any) => any;
  @Output() clickOutside: EventEmitter<Object>;

  constructor(
    private _elRef: ElementRef,
  ) {
    this.clickOutside = new EventEmitter();
  }

  ngOnInit() {
    const container = this.nativeElement.closest('#modal-container') || document;
    this.globalClick$ = fromEvent(container, 'click').pipe(
      delay(1),
      tap(() => this.listening = true),
    ).subscribe(event => {
      this.onGlobalClick(event);
    });
  }

  ngOnDestroy() {
    if (this.globalClick$) {
      this.globalClick$.unsubscribe();
    }
  }

  get nativeElement(): HTMLElement {
    return this._elRef.nativeElement;
  }

  onGlobalClick(event: Event) {
    if (event instanceof MouseEvent && this.listening) {
      if (!this.isDescendant(this.nativeElement, event.target as Node)) {
        this.mppClickOutside(event);
      }
    }
  }

  private isDescendant(parent: HTMLElement, child: Node): boolean {
    return parent.contains(child);
  }
}
