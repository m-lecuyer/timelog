var s = document.createElement('script');
s.src = chrome.extension.getURL("src/helpers/jquery-1.9.1.min.js");
s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

s = document.createElement('script');
s.src = chrome.extension.getURL("src/background/timer.js");
s.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);


