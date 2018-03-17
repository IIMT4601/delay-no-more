var siteHost;
var accessTime;             //in milliseconds
var accessDuration = 0;     //in milliseconds
var onBlacklist = false;

var bufferExceeded = false;
var dataExist = false;

var blacklist = [
  "www.example.com", 
  "example.com", 
  "http://www.example.com", 
  "http://example.com", 
  "https://www.example.com", 
  "https://example.com",
  "www.facebook.com"
];

var analyticsData = new Array();    // {16-3-2018: todayData}, {17-3-2018: todayData}, ... 
var todayData = new Array();        // {host: www.example.com, duration: 4001, isBlacklist: false}, {host: ...}, {}, ...

/* Functions */
currentSite = () => {
  chrome.tabs.query({"active":true , "currentWindow": true}, tabs => {
    if (siteHost == tabs[0].url.split("/")[2]) {
    
      console.log("same site");
    
    }else {
      console.log("new site");

      if (siteHost != undefined){
        accessDuration = (new Date().getTime() - accessTime); //calculate prev site access duration

        //if the site record already exists in array, just update duration
        for (var i=0; i < todayData.length; i++){
            if (todayData[i]['host'] == siteHost){
              dataExist = true;
              todayData[i]['duration'] += accessDuration;
            }
        }
        
        //if not, push new record into array
        if(dataExist == false){
          var prevSite = {
            host: siteHost,
            duration: accessDuration,
            isBlacklist: onBlacklist
          };

          todayData.push(prevSite);
        }
      }

      siteHost = tabs[0].url.split("/")[2];
      accessTime = new Date().getTime();

      if (blacklist.indexOf(siteHost) > -1) {
        console.log("Entered blacklisted website");
        onBlacklist = true;
        blacklistNotification();
        bufferCountDown();
      }
      else {
        onBlacklist = false;
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

millsecToTime = (duration) => {   //convert duration in milliseconds to time
  var milliseconds = parseInt((duration%1000)/100);
  var seconds = parseInt((duration/1000)%60);
  var minutes = parseInt((duration/(1000*60))%60);
  var hours = parseInt((duration/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

checkTodayData = () => {    //check if today's data is in analyticsData array
  var d = new Date();
  var tdyDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
  var dataFlag = false;

  for (var i=0; i<analyticsData.length; i++){
    if(analyticsData[i].hasOwnProperty(tdyDate)) {  //data exists
      dataFlag = true;
    }
  }
  
  if(dataFlag == false){                            //if not, push todayData into array
    analyticsData.push ({[tdyDate]: todayData});
  }
  
  console.log(analyticsData[0]);

  for (var j=0; j<todayData.length; j++){
    console.log(todayData[j]);
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