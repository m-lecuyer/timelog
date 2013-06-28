function isRightIframe() {
  return document.URL == "https://rally1.rallydev.com/slm/analytics/timeTrack";
}

function isPluginContext() {
  if (chrome.runtime)
    return true;
  return false;
}

function addTimerToSelected () {
  var row = $('div.x-grid3-row-selected');
  addTimer(row);
}

function addTimer (row) {
  if (row.find("div.fa-timer").length != 0)
    return;
  row.append('<div class="tb-row tb-table-bordered tb-info fa-timer"></div>');
  var timerDiv = row.find('div.fa-timer');
  //timerDiv.append('<button class="tb-btn tb-btn-danger">Start</button>');
  timerDiv.append('<div class="tb-span2"><p class="">Session start time:</p>'+
                  '<p class="fa-start" id="0"></p></div>');
  timerDiv.append('<div class="tb-span2"><p class="">Session end time:</p>'+
                  '<span class="fa-stop"></span></div>');
  timerDiv.append('<div class="tb-span2"><p class="">Session length:</p>'+
                  '<span class="fa-time"></span></div>');
  timerDiv.append('<div class="tb-span1"><button class="tb-btn tb-btn-success fa-start-stop" OnClick="timerToggle(this)">Start</button></div>');
  timerDiv.append('<div class="tb-span1"><button class="tb-btn tb-btn-info fa-done" OnClick="done(this)">Done</button></div>');
  timerDiv.append('<div class="tb-span2"><p class="">Total work on this task:</p>'+
                  '<div class="fa-total" id="0"></div></div>');
  //return document.location.toString()+" "+$('div.x-grid3-row-selected').text();
};

function getCurrentTimeDiv() {
  r = null;
  $('div.x-grid3-row').each(function (i, obj) {
    jobj = $(obj);
    if (jobj.find('.fa-start-stop').text() == 'Stop')
      r = jobj;
  });
  return r;
}

function timerOn(timerDiv) {
  if (timerDiv.find('.fa-start-stop').text() == 'Stop')
    return true;
  return false;
}

function done(obj) {
  $(obj).parent().parent().remove();
}

function timerToggle (obj) {
  var timerDiv = $(obj).parent().parent();
  if (timerOn(timerDiv)) {
    stopTimer(timerDiv);
  } else {
    startTimer(timerDiv);
  }
}

function startTimer (timerDiv) {
  if (getCurrentTimeDiv())
    stopTimer(getCurrentTimeDiv())
  var start = new Date;
  var startDiv = timerDiv.find('.fa-start');
  startDiv.text(start.getHours()+":"+start.getMinutes()+":"+start.getSeconds());
  startDiv.attr('id', start.toString());
  timerDiv.find('.fa-stop').text("");
  runTimer(timerDiv);
}

function runTimer (timerDiv) {
  var tid = setInterval(function() {
    setTime(timerDiv);
    if (timerDiv.find('.fa-start-stop').text() == 'Start')
      clearInterval(tid);
  }, 1000);
  var sButton = timerDiv.find('.fa-start-stop');
  sButton.text('Stop');
  sButton.removeClass('tb-btn-success').addClass('tb-btn-danger');
}

function setTime(timerDiv) {
  var now = new Date;
  var startDiv = timerDiv.find('.fa-start');
  var start = new Date(startDiv.attr('id'));
  console.log(startDiv.attr('id'));
  delta = Math.round((now - start)/1000);
  h = Math.floor(delta / 3600);
  m = Math.floor((delta % 3600) / 60);
  s = delta - 3600*h - 60*m;
  timerDiv.find('.fa-time').text(h+"h "+m+"m "+s+"s");
}

function stopTimer(timerDiv) {
  var stop = new Date;
  var startDiv = timerDiv.find('.fa-start');
  var start = new Date(startDiv.attr('id'));
  var sButton = timerDiv.find('.fa-start-stop');
  sButton.text('Start');
  sButton.removeClass('tb-btn-danger').addClass('tb-btn-success');
  timerDiv.find('.fa-stop').text(stop.getHours()+":"+stop.getMinutes()+":"+stop.getSeconds());
  updateTotal(timerDiv, Math.round((stop - start)/1000));
}

function updateTotal(timerDiv, sTime) {
  totalNode = timerDiv.find('.fa-total');
  console.log(totalNode.attr('id'));
  console.log(parseInt(totalNode.attr('id')));
  newTot = parseInt(totalNode.attr('id')) + sTime;
  totalNode.attr('id', newTot.toString());
  h = Math.floor(newTot / 3600);
  m = Math.floor((newTot % 3600) / 60);
  s = newTot - 3600*h - 60*m;
  totalNode.text(h+"h "+m+"m "+s+"s");
}

function getRowID(timerDiv) {
  var t1 = timerDiv.find('div.x-grid3-col-2').find('a').text();
  var t2 = timerDiv.find('div.x-grid3-col-3').find('a').text();
  return t1+t2;
}

function resetTimes() {
  console.log("RESET TIMES");
  chrome.runtime.sendMessage({query: "times"}, function(response) {
    var times = response.times;
    console.log(times);
    $('div.x-grid3-row').each(function (i, obj) {
      jobj = $(obj);
      var id = getRowID(jobj);
      if (id in times) {
        rowData = times[id];
        if (rowData.timer.length > 0) {
          addTimer(jobj);
          jobj.find('.fa-start').text(rowData.start);
          jobj.find('.fa-start').attr('id', rowData.startDate);
          jobj.find('.fa-stop').text(rowData.stop);
          jobj.find('.fa-time').text(rowData.time);
          jobj.find('.fa-start-stop').text(rowData.timer);
          jobj.find('.fa-total').attr('id', rowData.totalMS);
          jobj.find('.fa-total').text(rowData.total);
        }
        if (rowData.timer == 'Stop') {
          runTimer(jobj);
        }
      }
  });
  });
}

function collectTimes() {
  var r = {};
  $('div.x-grid3-row').each(function (i, obj) {
    jobj = $(obj);
    r[getRowID(jobj)] = { "start": jobj.find('.fa-start').text(),
                           "startDate": jobj.find('.fa-start').attr('id'),
                           "stop": jobj.find('.fa-stop').text(),
                           "totalMS": jobj.find('.fa-total').attr('id'),
                           "total": jobj.find('.fa-total').text(),
                           "time": jobj.find('.fa-time').text(),
                           "timer": jobj.find('.fa-start-stop').text() }
  });
  return r;
}

function startSaving() {
  setInterval(function() {
    chrome.runtime.sendMessage({query: "save", times: collectTimes()}, function(response) {
    });
  }, 1000);
}

if (isRightIframe() && isPluginContext()) {
  setTimeout(function () { resetTimes(); }, 500);
  setTimeout(function () { startSaving(); }, 1000);
  }
console.log("popup injected");

