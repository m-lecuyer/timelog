var tabId;
var data = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query == "data") {
    chrome.storage.sync.get(function(data) {
      sendResponse({data: data});
    });
    return true;  // to allow async answer
  } else if (request.query == "save") {
    if (data != request.data)
      chrome.storage.sync.set(request.data);
    data = request.data;
  }
});

