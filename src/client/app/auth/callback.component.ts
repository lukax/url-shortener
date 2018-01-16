import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  template: `
    <div class="loading">
      <img src="assets/loading.svg" alt="loading">
    </div>
  `,
  styles: [`
    .loading {
      position: absolute;
      display: flex;
      justify-content: center;
      height: 100vh;
      width: 100vw;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
    }
  `]
})
export class CallbackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
