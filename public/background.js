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
var hasExceededBuffer = false;

// {"16-3-2018": {"www.example.com": {accessDuration: 4001, ...}, ...}, "17-3-2018": {...}, ...}   
var analyticsData = {};     

/* Functions */
getTodaysDate = () => {
  const d = new Date();

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

currentSite = () => {
  chrome.tabs.query({"active": true , "currentWindow": true}, tabs => {
    let todaysDate = getTodaysDate();
    const currentSiteHost = tabs[0].url.split("/")[2];

    if (siteHost == currentSiteHost) {
      console.log("same site");
    }
    else {
      console.log("new site");
      if (siteHost !== undefined){
        accessDuration = new Date().getTime() - accessTime; //calculate prev site access duration

        // If date record does not exist, create it
        if (!analyticsData[todaysDate]) analyticsData[todaysDate] = {}; 

        // If site record already exists, update it
        if (analyticsData[todaysDate][siteHost]) {
          const newAccessDuration = analyticsData[todaysDate][siteHost].accessDuration + accessDuration;
          analyticsData[todaysDate][siteHost] = {
            ...analyticsData[todaysDate][siteHost],
            accessDuration: newAccessDuration
          };            
        }
        // Else, add a new site record
        else {
          analyticsData[todaysDate][siteHost] = {
            accessDuration
          };              
        }

        console.log("analyticsData:", analyticsData);
        auth.onAuthStateChanged(user => {
          if (user) {
            db.ref('analytics').child(user.uid).child(todaysDate).remove(err => {
              if (!err) {
                db.ref('blacklists').child(user.uid).once('value', snap => {
                  const blacklist = snap.val() == null ? [] : Object.values(snap.val());
                  Object.keys(analyticsData[todaysDate]).map(k => {
                    db.ref('analytics').child(user.uid).child(todaysDate).push({
                      ...analyticsData[todaysDate][k],
                      siteHost: k, 
                      isBlacklisted: blacklist.indexOf(k) > -1 ? true : false
                    });                   
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

      auth.onAuthStateChanged(user => {
        if (user) {
          db.ref('blacklists').child(user.uid).once('value', snap => {
            const blacklist = snap.val() == null ? [] : Object.values(snap.val());

            if (siteHost != null && blacklist.indexOf(siteHost) > -1) {
              console.log("Entered blacklisted website");
              blacklistNotification();
              bufferCountDown();
            }
          });
        }
      });
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

    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).once('value', snap => {
          const blacklist = snap.val() == null ? [] : Object.values(snap.val());
          
          if (!(blacklist.indexOf(siteHost) > -1)) {
            console.log("Exited blacklisted site before buffer exceeded");
            clearInterval(a);
          }
        });
      }
    });
		
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

/* Program */
auth.onAuthStateChanged(user => {
  if (user) {
    // Whenever blacklist changes...
    db.ref('blacklists').child(user.uid).on('value', snap => {
      // Update today's analyticsData's isBlacklisted values
      const todaysDate = getTodaysDate();
      const blacklist = snap.val() == null ? [] : Object.values(snap.val());
      
      db.ref('analytics').child(user.uid).child(todaysDate).once('value', snap2 => {
        if (snap2.val() != null) {
          Object.keys(snap2.val()).forEach(k => {
            db.ref('analytics').child(user.uid).child(todaysDate).child(k).update({
              isBlacklisted: blacklist.indexOf(snap2.val()[k].siteHost) > -1 ? true : false
            });
          });              
        }
      });
    });
  }
});

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