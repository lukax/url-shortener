import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {DomSanitizer, Meta, SafeResourceUrl, Title} from "@angular/platform-browser";
import {LinkService} from "../services/index";
import {CreateLinkViewModel, LinkViewModel, PageMetadataViewModel} from "../../shared/entities";
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
  isLoading: boolean;
  pageUrl: SafeResourceUrl;
  cta: CreateLinkViewModel;
  private sub: Subscription;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private linkService: LinkService,
              private titleService: Title,
              private meta: Meta) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.isLoading = true;
      const pageHash = params['pageHash'];
      this.pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkService.getLinkViewUrl(pageHash));
      this.linkService.getLinkCta(pageHash).subscribe(this.onLoadCta);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onPageLoad() {
    this.isLoading = false;
  }

  onLoadCta(cta: LinkViewModel) {
    this.cta = cta;
    this.loadMetadata(cta.metadata || {});
  }

  loadMetadata(metadata: PageMetadataViewModel) {
    if(metadata.title) {
      this.titleService.setTitle(metadata.title);
    }
    this.meta.addTag({ name: 'og:title', content: metadata.title });
    this.meta.addTag({ name: 'og:description', content: metadata.description });
    this.meta.addTag({ name: 'og:image', content: metadata.image });
    this.meta.addTag({ name: 'og:url', content: metadata.url });
    this.meta.addTag({ name: 'og:video', content: metadata.video });
    this.meta.addTag({ name: 'og:logo', content: metadata.logo });
    this.meta.addTag({ name: 'og:site_name', content: metadata.publisher });
    this.meta.addTag({ name: 'twitter:title', content: metadata.image });
    this.meta.addTag({ name: 'twitter:image', content: metadata.image });
    this.meta.addTag({ name: 'twitter:description', content: metadata.description });
    this.meta.addTag({ name: 'twitter:player:stream', content: metadata.video });
    this.meta.addTag({ name: 'author', content: metadata.author });
    this.meta.addTag({ name: 'description', content: metadata.description });
    this.meta.addTag({ name: 'logo', content: metadata.logo });
    this.meta.addTag({ name: 'application-name', content: metadata.publisher });
    this.meta.addTag({ name: 'publisher', content: metadata.publisher });
    this.meta.addTag({ name: 'date', content: metadata.date });
  }


}
