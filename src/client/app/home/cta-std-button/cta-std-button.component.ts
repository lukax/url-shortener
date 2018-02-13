import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {CreateLinkViewModel} from "../../shared/models";
import { LinkService } from "../index";

@Component({
  moduleId: module.id,
  selector: 'sd-cta-std-button',
  templateUrl: 'cta-std-button.component.html',
  styleUrls: ['cta-std-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaStdButtonComponent {

  @Input()
  cta: CreateLinkViewModel;

  constructor(private linkService: LinkService) {
    
  }

}
