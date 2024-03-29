
const BLOCKED_URLS = [
  "google-analytics.com",
  "api.mixpanel.com",
  "stats.g.doubleclick.net",
  "mc.yandex.ru",
  "beacon.tapfiliate.com",
  "js-agent.newrelic.com",
  "api.segment.io",
  "woopra.com",
  "static.olark.com",
  "static.getclicky.com",
  "cdn.heapanalytics.com",
  "googleads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
  "fullstory.com/rec",
  "navilytics.com/nls_ajax.php",
  "log.optimizely.com/event",
  "hn.inspectlet.com",
  "tpc.googlesyndication.com",
  "partner.googleadservices.com",
  "pixel.quantserve.com",
  "pixel.mathtag.com",
  "pixel.rubiconproject.com",
  "logx.optimizely.com",
  "akstat.io",
  "go-mpulse.net",
  "doubleclick.net/pixel",
  "cx.atdmt.com",
  "sb.scorecardresearch.com"
];

const BLOCKED_REGEXP = new RegExp('(' + BLOCKED_URLS.join('|') + ')', 'i');

export {BLOCKED_URLS, BLOCKED_REGEXP};
