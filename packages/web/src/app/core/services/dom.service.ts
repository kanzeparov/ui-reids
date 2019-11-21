import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  ComponentRef,
} from '@angular/core';

@Injectable()
export class DomService {

  private childComponentRef: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) { }

  public appendComponentTo(parentSelector: string, child: any, childConfig?: ChildConfig) {

    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;

    this.appRef.attachView(childComponentRef.hostView);

    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    const parentSelectorNode = document.querySelector(parentSelector);

    if (parentSelectorNode) {
      parentSelectorNode.appendChild(childDomElem); 
    }

  }

  public removeComponent() {
    if (this.childComponentRef) {
      this.appRef.detachView(this.childComponentRef.hostView);
      this.childComponentRef.destroy();
    }
  }

  private attachConfig(config: any, componentRef: any) {
    const inputs = config.inputs || {};
    const outputs = config.outputs || {};
    Object.keys(inputs).forEach(key => { componentRef.instance[key] = inputs[key]; });
    Object.keys(outputs).forEach(key => { componentRef.instance[key] = outputs[key]; });
  }
}

interface ChildConfig {
  inputs: object;
  outputs: object;
}
