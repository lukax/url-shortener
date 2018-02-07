import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {CreateLinkDto} from "../../shared/entities";
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
  cta: CreateLinkDto;

  constructor(private linkService: LinkService) {
    
  }

}
