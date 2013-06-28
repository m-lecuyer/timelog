var tabId;
var times = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  tabId = tab.id;
  chrome.tabs.executeScript(tab.id, { code: "if (typeof(addTimerToSelected) === 'function') {var x = addTimerToSelected(); x}", allFrames: true }, function (results) {
    console.log(results);});
}
);

//handle the saving and reloading of timers through messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query == "times") {
    console.log(times);
    sendResponse({times: times});
  } else if (request.query == "save") {
    times = request.times;
    console.log(times);
  }
});

