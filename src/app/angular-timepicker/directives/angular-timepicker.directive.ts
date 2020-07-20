import { Directive, Inject, ViewContainerRef, ComponentFactoryResolver,
     ComponentRef, OnDestroy, Output, Self, Optional, ElementRef, Input } from "@angular/core";
import { NgControl } from '@angular/forms';


import { MouseDownUpService } from '../services/mouse-down-up.service';
import { TimepickerCircleComponent } from '../containers/timepicker-circle.component';
import { Subject, Subscription, Observable } from 'rxjs';
import { HoursOrMins } from '../models/hours-mins';

@Directive({
    selector: 'input[ang-timepicker]',
    providers:[MouseDownUpService],
})export class AngularTimepickerDirective implements OnDestroy {

    constructor(
        @Inject(MouseDownUpService) private _mouseUpDown$: MouseDownUpService,
        @Inject(ViewContainerRef) private _viewRef: ViewContainerRef,
        @Inject(ComponentFactoryResolver) private _componentFactoryResolver: ComponentFactoryResolver,
        @Inject(ElementRef) private _elRef:ElementRef,
        // if we have form control
         @Optional() @Self() @Inject(NgControl) private _formControl:NgControl,
        // TODO add form controls here so we can patch their value
        ){

                this._serviceSub = _mouseUpDown$.subscribe((emissions) => {

                    if('inProcess' in emissions){
                        if(emissions.inProcess) {
                           this._createdComponentInstance = this._viewRef.createComponent(this._componentToCreate);
                           // todo also add patching to form control or input value
                           this._createdComponentInstance.instance.mouseEnterActiveTarget = this.emissionValsSubj;
                           this._createdComponentInstance.instance.hoursOrMins = this.hoursOrMins;
                        } else {
                            this._createdComponentInstance && this._createdComponentInstance.destroy();
                            this._createdComponentInstance = null;
                        }
                    }

                })       


    }

    private readonly _componentToCreate = this._componentFactoryResolver.resolveComponentFactory(TimepickerCircleComponent);
    private _createdComponentInstance:ComponentRef<TimepickerCircleComponent>;
    private readonly _serviceSub:Subscription;

    public readonly emissionValsSubj = new Subject<number>();
    // final output for all listeners of directive also passed to dynamic component to give it values
    @Output()
    public readonly timeChange:Observable<number> = this.emissionValsSubj.asObservable();

    private _innerTimeChangeSub:Subscription;

    @Input()
    hoursOrMins:HoursOrMins = 'hours';

    ngOnInit(){
        this._innerTimeChangeSub = this.timeChange
            .subscribe(val => this._updateFormField(val, this._formControl));
    }

    ngOnDestroy(){
        this.emissionValsSubj.complete();
        this._serviceSub.unsubscribe();
        this._innerTimeChangeSub && this._innerTimeChangeSub.unsubscribe();
    }


    private _updateFormField(val:number, formControl = null){
        if(formControl){
            this._formControl.control.patchValue(this._valueOrZero(val));
        } else {
            const inputEl:HTMLInputElement = this._elRef.nativeElement;
            inputEl.value = this._valueOrZero(val).toString();
        }
    }

    private _valueOrZero(val:number){
        return Number.isNaN(val) ? 0 : val;
    }

}