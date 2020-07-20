import { Directive, Inject, ViewContainerRef, ComponentFactoryResolver, ComponentRef, OnDestroy } from "@angular/core";

import { MouseDownUpService } from '../services/mouse-down-up.service';
import { TimepickerCircleComponent } from '../containers/timepicker-circle.component';
import { Subject, Subscription } from 'rxjs';

@Directive({
    selector: '[ang-timepicker]',
    providers:[MouseDownUpService],
})export class AngularTimepickerDirective implements OnDestroy {

    constructor(
        @Inject(MouseDownUpService) private _mouseUpDown$: MouseDownUpService,
        @Inject(ViewContainerRef) private _viewRef: ViewContainerRef,
        @Inject(ComponentFactoryResolver) private _componentFactoryResolver: ComponentFactoryResolver){

            this._serviceSub = _mouseUpDown$.subscribe((emissions) => {

                    if('inProcess' in emissions){
                        if(emissions.inProcess) {
                            this._createdComponentInstance = this._viewRef.createComponent(this._componentToCreate);
                            this._createdComponentInstance.instance.mouseVals = this.emissionValsSubj;
                        } else {
                            this._createdComponentInstance && this._createdComponentInstance.destroy();
                            this._createdComponentInstance = null;
                        }
                    }

                    if(emissions instanceof MouseEvent && emissions.clientX){
                        this.emissionValsSubj.next(emissions);
                    } 

                });

    }

    private _componentToCreate = this._componentFactoryResolver.resolveComponentFactory(TimepickerCircleComponent);
    private _createdComponentInstance:ComponentRef<TimepickerCircleComponent>;
    private _serviceSub:Subscription;

    public emissionValsSubj = new Subject<MouseEvent>();

    ngOnDestroy(){
        this.emissionValsSubj.complete();
        this._serviceSub.unsubscribe();
    }

}