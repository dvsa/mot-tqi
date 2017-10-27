/*!
 * jQuery Browser Plugin 0.1.0
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 05-07-2015
 */
/*global window: false */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function ($) {
      return factory($);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node-like environment
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function(jQuery) {
  "use strict";

  function uaMatch( ua ) {
    // If an UA is not provided, default to the current browser UA.
    if ( ua === undefined ) {
      ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec( ua ) ||
        /(opr)[\/]([\w.]+)/.exec( ua ) ||
        /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(iemobile)[\/]([\w.]+)/.exec( ua ) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var platform_match = /(ipad)/.exec( ua ) ||
        /(ipod)/.exec( ua ) ||
        /(windows phone)/.exec( ua ) ||
        /(iphone)/.exec( ua ) ||
        /(kindle)/.exec( ua ) ||
        /(silk)/.exec( ua ) ||
        /(android)/.exec( ua ) ||
        /(win)/.exec( ua ) ||
        /(mac)/.exec( ua ) ||
        /(linux)/.exec( ua ) ||
        /(cros)/.exec( ua ) ||
        /(playbook)/.exec( ua ) ||
        /(bb)/.exec( ua ) ||
        /(blackberry)/.exec( ua ) ||
        [];

    var browser = {},
        matched = {
          browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
          version: match[ 2 ] || match[ 4 ] || "0",
          versionNumber: match[ 4 ] || match[ 2 ] || "0",
          platform: platform_match[ 0 ] || ""
        };

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
      browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    if ( matched.platform ) {
      browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
      browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
      browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
      browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
      browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if ( browser.rv || browser.iemobile) {
      var ie = "msie";

      matched.browser = ie;
      browser[ie] = true;
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if ( browser.edge ) {
      delete browser.edge;
      var msedge = "msedge";

      matched.browser = msedge;
      browser[msedge] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if ( browser.safari && browser.blackberry ) {
      var blackberry = "blackberry";

      matched.browser = blackberry;
      browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if ( browser.safari && browser.playbook ) {
      var playbook = "playbook";

      matched.browser = playbook;
      browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if ( browser.bb ) {
      var bb = "blackberry";

      matched.browser = bb;
      browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr ) {
      var opera = "opera";

      matched.browser = opera;
      browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android ) {
      var android = "android";

      matched.browser = android;
      browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if ( browser.safari && browser.kindle ) {
      var kindle = "kindle";

      matched.browser = kindle;
      browser[kindle] = true;
    }

     // Kindle Silk browsers are marked as Safari on Kindle
    if ( browser.safari && browser.silk ) {
      var silk = "silk";

      matched.browser = silk;
      browser[silk] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
  }

  // Run the matching process, also assign the function to the returned object
  // for manual, jQuery-free use if desired
  window.jQBrowser = uaMatch( window.navigator.userAgent );
  window.jQBrowser.uaMatch = uaMatch;

  // Only assign to jQuery.browser if jQuery is loaded
  if ( jQuery ) {
    jQuery.browser = window.jQBrowser;
  }

  return window.jQBrowser;
}));

/*
 * jQuery history plugin
 *
 * sample page: http://www.mikage.to/jquery/jquery_history.html
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 */


jQuery.extend({
	historyCurrentHash: undefined,
	historyCallback: undefined,
	historyIframeSrc: undefined,
	historyNeedIframe: jQuery.browser.msie && (jQuery.browser.version < 8 || document.documentMode < 8),

	historyInit: function(callback, src){
		jQuery.historyCallback = callback;
		if (src) jQuery.historyIframeSrc = src;
		var current_hash = location.hash.replace(/\?.*$/, '');

		jQuery.historyCurrentHash = current_hash;
		if (jQuery.historyNeedIframe) {
			// To stop the callback firing twice during initilization if no hash present
			if (jQuery.historyCurrentHash == '') {
				jQuery.historyCurrentHash = '#';
			}

			// add hidden iframe for IE
			jQuery("body").prepend('<iframe id="jQuery_history" style="display: none;"'+
				' src="javascript:false;"></iframe>'
			);
			var ihistory = jQuery("#jQuery_history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = current_hash;
		}
		else if (jQuery.browser.safari) {
			// etablish back/forward stacks
			jQuery.historyBackStack = [];
			jQuery.historyBackStack.length = history.length;
			jQuery.historyForwardStack = [];
			jQuery.lastHistoryLength = history.length;

			jQuery.isFirst = true;
		}
		if(current_hash)
			jQuery.historyCallback(current_hash.replace(/^#/, ''));
		setInterval(jQuery.historyCheck, 100);
	},

	historyAddHistory: function(hash) {
		// This makes the looping function do something
		jQuery.historyBackStack.push(hash);

		jQuery.historyForwardStack.length = 0; // clear forwardStack (true click occured)
		this.isFirst = true;
	},

	historyCheck: function(){
		if (jQuery.historyNeedIframe) {
			// On IE, check for location.hash of iframe
			var ihistory = jQuery("#jQuery_history")[0];
			var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
			var current_hash = iframe.location.hash.replace(/\?.*$/, '');
			if(current_hash != jQuery.historyCurrentHash) {

				location.hash = current_hash;
				jQuery.historyCurrentHash = current_hash;
				jQuery.historyCallback(current_hash.replace(/^#/, ''));

			}
		} else if (jQuery.browser.safari) {
			if(jQuery.lastHistoryLength == history.length && jQuery.historyBackStack.length > jQuery.lastHistoryLength) {
				jQuery.historyBackStack.shift();
			}
			if (!jQuery.dontCheck) {
				var historyDelta = history.length - jQuery.historyBackStack.length;
				jQuery.lastHistoryLength = history.length;

				if (historyDelta) { // back or forward button has been pushed
					jQuery.isFirst = false;
					if (historyDelta < 0) { // back button has been pushed
						// move items to forward stack
						for (var i = 0; i < Math.abs(historyDelta); i++) jQuery.historyForwardStack.unshift(jQuery.historyBackStack.pop());
					} else { // forward button has been pushed
						// move items to back stack
						for (var i = 0; i < historyDelta; i++) jQuery.historyBackStack.push(jQuery.historyForwardStack.shift());
					}
					var cachedHash = jQuery.historyBackStack[jQuery.historyBackStack.length - 1];
					if (cachedHash != undefined) {
						jQuery.historyCurrentHash = location.hash.replace(/\?.*$/, '');
						jQuery.historyCallback(cachedHash);
					}
				} else if (jQuery.historyBackStack[jQuery.historyBackStack.length - 1] == undefined && !jQuery.isFirst) {
					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
					// document.URL doesn't change in Safari
					if (location.hash) {
						var current_hash = location.hash;
						jQuery.historyCallback(location.hash.replace(/^#/, ''));
					} else {
						var current_hash = '';
						jQuery.historyCallback('');
					}
					jQuery.isFirst = true;
				}
			}
		} else {
			// otherwise, check for location.hash
			var current_hash = location.hash.replace(/\?.*$/, '');
			if(current_hash != jQuery.historyCurrentHash) {
				jQuery.historyCurrentHash = current_hash;
				jQuery.historyCallback(current_hash.replace(/^#/, ''));
			}
		}
	},
	historyLoad: function(hash){
		var newhash;
		hash = decodeURIComponent(hash.replace(/\?.*$/, ''));

		if (jQuery.browser.safari) {
			newhash = hash;
		}
		else {
			newhash = '#' + hash;
			location.hash = newhash;
		}
		jQuery.historyCurrentHash = newhash;

		if (jQuery.historyNeedIframe) {
			var ihistory = jQuery("#jQuery_history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = newhash;
			jQuery.lastHistoryLength = history.length;
			jQuery.historyCallback(hash);
		}
		else if (jQuery.browser.safari) {
			jQuery.dontCheck = true;
			// Manually keep track of the history values for Safari
			this.historyAddHistory(hash);

			// Wait a while before allowing checking so that Safari has time to update the "history" object
			// correctly (otherwise the check loop would detect a false change in hash).
			var fn = function() {jQuery.dontCheck = false;};
			window.setTimeout(fn, 200);
			jQuery.historyCallback(hash);
			// N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
			//      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
			//      URL in the browser and the "history" object are both updated correctly.
			location.hash = newhash;
		}
		else {
		  jQuery.historyCallback(hash);
		}
	}
});

jQuery.fn.tabs = function(t) {
  var e = $.extend({
          trackState: !0,
          srcPath: "jQuery.history.blank.html",
          autoRotate: !1,
          alwaysScrollToTop: !0,
          selected: null,
          wrapperTag: "section",
          defaultTab: null,
          containerTag: "div",
          scrollOnload: !1
      }, t),
      i = "tabset",
      n = function(t) {
          var n = i;
          return "none" === t.find("li").css("float") && (n = "accordion"), "accordion" === n ? null === e.defaultTab && (e.defaultTab = -1) : null === e.defaultTab && (e.defaultTab = 0), n
      },
      a = function(t, e) {
          return "accordion" === i ? t.find("header.js-heading-tab") : e.find("li")
      },
      o = function(t, i, n) {
          var a, o, s, r = i.find("li"),
              l = i.closest(e.containerTag).parent();
          $.each(r, function(t) {
              var i = $(this).find("a"),
                  n = i.attr("href").split("#")[1],
                  r = $('<a href="#' + n + '" class="tab-shiftlink">Return to top of section \u2191</a>');
              a = l.find("#" + n), o = a.find("header"), o = o.length ? o.remove() : $("<header><h1 /></header>"), o.addClass("js-heading-tab").removeClass("visuallyhidden"), o.children().html("").append(i), s = a.find(".inner"), s.length ? s.addClass("js-tab-pane") : s = $('<div class="inner js-tab-pane" />').html(a.html()), s.attr("id", n), a.replaceWith($("<" + e.wrapperTag + " />").append(s)), a = s.parent(), a.prepend(o).attr("id", n), a.addClass("js-tab-container"), s.append(r)
          }), i.closest(e.containerTag).remove()
      };
  return $(this).each(function() {
      function t(t, n) {
          if (e.trackState && !n) {
              var a = t.attr("href").split("#")[1];
              $.historyLoad(a)
          } else {
              p.find("a").attr("aria-selected", !1).attr("tabindex", -1), "accordion" === i ? p.find("a").closest(".js-heading-tab").removeClass("active") : p.find("a").parent().filter(".active").removeClass("active"), t.attr("aria-selected", !0).attr("tabindex", 0), "accordion" === i ? t.closest(".js-heading-tab").addClass("active") : t.parent().addClass("active"), d.find(".tabs-panel-selected").attr("aria-hidden", !0).attr("aria-expanded", !1).removeClass("tabs-panel-selected").hide();
              var a = t.attr("href").split("#")[1];
              $("#" + a + h).addClass("tabs-panel-selected").attr("aria-hidden", !1).attr("aria-expanded", !0).show(), e.selected = p.find("a").index(t), l.trigger("tabChanged", a)
          }
      }

      function s(t) {
          p.find("a").attr("aria-selected", !1).attr("tabindex", -1), p.find("a").closest(".js-heading-tab").removeClass("active"), d.find(".tabs-panel-selected").attr("aria-hidden", !0).attr("aria-expanded", !1).removeClass("tabs-panel-selected").hide()
      }

      function r(i, n) {
          var a = i || window.location.hash;
          0 == a.indexOf("#") && (a = a.split("#")[1]);
          var o = p.find('a[href$="#' + a + '"]');
          return o.size() > 0 ? (t(o, !0), e.scrollOnload && n && window.setTimeout(function() {
              $(document).scrollTop(o.offset().top)
          }, 0)) : e.defaultTab > -1 && t(p.find("a").eq(e.defaultTab), !0), !!o.size()
      }
      var l = $(this),
          c = l.find(".js-tabs ul, .js-tabs ol");
      if (0 === c.length) return l;
      var d = $(".js-tab-content"),
          u = "tab-",
          h = "-enhanced";
      d.addClass("tabs-body").attr("aria-live", "polite"), i = n(c), "accordion" === i ? o(l, c) : c.addClass("tabs-nav").attr("role", "tablist"), d.find(".js-tab-pane").each(function() {
          $(this).addClass("tabs-panel").attr("role", "tabpanel").attr("aria-hidden", !0).attr("aria-expanded", !1).attr("aria-labelledby", u + $(this).attr("id")).attr("id", $(this).attr("id") + h).hide()
      });
      var p = a(d, c);
      p.find("a").each(function(t) {
          var e = $(this).attr("href").split("#")[1];
          $(this).attr("role", "tab").attr("id", u + e).attr("aria-controls", e).attr("aria-flowto", e)
      }), l.on("keydown", function(t) {
          if (!(t.keyCode < $.ui.keyCode.PAGE_UP || t.keyCode > $.ui.keyCode.DOWN)) {
              var i, n;
              switch (t.keyCode) {
                  case $.ui.keyCode.RIGHT:
                      t.preventDefault(), i = e.selected + 1;
                      break;
                  case $.ui.keyCode.DOWN:
                      i = e.selected + 1;
                      break;
                  case $.ui.keyCode.UP:
                      i = e.selected - 1;
                      break;
                  case $.ui.keyCode.LEFT:
                      i = e.selected - 1;
                      break;
                  case $.ui.keyCode.END:
                      i = p.length - 1;
                      break;
                  case $.ui.keyCode.HOME:
                      i = 0;
                      break;
                  case $.ui.keyCode.PAGE_UP:
                      if (!t.ctrlKey) return;
                      i = e.selected + 1;
                      break;
                  case $.ui.keyCode.PAGE_DOWN:
                      if (!t.ctrlKey) return;
                      if (i = e.selected + 1, !t.ctrlKey) return;
                      i = e.selected - 1
              }
              return t.preventDefault(), t.stopPropagation(), void 0 !== i && (i = i >= p.length ? 0 : 0 > i ? p.length - 1 : i, n = p.find("a").eq(i), n.focus(), e.selected = i), !1
          }
      }), l.bind("click keydown focus", function() {
          e.autoRotate && clearInterval(tabRotator)
      }), e.trackState && $.historyInit(r, e.srcPath), r(null, !0), p.on("click", "a", function() {
          return $(this).closest(".js-heading-tab").hasClass("active") ? s($(this)) : t($(this)), $(this).focus(), !1
      }), e.alwaysScrollToTop && $(window)[0].scrollTo(0, 0), "undefined" != typeof GOVUK.stopScrollingAtFooter && GOVUK.stopScrollingAtFooter.updateFooterTop()
  })
};