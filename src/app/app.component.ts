import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular timepiucker </h1>
    <input type="number" ang-timepicker />
    <p>Some other text</p>
  
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-timepicker';
}
