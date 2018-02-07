import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {LinkService} from "../services/index";
import {SafeResourceUrl} from "@angular/platform-browser/src/security/dom_sanitization_service";


@Component({
  moduleId: module.id,
  selector: 'sd-link-preview-url',
  template: `
    <iframe class="overlay" *ngIf="_pageUrl" [src]="_pageUrl" [hidden]="isLoading"
            scrolling="no" 
            frameborder="0" 
            sandbox="allow-scripts allow-same-origin"
            style="overflow: hidden;"
            (load)="onPageLoad()"></iframe>
    <sd-loading-spinner *ngIf="isLoading"></sd-loading-spinner>
  `,
  styles: [`
    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
    }
    .overlay {
      position:absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }`
  ],
})
export class LinkPreviewUrlComponent {
  _pageUrl: SafeResourceUrl;
  _rawUrl: string;
  isLoading: boolean;

  @Input()
  set pageUrl(url: string) {
    if(!!url && this._rawUrl !== url && this.linkService.isUrl(url)) {
      this._rawUrl = url;
      this.isLoading = true;
      this._pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkService.getLinkPreviewUrl(url));
    }
  }

  constructor(private sanitizer: DomSanitizer,
              private linkService: LinkService) { }


  onPageLoad() {
    this.isLoading = false;
  }

}
