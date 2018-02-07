import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {LinkService} from "../services/index";
import {CreateLinkDto} from "../../shared/entities";
import {Observable} from "rxjs/Observable";

@Component({
  moduleId: module.id,
  selector: 'sd-link-view',
  template: `
    <iframe [src]="pageUrl" frameborder="0" sandbox="allow-scripts allow-same-origin" (load)="onPageLoad()"></iframe>
    <sd-cta-std-button [cta]="cta"></sd-cta-std-button>
    <sd-loading-spinner *ngIf="isLoading"></sd-loading-spinner>
  `,
  styles: [`
    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  `],
})
export class LinkViewComponent implements OnInit, OnDestroy {
  pageUrl: SafeResourceUrl;
  cta: CreateLinkDto;
  isLoading: boolean;
  private sub: Subscription;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private linkService: LinkService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.isLoading = true;
      const pageHash = params['pageHash'];
      this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkService.getLinkViewUrlFromHash(pageHash));
      this.linkService.getLinkCta(pageHash).subscribe(x => this.cta = x);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onPageLoad() {
    this.isLoading = false;
  }
}
