// Initialize Firebase
var config = {
  apiKey: "AIzaSyBqzEfNxqvZsZNfGxSzENLy-BPd-VTzFf4",
  authDomain: "delay-no-more-3a8e7.firebaseapp.com",
  databaseURL: "https://delay-no-more-3a8e7.firebaseio.com",
  projectId: "delay-no-more-3a8e7",
  storageBucket: "delay-no-more-3a8e7.appspot.com",
  messagingSenderId: "498467824799"
};
firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.database();

/* Global Variables */
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

// {"16-3-2018": {"www.example.com": {duration: 4001, isBlacklisted: false, ...}, ...}, "17-3-2018": {...}, ...}   
var analyticsData = {};     

/* Functions */
currentSite = () => {
  chrome.tabs.query({"active": true , "currentWindow": true}, tabs => {
    let d = new Date();
    let todaysDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    const currentSiteHost = tabs[0].url.split("/")[2];

    if (siteHost == currentSiteHost) {
      console.log("same site");
    }
    else {
      console.log("new site");
      if (siteHost !== undefined){
        accessDuration = d.getTime() - accessTime; //calculate prev site access duration

        // If date record does not exist, create it
        if (!analyticsData[todaysDate]) analyticsData[todaysDate] = {}; 

        // If site record already exists, update it
        if (analyticsData[todaysDate][siteHost]) {
          const newDuration = analyticsData[todaysDate][siteHost].duration + accessDuration;
          analyticsData[todaysDate][siteHost] = {
            ...analyticsData[todaysDate][siteHost],
            duration: newDuration
          };            
        }
        // Else, add a new site record
        else {
          analyticsData[todaysDate][siteHost] = {
            duration: accessDuration, 
            isBlacklisted: blacklist.indexOf(siteHost) > -1 ? true : false
          };              
        }

        console.log("analyticsData:", analyticsData);
        auth.onAuthStateChanged(user => {
          if (user) {
            db.ref('analytics').child(user.uid).child(todaysDate).remove(err => {
              if (!err) {
                Object.keys(analyticsData[todaysDate]).map(k => {
                  db.ref('analytics').child(user.uid).child(todaysDate).push({
                    siteHost: k, 
                    ...analyticsData[todaysDate][k]
                  });                   
                });
              }
            });
          }
        });
      }

      // Update siteHost as we are on a new site
      siteHost = currentSiteHost;
      accessTime = new Date().getTime();
      onBlacklist = blacklist.indexOf(siteHost) > -1;

      if (onBlacklist) {
        console.log("Entered blacklisted website");
        blacklistNotification();
        bufferCountDown();
      }
    }
  });
}

bufferCountDown = () => {
	console.log("Buffer countdown start");
	let now = new Date().getTime();
	let bufferEnd = now + 1000*60*5; //5 min buffer time

	let a = setInterval(() => {
		now = new Date().getTime();
		let timeleft = bufferEnd - now;
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

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
  let milliseconds = parseInt((duration%1000)/100);
  let seconds = parseInt((duration/1000)%60);
  let minutes = parseInt((duration/(1000*60))%60);
  let hours = parseInt((duration/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
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