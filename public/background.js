var siteHost;
var accessTime;             //in milliseconds
var accessDuration = 0;     //in milliseconds
var onBlacklist = false;

var hasExceededBuffer = false;

var blacklist = [
  "www.example.com", 
  "example.com", 
  "http://www.example.com", 
  "http://example.com", 
  "https://www.example.com", 
  "https://example.com",
  "www.facebook.com"
];
   
var analyticsData = {};     // {16-3-2018: todayData, 17-3-2018: todayData, ...}
var todayData = {};         // {"www.example.com": {duration: 4001, isBlacklisted: false, ...}, ...}

/* Functions */
currentSite = () => {
  chrome.tabs.query({"active": true , "currentWindow": true}, tabs => {
    if (siteHost == tabs[0].url.split("/")[2]) {
      console.log("same site");
    }
    else {
      console.log("new site");
      if (siteHost !== undefined){
        accessDuration = (new Date().getTime() - accessTime); //calculate prev site access duration

        // If site record already exists, just update it
        if (siteHost in todayData) {
          const newDuration = todayData[siteHost].duration + accessDuration;
          todayData[siteHost] = {
            ...todayData[siteHost], 
            duration: newDuration
          };
        }
        // Else, add a new site record
        else {
          todayData[siteHost] = {
            duration: accessDuration,
            isBlacklisted: blacklist.indexOf(siteHost) > -1 ? true : false
          };
        }
      }

      // Update siteHost as we are on a new site
      siteHost = tabs[0].url.split("/")[2];
      accessTime = new Date().getTime();
      onBlacklist = blacklist.indexOf(siteHost) > -1;

      if (onBlacklist) {
        console.log("Entered blacklisted website");
        blacklistNotification();
        bufferCountDown();
      }
      checkTodayData();
    }
  });
}

bufferCountDown = () => {
	console.log("Buffer countdown start");
	var now = new Date().getTime();
	var bufferEnd = now + 1000*60*5; //5 min buffer time

	var a = setInterval(() => {
		now = new Date().getTime();
		var timeleft = bufferEnd - now;
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    if (onBlacklist == false) {
      console.log("Exited blacklisted site before buffer exceeded");
      clearInterval(a);
    }
		
		if (timeleft < 0) { //buffer exceeded -> penalty
			console.log("Buffer exceeded");
			hasExceededBuffer = true;
			clearInterval(a);
			bufferEndNotification();
		}
	}, 1000);
}

blacklistNotification = () => {
	const opt = {
    type: "basic",
    title: "Blacklist Notification",
    message: "You are on a blacklisted website.\nExit before the buffer ends.",
    iconUrl: "DLNM.png"
 	}	
	chrome.notifications.create(opt, () => {});
}

bufferEndNotification = () => {
	const opt = {
    type: "basic",
    title: "Buffer End Notification",
    message: "Buffer time exceeded...",
    iconUrl: "DLNM.png"
 	}	
	chrome.notifications.create(opt, () => {});
}

millsecToTime = duration => {   //convert duration in milliseconds to time
  var milliseconds = parseInt((duration%1000)/100);
  var seconds = parseInt((duration/1000)%60);
  var minutes = parseInt((duration/(1000*60))%60);
  var hours = parseInt((duration/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

checkTodayData = () => {    //check if today's data is in analyticsData
  var d = new Date();
  var tdyDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();

  //if not, add todayData into analyticsData
  if (!(tdyDate in analyticsData)) {
    analyticsData[tdyDate] = todayData;
  }
}

/* Program */
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({url: chrome.runtime.getURL("index.html")});
});

currentSite();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  currentSite();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  currentSite();
}); 
