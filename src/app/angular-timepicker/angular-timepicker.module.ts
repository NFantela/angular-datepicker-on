import { NgModule } from '@angular/core';
import { AngularTimepickerDirective } from './directives/angular-timepicker.directive';
import { CommonModule } from '@angular/common';
import { TimepickerCircleComponent } from './containers/timepicker-circle.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AngularTimepickerDirective, TimepickerCircleComponent],
    exports:[AngularTimepickerDirective],
    providers: []
})
export class AngularTimepickerModule {}