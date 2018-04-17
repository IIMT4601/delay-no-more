import React, { Component } from 'react';
import DemoA from './DemoA';
import PropTypes from 'prop-types';
import firebase from '../firebase';
import './Farm.css';
import Lottie from 'react-lottie';
import money_icon from '../img/total_earning.png';
import home_icon from '../img/home.png';

import Load from './Load';

// import * as animationData from './cow_001.json';
import * as animationData_a from './growth_00.json';
import * as animationData_b from './growth_01.json';
import * as animationData_c_front from './growth_02_front.json';
import * as animationData_c_back from './growth_02_back.json';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Logout from './Logout';


const auth = firebase.auth();
const db = firebase.database();

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function getTodaysDate() {
  const d = new Date();

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

function getXDayDate(diff) {
  const d = new Date();
  d.setDate(d.getDate() + diff);

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

function debug_getXDayDate(myDate, diff) {
  const d = new Date(myDate);
  d.setDate(d.getDate() + diff);

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInRange(min, max) {
  return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

function calReductionValue(time, maxBuffer, minV, maxV){ 
  return time / maxBuffer * (maxV - minV);
}

class Farm extends Component {
  constructor() {
    super();
    this.state = {
      totalEarning: 0,
      dailyWage: 10,
      farmLevel: 0,
      // timeInApp: 0,                 // need daily browsing duration to avoid get rewards without browsing/using this app 
      timeInBlacklist: 0,
      one_week_earning: [],
      one_week_earning_total: 0,

      // minReductionValue: 0,
      // maxReductionValue: 0,
      // dailyWage_reductuionValue: 0,
      // dailyWage_randomFactor: 0,    // fixed for each day 
      base_dailyWage: 0,

      // time_counter: 0,
      day_counter: 0,
      // start_bool: true,

      // firebase_items: [],

      /*animation variables*/
      isStopped_a: true,
      isPaused_a: false,
      speed_a: 1,
      direction_a: 1,
      isLike_a: false,

      isStopped_b: true,
      isPaused_b: false,
      speed_b: 1,
      direction_b: 1,
      isLike_b: false,

      isStopped_c: true,
      isPaused_c: false,
      speed_c: 1.1,
      direction_c: 1,
      isLike_c: false,

      isStopped_d: true,
      isPaused_d: false,
      speed_d: 1.1,
      direction_d: 1,
      isLike_d: false,

      onceOnly: true,
      /*animation variables*/

      /*progress bar variables*/
      pb_percent: 0, // 0.85 => full (for 500width only)
      pb_width: 650,
      pb_height: 41,
      pb_rounded: true,
      pb_color: "#0078bc",
      pb_animate: true,
      /*progress bar variables*/

      /*for date checking*/
      prevDate: getTodaysDate(),

      /*for menu toggler*/
      open: false,
      /*for menu toggler*/

      /*for load screen*/
      fetch: false,
      /*for load screen*/

      /*analytics data*/
      analyticsData: {},
      /*analytics data*/

      /*for debug mode*/
      // day_counter_debug: 0, 
      /*for debug mode*/
    }
  }

  static defaultProps = {
    // minLevel: 0,
    // maxLevel: 4,
    dailyWage_start: 15,
    // day: 86400,                           //24hrs
    minDailyUsage: 3600,                  //1hr
    bufferTime: 300,                      //5mins
    maxExceedBufferTime: 1800,            //30mins * 3 => 90mins
    upgrades: [50, 120, 218, 342, 494, 672, 878, 1110, 1370, 1656, 1970, 2310],
    wk_min: [41, 60, 83, 109, 140, 176, 218, 266, 322, 386, 460, 545, 643],
  }

  tick(){
    this.setState({
      // pb_percent: this.state.pb_percent+0.1,
    }, function (){
      // console.log(this.state.time_counter);
    });
  }

  updateDay(debugMode, blacklistTime){
    var v_base_dailyWage, v_farmLevel, v_dailyWage, v_array_one_week_earning;

    v_farmLevel = this.state.farmLevel;
    v_base_dailyWage = this.props.dailyWage_start + (5 * v_farmLevel);
    if (blacklistTime < this.props.bufferTime){
      v_dailyWage = v_base_dailyWage;
    } else {
      v_dailyWage = Math.max(v_base_dailyWage - (v_base_dailyWage * blacklistTime / 1800), v_base_dailyWage*2*-1);
    }

    if (this.state.one_week_earning && this.state.one_week_earning.length > 0) {
      v_array_one_week_earning = this.state.one_week_earning.slice(0);
      if (this.state.one_week_earning.length < this.state.day_counter) {
        v_array_one_week_earning.push(v_dailyWage);
      }
    } else {
      v_array_one_week_earning = [];
      v_array_one_week_earning.push(v_dailyWage);
    }

    if (debugMode){
      this.setState({ // note that one_week_earning array is not saved in state but upload to firebase for easier reading5
        timeInBlacklist: blacklistTime,
        dailyWage: v_dailyWage,
        farmLevel: v_farmLevel,
      }, function () {
        this.nextDay(true);
      });
    }
    else {
      this.setState({ // note that one_week_earning array is not saved in state but upload to firebase for easier reading5
        timeInBlacklist: blacklistTime,
        dailyWage: v_dailyWage,
        farmLevel: v_farmLevel,
      }, function () {  
        const item = { 
          day: this.state.day_counter,
          // day_debug: this.state.day_counter,
          dailyWage: v_dailyWage,
          timeInBlacklist: blacklistTime,
          totalEarning: this.state.totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: this.state.one_week_earning_total,
          date: getTodaysDate(),
        }
    
        auth.onAuthStateChanged(user => {
          if (user) {
            let todaysDate = getTodaysDate();
  
            db.ref('farm').child(user.uid).once('value', (snap) => { 
              if (snap.exists()){ // if its first time using this game
                db.ref('farm').child(user.uid).orderByChild('day').limitToLast(1).once('value', (snapshot) => {
                  snapshot.forEach ((childSnapshot) => {
                    console.log("Key value: " + childSnapshot.val().date);
                    console.log("Todays date: " + todaysDate);
                    if (String(childSnapshot.val().date) != String(todaysDate)){
                      console.log("I sense difference in date....");
                      clearInterval(this.timerFunc);
                      this.nextDay(false);
                    } else {
                      db.ref('farm').child(user.uid).child(todaysDate).set(item);
                    }
                  });
                });
              } else {
                db.ref('farm').child(user.uid).child(todaysDate).set(item);
              }
            });
          }
        });
      });
    }

  }

  getOnBlacklistedTimeToday(debugMode, time) {
    var todaysDate = getTodaysDate();
    var onBlacklistedTime = time;
    var seconds;
    var self = this;

    if (debugMode){
      seconds = time; 
    } else {
      if (this.state.analyticsData[todaysDate]) {
        Object.values(this.state.analyticsData[todaysDate]).forEach(v => { //Change this.state.analyticsData
          console.log("*****");
          const accessDuration = v.accessDuration;
          if (v.isBlacklisted) onBlacklistedTime += accessDuration;
        });
      }
      seconds = parseInt(onBlacklistedTime / 1000, 10);
    }

    console.log("Blacklist second Value: " + seconds);
    console.log("Blacklist duration value: "+ onBlacklistedTime);

    this.setState({
      timeInBlacklist: seconds,
    }, function(){
      self.updateDay(debugMode, this.state.timeInBlacklist);
    })
  }

  nextDay(debugMode){ // debug mode is only correct if you test it on the same day - testing on monday and then testing on tuesday with the same data - will not be correct
    var v_dayCounter, v_array_one_week_earning, v_one_week_earning_total, v_totalEarning, v_farmLevel;
    var v_be4_farmLevel = this.state.farmLevel;

    v_farmLevel = this.state.farmLevel;
    
    console.log("NEXT DAY YAHHHHHHHH!");
    /*increment dayCounter*/
    v_dayCounter = this.state.day_counter;
    v_dayCounter += 1;

    console.log("day Counter: " + v_dayCounter);
    //can use % operator to find the day of the week (i.e. Monday)

    /*add daily wage into one_week_earning & re-calculate total Earning*/
    if (v_dayCounter % 7 === 1){ // 1st day of the week
      v_array_one_week_earning = [];
      v_one_week_earning_total = 0;
    } else {
      v_array_one_week_earning = this.state.one_week_earning.slice(0);
    }
    v_array_one_week_earning.push(this.state.dailyWage);
    v_totalEarning = this.state.totalEarning + this.state.dailyWage;
    
    /*check if total earning > upgrade requirement*/
    if (v_totalEarning >= this.props.upgrades[v_farmLevel]){
      v_totalEarning -= this.props.upgrades[v_farmLevel];
      v_farmLevel += 1;
    }

    v_one_week_earning_total = v_array_one_week_earning.reduce((a,b) => a+b, 0); // need to check if this is correct!! 

    /*only for week check*/
    if (v_dayCounter % 7 === 0){
      if (v_one_week_earning_total < this.props.wk_min[v_farmLevel]){
        v_farmLevel = v_farmLevel === 0? v_farmLevel : v_farmLevel - 1;
      }
    }

    /*animation for now*/
    if ((v_farmLevel === 1 && v_be4_farmLevel === 0 ) || (v_farmLevel === 0 && v_be4_farmLevel === 1 )){
      this.growth01();
    } else if ((v_farmLevel === 2 && v_be4_farmLevel === 1 ) || (v_farmLevel === 1 && v_be4_farmLevel === 2 )){
      this.growth02();
    } 

    var p_dayCounter = v_dayCounter - 1;

    this.setState({
      totalEarning: v_totalEarning,
      farmLevel: v_farmLevel,
      day_counter: v_dayCounter,
      one_week_earning_total: v_one_week_earning_total,
      one_week_earning: v_array_one_week_earning,
      pb_percent: v_totalEarning/this.props.upgrades[this.state.farmLevel]*0.906 < 0 ? 0 : v_totalEarning/this.props.upgrades[this.state.farmLevel]*0.906,
    }, function(){
      console.log(this.state.one_week_earning);
          /* variables to be pushed to firebase */ 

      var self = this;
      var item, emptyItem;
      // var p_date;
      // var t_date;

      if (debugMode === true){
        item = { 
          day: p_dayCounter,
          dailyWage: this.state.dailyWage,
          timeInBlacklist: this.state.timeInBlacklist,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: getTodaysDate(),
        };
  
        emptyItem = {
          day: v_dayCounter,
          dailyWage: 0,
          timeInBlacklist: 0,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: getTodaysDate(),
        };
      } else {
        // p_date = getXDayDate(-1);
        // t_date = getTodaysDate();
        item = { 
          day: p_dayCounter,
          dailyWage: this.state.dailyWage,
          timeInBlacklist: this.state.timeInBlacklist,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: getXDayDate(-1),
        };
  
        emptyItem = {
          day: v_dayCounter,
          dailyWage: 0,
          timeInBlacklist: 0,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: getTodaysDate(),
        };
      }

      auth.onAuthStateChanged(user => {
        if (user) {
          if (debugMode){
            db.ref('farm').child(user.uid).child(debug_getXDayDate(getTodaysDate(), p_dayCounter)).update(item).then( function () {
              db.ref('farm').child(user.uid).child(debug_getXDayDate(getTodaysDate(), v_dayCounter)).update(emptyItem);
            });
          } else {
            db.ref('farm').child(user.uid).child(getXDayDate(-1)).update(item).then( function () {
              db.ref('farm').child(user.uid).child(getTodaysDate()).update(emptyItem);
             }).then (function () {
              self.timerFunc = setInterval(
                () => self.getOnBlacklistedTimeToday(false, 0), 1000
              ); 
            });
          }
           
        }
      });
    });
  }

  nextDay_debug(){
    clearInterval(this.timerFunc);
    this.getOnBlacklistedTimeToday(true, parseInt(this.refs.timeBL.value,10));
  }

  componentWillMount(){
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('analytics').child(user.uid).on('value', snap => {
          this.setState({
            analyticsData: snap.val() === null ? {} : snap.val()
          }, function (){
          });
        });
        db.ref('farm').child(user.uid).orderByChild('day').limitToLast(1).once('value', (snapshot) => {
          if (snapshot.val() == null){
            if ((this.state.farmLevel === null) || (!this.state.farmLevel)){
              this.setState({fetch:true}, function (){
                this.growth00();
                this.timerFunc = setInterval(
                  () => this.getOnBlacklistedTimeToday(false, 0), 1000
                ); 
              });
            }
          } else {
            snapshot.forEach ((childSnapshot) => {
              this.setState({
                farmLevel:  childSnapshot.val().farmLevel,
                day_counter: childSnapshot.val().day,
                one_week_earning: childSnapshot.val().one_week_earning,
                totalEarning: childSnapshot.val().totalEarning,
                one_week_earning_total: childSnapshot.val().one_week_earning_total,
                timeInBlacklist: childSnapshot.val().timeInBlacklist,
                dailyWage: childSnapshot.val().dailyWage,

                // day_counter_debug: childSnapshot.val().day_debug,
                // date: childSnapshot.val().date,
  
                /*below not really necessary to push to firebase*/
                // base_dailyWage: childSnapshot.val().base_dailyWage,
                // dailyWage_randomFactor: childSnapshot.val().dailyWage_randomFactor,
                // maxReductionValue: childSnapshot.val().maxReductionValue,
                // minReductionValue: childSnapshot.val().minReductionValue,
              }, function (){
                this.setState({fetch: true}, function(){
                  this.timerFunc = setInterval(
                    () => this.getOnBlacklistedTimeToday(false, 0), 1000
                  ); 
                  if (this.state.onceOnly === true){
                    if ((this.state.farmLevel === 0) || (!this.state.farmLevel)){
                        this.growth00();
                    }
                    if (this.state.farmLevel === 1){
                      this.growth00();
                      this.growth01();
                    } else if (this.state.farmLevel === 2){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                    }
                    this.setState({onceOnly: false,
                                   pb_percent: this.state.one_week_earning_total/this.props.wk_min[this.state.farmLevel]*0.906 > 0 ? this.state.one_week_earning_total/this.props.wk_min[this.state.farmLevel]*0.85: 0        
                    });  
                  }
                });
              });
          
          });
          }
        });
      }
    });

  }

  componentWillUnmount() {
    clearInterval(this.timerFunc);
  }

  growth00(){
    const {isStopped_a, direction_a, isLike_a} = this.state;
      if (!isStopped_a) {
        this.setState({direction_a: direction_a * -1});
      }
      this.setState({isStopped_a: false, isLike_a: !isLike_a});
      console.log('hi animation 00');
  }

  growth01(){
    const {isStopped_b, direction_b, isLike_b} = this.state;
    if (!isStopped_b) {
      this.setState({direction_b: direction_b * -1});
    }
    this.setState({isStopped_b: false, isLike_b: !isLike_b});
    console.log('hi animation 01');
  }

  growth02(){
    const {isStopped_c, direction_c, isLike_c, isStopped_d, direction_d, isLike_d} = this.state;
    if (!isStopped_c) {
      this.setState({direction_c: direction_c * -1});
    }
    this.setState({isStopped_c: false, isLike_c: !isLike_c});
    if (!isStopped_d) {
      this.setState({direction_d: direction_d * -1});
    }
    this.setState({isStopped_d: false, isLike_d: !isLike_d});
    console.log('hi animation 02');

  }

  handleToggle = () => { 
    this.setState({
      open: !this.state.open
    })
  }

  secToMin = (sec) => {
    var m = Math.floor(sec/60);
    var s = (sec%60) / 60;
    return (m+s).toFixed(1);
  }

  secToHour = (sec) => {
    var h = Math.floor(sec/3600);
    var m = (sec%3600) / 3600;
    return (h+m).toFixed(1);
  }

  render() {

    const {isStopped_a, isPaused_a, direction_a, speed_a, isLike_a} = this.state;
    const {isStopped_b, isPaused_b, direction_b, speed_b, isLike_b} = this.state;
    const {isStopped_c, isPaused_c, direction_c, speed_c, isLike_c} = this.state;
    const {isStopped_d, isPaused_d, direction_d, speed_d, isLike_d} = this.state;
    // const clickHandler = () => {
    //   const {isStopped, direction, isLike} = this.state;
    //   if (!isStopped) {
    //     this.setState({direction: direction * -1})
    //   }
    //   this.setState({isStopped: false, isLike: !isLike})
    // }


    const defaultOptionsA = {
      loop: false,
      autoplay: false, 
      animationData: animationData_a,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    };

    const defaultOptionsB = {
      loop: false,
      autoplay: false, 
      animationData: animationData_b,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    };

    
    const defaultOptionsC1 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_c_front,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',

      }
    };

    const defaultOptionsC2 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_c_back,
      // width: '80',
      // height: '80',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
        // width: '50',
        // height: '50',
      }
    };

    var r = this.state.pb_rounded ? Math.ceil(this.state.pb_height / 3.7) : 0;
    var w = this.state.pb_percent ? Math.max(this.state.pb_height, this.state.pb_width * Math.min(this.state.pb_percent, 0.906)): 0;
    var style = this.state.pb_animate ? { "transition": "width 500ms, fill 250ms" } : null;
    // var style_t = { 'fill' : 'red', 'stroke': 'black', 'stroke-width' : '5'};
    // var style_text = {position: 'relative'};

    /*icon size*/
    let yconStyle={ width: '90%', height: '90%'};

    /*weekly requirement checking*/

    var wk_text = this.state.one_week_earning_total >= this.props.wk_min[this.state.farmLevel] ? (
      <React.Fragment>
        <myfont style={{color: '#79A640', 'font-weight':'500'}}> Weekly Requirement Met </myfont>
      </React.Fragment>
    ) : (
      <myfont style={{color: '#EF4A45', 'font-weight':'500'}}> Weekly Requirement Not Met - ${(this.props.wk_min[this.state.farmLevel] - this.state.one_week_earning_total).toFixed(2)} remaining </myfont> 
    );

    var wage_value = this.state.dailyWage > 0 ? (
      <myfont id="wage">+{this.state.dailyWage.toFixed(1)}<br/></myfont> 
    ) : (
      <myfont id="wage" style={{color: '#EF4A44'}}>{this.state.dailyWage.toFixed(1)}<br/></myfont> 
    )

    var mins_value = this.state.timeInBlacklist < 300 ? ( //buffer time as 5mins
      <myfont id="mins" style={{color: '#79A640'}}>{this.secToMin(this.state.timeInBlacklist)}<ss>mins</ss><br/></myfont> //<ss> sec</ss>
    ) :  this.state.timeInBlacklist > 3600 ? (
      <myfont id="mins" style={{color: '#EF4A44'}}>{this.secToHour(this.state.timeInBlacklist)}<ss>hrs</ss><br/></myfont>
    ) : (
      <myfont id="mins" style={{color: '#EF4A44'}}>{this.secToMin(this.state.timeInBlacklist)}<ss>mins</ss><br/></myfont>
    )

    const fetch = this.state.fetch === false;


    return (
      // <div class = "outter">
      //   <div class = "left">
      //     <svg width="100%" height={this.state.pb_height} >
      //       <rect width={this.state.pb_width} height={this.state.pb_height} fill="#527033" rx={r} ry={r}/>
      //       <rect width={w} height={this.state.pb_height * 0.75} fill="#AAD26F" x="11.5%" y="12.5%"   style={style}/>
      //       <text x ="2.6%" y = "74%" fill="white" font-size="24" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"> Lv {this.state.farmLevel} </text>
      //       <text x ="13.6%" y = "68%" fill="white" font-size="18" font-weight="430" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"> This Week Earning: ${this.state.one_week_earning_total.toFixed(2)}   &nbsp;  (${this.props.wk_min[this.state.farmLevel]}) </text>
      //     </svg>
          // <h1>Day {this.state.day_counter} - Total Earning: ${this.state.totalEarning.toFixed(2)} </h1>
          // <br/>
          // <div>
          //   <h22>Time stayed in Blacklisted websites: </h22> <br/> <br/>
          //   <input type="text" ref="timeBL" />
          // </div>
          // <br/>
          // <button type ="button" onClick={this.nextDay.bind(this)}> Next Day! </button> 

          // {/* animation */}
          // {/* <button type ="button" onClick={this.clickHandler.bind(this)}>Animate</button> */}

          // <br/> <br/>

          // <h2> This week total earning:  {this.state.one_week_earning_total.toFixed(2)} </h2>
          // <h22> Weekly Minimum Requirement: {this.props.wk_min[this.state.farmLevel]} </h22>

          // <h2> Current Level: {this.state.farmLevel} </h2>
          // <h22> Next Upgrade Requirement: {this.props.upgrades[this.state.farmLevel]} </h22> 

          // <br/><br/><br/>
      //     {/* <h22><i><h22k> (Buffer Time: 10 minutes) </h22k></i></h22>    */}

          
      //   </div>
      //   <div class = "right">


      //   </div> 

      //   <div class="right_sss">
      //     <Lottie options={defaultOptionsC2} 
      //               height={650}
      //               width={650}
      //               isStopped={isStopped_c}
      //               isPaused={isPaused_c}
      //               speed={speed_c}
      //               direction={direction_c}
      //       />
      //   </div>

      //   <div class="right_s">
      //     <Lottie options={defaultOptionsA} 
      //               height={650}
      //               width={650}
      //               isStopped={isStopped_a}
      //               isPaused={isPaused_a}
      //               speed={speed_a}
      //               direction={direction_a}
      //       />
      //   </div>

      //   <div class="right_ss">
      //     <Lottie options={defaultOptionsB} 
      //               height={650}
      //               width={650}
      //               isStopped={isStopped_b}
      //               isPaused={isPaused_b}
      //               speed={speed_b}
      //               direction={direction_b}
      //       />
      //   </div>

      //   <div class="right_ssss">
      //     <Lottie options={defaultOptionsC1} 
      //               height={650}
      //               width={650}
      //               isStopped={isStopped_d}
      //               isPaused={isPaused_d}
      //               speed={speed_d}
      //               direction={direction_d}
      //       />
      //   </div>

      //   <div class="center_down">
      //     <h2> Daily Wage: {this.state.base_dailyWage} * {this.state.dailyWage_randomFactor.toFixed(2)} - <h22p>{this.state.timeInBlacklist}</h22p> / {this.props.maxExceedBufferTime} * ({this.state.maxReductionValue} - {this.state.minReductionValue}) = <h22r>{this.state.dailyWage.toFixed(2)}</h22r> </h2>
      //     <h22> Daily Wage = Base Daily Wage * Random Factor - (<h22p>Time Spent in Blacklisted Websites</h22p> / Toleration Time) * (MaxReductionValue - MinReductionValue) </h22>
      //   </div>
       
      // </div>
      <div class="container">
      {
        !fetch ? (
          <React.Fragment>
          <div class="top">
          </div>
  
          <div id="total_icon">
            <img src={money_icon}/>
          </div>
  
          <div id="total">
            <myfont id="total_u">{this.state.totalEarning.toFixed(2)} </myfont>
            <myfont id="total_under"> Total Earning </myfont>
          </div>
  
          <div id="wage">
            {wage_value}
            <myfont id="wage_under">Today's Wage</myfont>
          </div>
  
          <div id="mins">
            {mins_value}
            <myfont id="mins_under">Blacklist Time</myfont>
          </div>
  
          <div id="home">

            <img src={home_icon} onClick={this.handleToggle}/>
          </div>
  
          <div class="farm_01">
               <Lottie options={defaultOptionsC2} 
                      height={450}
                      width={450}
                      isStopped={isStopped_c}
                      isPaused={isPaused_c}
                      speed={speed_c}
                      direction={direction_c}
                />
          </div>
  
          <div class="farm_01">
              <Lottie options={defaultOptionsA} 
                      height={450}
                      width={450}
                      isStopped={isStopped_a}
                      isPaused={isPaused_a}
                      speed={speed_a}
                      direction={direction_a}
              />
          </div>
  
          <div class="farm_01">
            <Lottie options={defaultOptionsB} 
                      height={450}
                      width={450}
                      isStopped={isStopped_b}
                      isPaused={isPaused_b}
                      speed={speed_b}
                      direction={direction_b}
              />
          </div>
          
          <div class="farm_01">
            <Lottie options={defaultOptionsC1} 
                      height={450}
                      width={450}
                      isStopped={isStopped_d}
                      isPaused={isPaused_d}
                      speed={speed_d}
                      direction={direction_d}
              />
          </div>
  
          <div class="bar_level">
            <svg width="100%" height={this.state.pb_height}>
              {/* <rect width={this.state.pb_width} height={this.state.pb_height} stroke="#527033" fill="none" stroke-width="3" rx={r} ry={r}/> */}
              <clipPath id="half">
                <rect x="10.36%" y="0%" width="99%" height={this.state.pb_height}/>
              </clipPath>
              <rect width={w} height={this.state.pb_height * 0.9} fill="#AAD26F" x="10%" y="0%"   style={style} rx={r} ry={r} clipPath="url(#half)"/>
              <path fill="none" stroke="#537133" stroke-width="1.5" stroke-miterlimit="10" d="M658.893,29.659c0,3.826-3.582,6.929-8,6.929H8.75c-4.418,0-8-3.103-8-6.929V7.679c0-3.826,3.582-6.929,8-6.929h642.143c4.418,0,8,3.103,8,6.929V29.659z"/>
              <line fill="none" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" x1="75.209" y1="0.75" x2="75.209" y2="36.588"/>
              <text x ="2.6%" y = "68%" fill="black" font-size="24" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"> Lv {this.state.farmLevel} </text>
              <text x ="13.6%" y = "65%" fill="black" font-size="18" font-weight="430" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"> Next Level: ${this.props.upgrades[this.state.farmLevel]} </text>
            </svg>
          </div>

          <div class="top_middle">
            {wk_text}
          </div>
  
           <div class="bar_date_d">
            <svg width="100%" height="100%">
              {/* <rect x="0%" width="93%" fill="white" height="60%" rx="13" ry="13"/> */}
              <text x="0%" y="45%" width="10%" fill="#546B30" font-size="27" font-weight="500" font-family="Roboto"> Day {(this.state.day_counter % 7) + 1} </text>
            </svg>
          </div>
  
          <div class="bar_date_w">
            <svg width="100%" height="100%">
              <clipPath id="half">
                <rect x="0%" y="0%" width="50%" height="60%"/>
              </clipPath>
              {/* <rect x="0%" width="100%" fill="#575757" height="60%" rx="13" ry="13" clipPath="url(#half)"/> */}
              <text textAnchor="end" x="77%" y="45%" fill="#546B30" font-size="27" font-weight="500" font-family="Roboto"> Wk {Math.floor(this.state.day_counter / 7) + 1} </text>
              <text x="85%" y="45%" fill="#546B30" font-size="33" font-weight="500" font-family="Roboto"> | </text>
            </svg>
          </div>
  
  
          <div class="bottom">
            <h1>Day {this.state.day_counter} - Total Earning: ${this.state.totalEarning.toFixed(2)} </h1>
            <br/>
            <div>
              <h22>Time stayed in Blacklisted websites: </h22> <br/> <br/>
              <input type="text" ref="timeBL" />
            </div>
            <br/>
            <button type ="button" onClick={this.nextDay_debug.bind(this)}> Next Day! </button> 
  
            <br/> <br/>
  
            <h2> This week total earning:  {this.state.one_week_earning_total.toFixed(2)} </h2>
            <h22> Weekly Minimum Requirement: {this.props.wk_min[this.state.farmLevel]} </h22>
  
            <h2> Current Level: {this.state.farmLevel} </h2>
            <h22> Next Upgrade Requirement: {this.props.upgrades[this.state.farmLevel]} </h22> 
  
            <br/>
            <h2> Daily Wage: {this.props.dailyWage_start + (5 * this.state.farmLevel)} - ({this.props.dailyWage_start + (5 * this.state.farmLevel)} * <h22p>{this.state.timeInBlacklist}</h22p> / {this.props.maxExceedBufferTime}) = <h22r>{this.state.dailyWage.toFixed(2)}</h22r> </h2>
            <h22> Daily Wage = Base Daily Wage - (Base Daily Wage * <h22p>Time Spent in Blacklisted Websites</h22p> / Toleration Time) </h22>
  
          
            <Drawer width={220} openSecondary={true} open={this.state.open} >
              <AppBar title="DLNM" onLeftIconButtonClick={this.handleToggle} />
              {/* <MenuItem disabled={true}>Hi, {this.props.user.providerData.displayName}</MenuItem> */}
              <MenuItem primaryText="My Farm" containerElement={<Link to="/" />} />
              <MenuItem primaryText="View Inventory" containerElement={<Link to="#" />} />
              <MenuItem primaryText="Shop" containerElement={<Link to="#" />} />
              <Divider />
              <MenuItem primaryText="Browsing Analytics" containerElement={<Link to="/analytics" />} />
              <MenuItem primaryText="Blacklist" containerElement={<Link to="/blacklist" />} />
              <MenuItem primaryText="About" containerElement={<Link to="/about" />} />
              <Logout />
            </Drawer>
          </div>
          </React.Fragment>
        ) : ( <div class="top_middle"> <Load/> </div>)
      }
      </div>


      
    );
  }
}

// Farm.propTypes = {
//   bufferTime: PropTypes.number, 
// }

export default Farm;