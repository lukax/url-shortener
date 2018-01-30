import {Component, Input} from "@angular/core";
import {CreateLinkDto} from "../../shared/entities";

@Component({
  moduleId: module.id,
  selector: 'sd-cta-std-button',
  templateUrl: 'cta-std-button.component.html',
  styleUrls: ['cta-std-button.component.css'],
})
export class CtaStdButtonComponent {

  @Input()
  cta: CreateLinkDto = {};

  constructor() {

  }

}
