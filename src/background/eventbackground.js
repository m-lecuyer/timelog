var tabId;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query == "data") {
    chrome.storage.local.get(function(data) {
      sendResponse({data: data});
    });
    return true;  // to allow async answer
  } else if (request.query == "save") {
    chrome.storage.local.set(request.data);
  }
});

