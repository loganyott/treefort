function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

// bars
    var elemD = document.getElementById('dbar');
    elemD.style.width = t.days/365 * 100 + "%";
    var elemH = document.getElementById('hbar');
    elemH.style.width = t.hours/24 * 100 + "%";
    var elemM = document.getElementById('mbar');
    elemM.style.width = t.minutes/60 * 100 + "%";
    var elemS = document.getElementById('sbar');
    elemS.style.width = t.seconds/60 * 100 + "%";
//

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

function bars(id, endtime) {

}

var deadline = 'March 22 2017 00:00:01 GMT-0700';
initializeClock('clockdiv', deadline);