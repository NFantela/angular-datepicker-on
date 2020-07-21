import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
  <div class="wrap">
  <h1>Angular timepicker </h1>
  <h3>Regular input field </h3>
  <input type="number" ang-timepicker  />
  <p>Field with form control</p>
  <input ang-timepicker [formControl]="timeInput" hoursOrMins="mins" />
  </div>

  
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-timepicker';

  timeInput = new FormControl(0);

  handleIt(e){
    console.log("app component listening", e)
  }
}
