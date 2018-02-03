import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {LinkService} from "../services/index";
import {SafeResourceUrl} from "@angular/platform-browser/src/security/dom_sanitization_service";


@Component({
  moduleId: module.id,
  selector: 'sd-link-preview-url',
  template: `
    <iframe class="overlay" *ngIf="_pageUrl" [src]="_pageUrl" 
            scrolling="no" 
            frameborder="0" 
            sandbox="allow-scripts allow-same-origin"
            style="overflow: hidden;"></iframe>
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
      background-color:rgba(0, 0, 0, 0.40);
      z-index: 1;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPreviewUrlComponent {
  _pageUrl: SafeResourceUrl;
  _rawUrl: string;

  @Input()
  set pageUrl(url: string) {
    if(!!url && this._rawUrl !== url && this.linkService.isUrl(url)) {
      this._rawUrl = url;
      this._pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkService.linkenizer(url));
    }
  }

  constructor(private sanitizer: DomSanitizer,
              private linkService: LinkService) { }

}
