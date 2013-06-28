var tabId;
var data = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  tabId = tab.id;
  chrome.tabs.executeScript(tab.id, { code: "if (typeof(addTimerToSelected) === 'function') {var x = addTimerToSelected(); x}", allFrames: true }, function (results) {
    console.log(results);});
}
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query == "data") {
    console.log(data);
    sendResponse({data: data});
  } else if (request.query == "save") {
    data = request.data;
    console.log(data);
  }
});

