var siteHost;
var accessTime;
var onBlacklist = false;
var bufferExceeded = false;
var blacklist = [
  "www.example.com", 
  "example.com", 
  "http://www.example.com", 
  "http://example.com", 
  "https://www.example.com", 
  "https://example.com"
];

/* Functions */
currentSite = () => {
  chrome.tabs.query({"active":true , "currentWindow": true}, tabs => {
    if (siteHost == tabs[0].url.split("/")[2]) {
      console.log("same site");
    }
    else {
      console.log("new site");
      siteHost = tabs[0].url.split("/")[2];
      accessTime = new Date();

      if (blacklist.indexOf(siteHost) > -1) {
        console.log("Entered blacklisted website");
        onBlacklist = true;
        blacklistNotification();
        bufferCountDown();
      }
      else {
        onBlacklist = false;
      }
    }
   });
}

bufferCountDown = () => {
	console.log("Buffer countdown start");
	var now = new Date().getTime();
	var bufferEnd = now + 1000*60*10; //10 min buffer time

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
			bufferExceeded = true;
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

blacklistTimer = () => {}

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