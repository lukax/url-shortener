import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'sd-cta-std-button',
  templateUrl: 'cta-std-button.component.html',
  styleUrls: ['cta-std-button.component.css'],
})
export class CtaStdButtonComponent {

  @Input()
  cta = {
    name: 'A nice attention grabbing header!',
    message: 'A descriptive sentence for the Call To Action (CTA)',
    buttonUrl: '',
    buttonText: 'CONTACT US NOW!',
  };

  constructor() {

  }

}
