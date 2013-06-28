var tabId;
var data = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query == "data") {
    sendResponse({data: data});
  } else if (request.query == "save") {
    data = request.data;
  }
});

