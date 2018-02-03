import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {DomSanitizer} from "@angular/platform-browser";
import {SafeResourceUrl} from "@angular/platform-browser/src/security/dom_sanitization_service";

@Component({
  moduleId: module.id,
  selector: 'sd-link-view',
  template: `
    <iframe [src]="_pageUrl" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe>
  `,
  styles: [`
    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkViewComponent implements OnInit, OnDestroy {
  _pageUrl: SafeResourceUrl;
  private sub: Subscription;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this._pageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/api/pages/${params['pageHash']}`);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
