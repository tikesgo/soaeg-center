/**
 * 채널톡(Channel.io) 플러그인 로더 — 모든 페이지 공통
 * pluginKey는 js/channel-config.js 에서 설정합니다.
 */
(function () {
  var w = window;
  if (w.ChannelIO) {
    return;
  }

  var ch = function () {
    ch.c(arguments);
  };
  ch.q = [];
  ch.c = function (args) {
    ch.q.push(args);
  };
  w.ChannelIO = ch;

  function loadChannelScript() {
    if (w.ChannelIOInitialized) {
      return;
    }
    w.ChannelIOInitialized = true;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
    var x = document.getElementsByTagName("script")[0];
    if (x && x.parentNode) {
      x.parentNode.insertBefore(s, x);
    }
  }

  if (document.readyState === "complete") {
    loadChannelScript();
  } else {
    w.addEventListener("DOMContentLoaded", loadChannelScript);
    w.addEventListener("load", loadChannelScript);
  }
})();
