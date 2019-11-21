import { Injectable } from '@angular/core';
import { DomService } from './dom.service';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementSelector = '#modal-container';
  private modalOverlaySelector = '#modal-overlay';

  open(component: any, inputs = {}, outputs = {}) {
    this.close();
    const componentConfig = { inputs, outputs };

    this.domService.appendComponentTo(this.modalElementSelector, component, componentConfig);

    const modalElementSelectorNode = document.querySelector(this.modalElementSelector);
    const modalOverlaySelectorNode = document.querySelector(this.modalOverlaySelector);
    
    if (modalElementSelectorNode) {
      modalElementSelectorNode.classList.remove('hidden');  
    }

    if (modalOverlaySelectorNode) {
      modalOverlaySelectorNode.classList.remove('hidden'); 
    }
  }

  close() {
    this.domService.removeComponent();

    const modalElementSelectorNode = document.querySelector(this.modalElementSelector);
    const modalOverlaySelectorNode = document.querySelector(this.modalOverlaySelector);

    if (modalElementSelectorNode) {
      modalElementSelectorNode.classList.add('hidden');
    }

    if (modalOverlaySelectorNode) {
      modalOverlaySelectorNode.classList.add('hidden');
    }
  }

}
