import React, { Component } from 'react';
import DemoA from './DemoA';
import PropTypes from 'prop-types';
import firebase from '../firebase';
import './Farm.css';
import Lottie from 'react-lottie';
import money_icon from '../img/total_earning.png';
import home_icon from '../img/home.png';
import drought_icon from '../img/drought.png';
import fire_icon from '../img/fire.png';
import harvest_icon from '../img/harvest.png';
import thunder_icon from '../img/thunder.png';

import Load from './Load';

import * as animationData_a from '../animation/growth_00.json';
import * as animationData_b from '../animation/growth_01.json';
import * as animationData_c_front from '../animation/growth_02_front.json';
import * as animationData_c_back from '../animation/growth_02_back.json';

import * as animationData_0 from '../animation/all_00.json';
import * as animationData_1 from '../animation/all_01.json';
import * as animationData_2 from '../animation/all_02.json';
import * as animationData_3 from '../animation/all_03.json';
import * as animationData_4 from '../animation/all_04.json';
import * as animationData_5 from '../animation/all_05.json';
import * as animationData_6 from '../animation/all_06.json';
import * as animationData_7 from '../animation/all_07.json';
import * as animationData_8 from '../animation/all_08.json';
import * as animationData_9 from '../animation/all_09.json';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Logout from './Logout';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// import {ModalContainer, ModalDialog} from 'react-modal-dialog';


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
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth() - 1, a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  console.log("B Time: " + utc2);
  console.log("A time: " + utc1 );

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
      bufferTime: 300,
      // minDailyUsage: 3600,
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

      /** --hey there!----- below is updated animation -----------**/

      // isStopped_arr: [true, true, true, true, true, true, true, true, true, true],
      // isPaused_arr: [false, false, false, false, false, false, false, false, false, false],
      // speed_arr: [1,1,1,1,1,1,1,1,1,1],
      // direction_arr: [1,1,1,1,1,1,1,1,1,1],
      // isLike_arr: [false, false, false, false, false, false, false, false, false, false], 

      isStopped_0: true,
      isPaused_0: false,
      speed_0: 1,
      direction_0: 1,
      isLike_0: false,

      isStopped_1: true,
      isPaused_1: false,
      speed_1: 1,
      direction_1: 1,
      isLike_1: false,

      isStopped_2: true,
      isPaused_2: false,
      speed_2: 1,
      direction_2: 1,
      isLike_2: false,

      isStopped_3: true,
      isPaused_3: false,
      speed_3: 1,
      direction_3: 1,
      isLike_3: false,

      isStopped_4: true,
      isPaused_4: false,
      speed_4: 1,
      direction_4: 1,
      isLike_4: false,

      isStopped_5: true,
      isPaused_5: false,
      speed_5: 1,
      direction_5: 1,
      isLike_5: false,

      isStopped_6: true,
      isPaused_6: false,
      speed_6: 1,
      direction_6: 1,
      isLike_6: false,

      isStopped_7: true,
      isPaused_7: false,
      speed_7: 1,
      direction_7: 1,
      isLike_7: false,

      isStopped_8: true,
      isPaused_8: false,
      speed_8: 1,
      direction_8: 1,
      isLike_8: false,

      isStopped_9: true,
      isPaused_9: false,
      speed_9: 1,
      direction_9: 1,
      isLike_9: false,

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
      date: "",
      // day_counter_debug: 0, 
      /*for debug mode*/

      /*for level up*/
      open_levelup: false,
      open_leveldown: false, 
      /*for level up*/

      /* for combo */
      combo_3days: false,
      combo_effect: 0,
      /* for combo */

      /* for events */
      open_event: false, 
      // event_effect: 0, 
      events: [-1],
      event_now: -1, 
      /* for events */

      /* for items alert */
      open_item: false,
      item_used: -1,
      item_used_event: -1,
      item_msg: -1,
      item_effect: 0,
      /* for items alert */

      debugMode: false,
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
    events_effect: [3, -6, -2, -4], //  0 = harvest (lv1 chance -> 0.04), 1 = drought (0.01), 2 = thunder (0.025), 3 = fire (0.015)
    events_name: ['Harvest', 'Drought', 'Thunder', 'Fire'],
    events_icon_name: ['../img/harvest.png', '../img/drought.png', '../img/thunder.png', '../img/fire.png'], 
    one_day_item: ["0", "1", "2"],
    one_use_item: ["9", "10", "11"],
    items_name: ["Fertilizer", "Super Fertilizer", "Monopoly", "", "Rainwater Harvesting System", "", "", "", "", "Fire Extinguisher", "Weather Forecast", "Backup Water"],
    //events_icon_name: ['harvest_icon', 'drought_icon', 'thunder_icon', 'fire_icon'],
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
    var combo_bool = false;
    var check_time_for_combo_array = [];
    var self = this;
    var found_item_index = [];

    auth.onAuthStateChanged(user => {
      if (user){
        db.ref('farm').child(user.uid).orderByChild('day').limitToLast(3).once('value', (snapShot) => {
          // console.log("number of query object: " + snapShot.numChildren());
          if (snapShot.numChildren() == 3){
            snapShot.forEach((childS) => {
              if (childS.val().timeInBlacklist <= self.state.bufferTime){
                check_time_for_combo_array.push(true);
              } else {
                check_time_for_combo_array.push(false);
              }
            });
            combo_bool = true;
            for (let i = 0; i < 3; i++){
              combo_bool = combo_bool && check_time_for_combo_array[i];
            }
          }
        }).then(function (){
          // console.log("combo_bool_result: " + combo_bool);
          db.ref('inventories').child(user.uid).once('value', snap => {
            if (snap.val() !== null){
              for (let i = 0; i < Object.keys(snap.val()).length; i++){
                found_item_index.push(Object.values(snap.val())[i]);
              }
            }
            if (found_item_index.length !== 0 && self.state.events[0] !== -1){
              if ((found_item_index.indexOf("9") > -1) && (self.state.events.indexOf(3) > -1)){
                let b = [];
                let index = self.state.events.indexOf(3);
                b = self.state.events.slice(0);
                b.splice(index, 1);
                self.setState({events: b});
                self.item_findORclear(3, "9");
                self.handleItemOpen(2,9,3);
              } else if ((found_item_index.indexOf("10") > -1) && (self.state.events.indexOf(2) > -1)){
                let b = [];
                let index = self.state.events.indexOf(2);
                b = self.state.events.slice(0);
                b.splice(index, 1);
                self.setState({events: b});
                self.item_findORclear(3, "10");
                self.handleItemOpen(2,10,2);
              } else if  ((found_item_index.indexOf("11") > -1) && (self.state.events.indexOf(1) > -1)){
                let b = [];
                let index = self.state.events.indexOf(1);
                b = self.state.events.slice(0);
                b.splice(index, 1);
                self.setState({events: b});
                self.item_findORclear(3, "11");
                self.handleItemOpen(2,11,1);
              } else if  ((found_item_index.indexOf("4") > -1) && (self.state.events.indexOf(1) > -1)){
                let b = [];
                let index = self.state.events.indexOf(1);
                b = self.state.events.slice(0);
                b.splice(index, 1);
                self.setState({events: b});
                self.handleItemOpen(2,4,1);
              }
            }
          }).then(function () {
           
            v_farmLevel = self.state.farmLevel;
            v_base_dailyWage = self.props.dailyWage_start + (5 * v_farmLevel);
            if (blacklistTime < self.state.bufferTime){
              v_dailyWage = v_base_dailyWage;
            } else {
              v_dailyWage = Math.max(v_base_dailyWage - (v_base_dailyWage * blacklistTime / 1800), v_base_dailyWage*2*-1);
            }

            // console.log("daily wage be4 combo: " + v_dailyWage);
        
            if (combo_bool){ // combo effect 
              v_dailyWage = v_dailyWage + 5; 
              self.setState({combo_effect: 5});
            } else if (!combo_bool){
              self.setState({combo_effect: 0});
            }

            // console.log("daily wage be4 event: " + v_dailyWage);

            // if there is an one_use_item, then remove the event from state, then use that item (item_clear()) --> item indicator 
            // if there is an one_day_item, then remove the event from state 
            // if there is no item, nothing happens 


            if (self.state.events.indexOf(-1) !== 0){
              for (var j = 0 ; j < self.state.events.length; j ++){
                v_dailyWage = v_dailyWage + self.props.events_effect[self.state.events[j]];
              }
            }

            var p_d = v_dailyWage;
            if (found_item_index.length !== 0){
              if (found_item_index.indexOf("0") > -1){
                v_dailyWage = v_dailyWage * 1.1;
              } else if (found_item_index.indexOf("1") > -1){
                v_dailyWage = v_dailyWage * 2;
              } else if (found_item_index.indexOf("2") > -1){
                v_dailyWage = v_dailyWage + 80; 
              }
            }
            self.setState({item_effect: v_dailyWage - p_d});

            // v_dailyWage = v_dailyWage + self.state.event_effect; //random event effect 
        
            if (self.state.one_week_earning && self.state.one_week_earning.length > 0) {
              v_array_one_week_earning = self.state.one_week_earning.slice(0);
              if (self.state.one_week_earning.length < self.state.day_counter) {
                v_array_one_week_earning.push(v_dailyWage);
              }
            } else {
              v_array_one_week_earning = [];
              v_array_one_week_earning.push(v_dailyWage);
            }

            console.log("Daily Wage: " + v_dailyWage);
        
            if (debugMode){
              self.setState({ // note that one_week_earning array is not saved in state but upload to firebase for easier reading5
                timeInBlacklist: blacklistTime,
                dailyWage: v_dailyWage,
                farmLevel: v_farmLevel,
                combo_3days: combo_bool,
              }, function () {
                self.nextDay(true);
              });
            }
            else {
              var parts = self.state.date.split('-');
              var myLatestDate = new Date(parts[0], parts[1], parts[2]);
              var dd = new Date();
              console.log("latest date: " + myLatestDate);
              console.log("current date: " + dd );
              console.log("Difference in DATES: " + dateDiffInDays(myLatestDate, dd));

              var my_date; 
              if (dateDiffInDays(myLatestDate, dd) >= 0){
                my_date = getTodaysDate();
              } else {
                my_date = self.state.date;

              }
              console.log("My date TO BE UPDATE DAY!!!!****: " + my_date);

              self.setState({ // note that one_week_earning array is not saved in state but upload to firebase for easier reading5
                timeInBlacklist: blacklistTime,
                dailyWage: v_dailyWage,
                farmLevel: v_farmLevel,
                combo_3days: combo_bool,
              }, function () {  
                const item = { 
                  day: self.state.day_counter,
                  // day_debug: this.state.day_counter,
                  dailyWage: v_dailyWage,
                  timeInBlacklist: blacklistTime,
                  totalEarning: self.state.totalEarning,
                  farmLevel: v_farmLevel,
                  one_week_earning: v_array_one_week_earning,
                  one_week_earning_total: self.state.one_week_earning_total,
                  // date: getTodaysDate(),
                  date: my_date,
                  combo: this.state.combo_3days,
                  events: this.state.events,
                  remainingBufferTime: this.state.bufferTime * 1000,
                }
            
                auth.onAuthStateChanged(user => {
                  if (user) {
                    let todaysDate = getTodaysDate();
                    let ddd = new Date();
          
                    db.ref('farm').child(user.uid).once('value', (snap) => { 
                      if (snap.exists()){ // if its first time using this game
                        db.ref('farm').child(user.uid).orderByChild('day').limitToLast(1).once('value', (snapshot) => {
                          snapshot.forEach ((childSnapshot) => {
                            console.log("Key value: " + childSnapshot.val().date);
                            console.log("Todays date: " + todaysDate);
                            // if (String(childSnapshot.val().date) != String(todaysDate)){
                            if (dateDiffInDays(myLatestDate, ddd) > 0){
                              // console.log("I sense difference in date....");
                              clearInterval(self.timerFunc);
                              clearInterval(self.eventFunc);
                              self.nextDay(false);
                            } else {
                              db.ref('farm').child(user.uid).child(my_date).set(item);
                            }
                          });
                        });
                      } else {
                        db.ref('farm').child(user.uid).child(my_date).set(item);
                      }
                    });
                  }
                });
              });
            }
          });
        });
      }
    });

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
          // console.log("*****");
          const accessDuration = v.accessDuration;
          if (v.isBlacklisted) onBlacklistedTime += accessDuration;
        });
      }
      seconds = parseInt(onBlacklistedTime / 1000, 10);
    }

    console.log("Blacklist second Value: " + seconds);
    // console.log("Blacklist duration value: "+ onBlacklistedTime);

    this.setState({
      timeInBlacklist: seconds,
    }, function(){
      self.updateDay(debugMode, this.state.timeInBlacklist);
    })
  }

  nextDay(debugMode){ // debug mode is only correct if you test it on the same day - testing on monday and then testing on tuesday with the same data - will not be correct
    var v_dayCounter, v_array_one_week_earning, v_one_week_earning_total, v_totalEarning, v_farmLevel;
    var v_be4_farmLevel = this.state.farmLevel;

    //remove all one_day_item
    this.item_findORclear(1, 0);

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
    if (v_farmLevel !== v_be4_farmLevel){
      this.handleLevel(v_be4_farmLevel, v_farmLevel);
    }
    // if ((v_farmLevel === 1 && v_be4_farmLevel === 0 ) || (v_farmLevel === 0 && v_be4_farmLevel === 1 )){
    //   this.growth01();
    // } else if ((v_farmLevel === 2 && v_be4_farmLevel === 1 ) || (v_farmLevel === 1 && v_be4_farmLevel === 2 )){
    //   this.growth02();
    // } 

    var p_dayCounter = v_dayCounter - 1;
    var my_p_events = this.state.events.slice(0);

    var p_save_date = this.state.date;
    var save_date;

    if (debugMode){
      save_date = debug_getXDayDate(getTodaysDate(), v_dayCounter);
    }else {
      save_date = getTodaysDate();
    }

    console.log("P_Save_date: " + p_save_date);
    console.log("Save_date: " + save_date);

    this.setState({
      totalEarning: v_totalEarning,
      farmLevel: v_farmLevel,
      day_counter: v_dayCounter,
      one_week_earning_total: v_one_week_earning_total,
      one_week_earning: v_array_one_week_earning,
      pb_percent: v_totalEarning/this.props.upgrades[this.state.farmLevel]*0.906 < 0 ? 0 : v_totalEarning/this.props.upgrades[this.state.farmLevel]*0.906,
      // event_effect: 0, 
      events: [-1],
      date: save_date,
    }, function(){
      // console.log(this.state.one_week_earning);
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
          date: debug_getXDayDate(getTodaysDate(), p_dayCounter),
          combo: this.state.combo_3days,
          events: my_p_events,
          remainingBufferTime: this.state.bufferTime * 1000,
        };
  
        emptyItem = {
          day: v_dayCounter,
          dailyWage: 0,
          timeInBlacklist: 0,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: debug_getXDayDate(getTodaysDate(), v_dayCounter),
          combo: false,
          events: [-1],
          remainingBufferTime: this.state.bufferTime * 1000,
        };
      } else {

        item = { 
          day: p_dayCounter,
          dailyWage: this.state.dailyWage,
          timeInBlacklist: this.state.timeInBlacklist,
          totalEarning: v_totalEarning,
          farmLevel: v_farmLevel,
          one_week_earning: v_array_one_week_earning,
          one_week_earning_total: v_one_week_earning_total,
          date: p_save_date,
          combo: this.state.combo_3days,
          events: my_p_events,
          remainingBufferTime: this.state.bufferTime * 1000,
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
          combo: false,
          events: [-1],
          remainingBufferTime: this.state.bufferTime * 1000,
        };
      }

      auth.onAuthStateChanged(user => {
        if (user) {
          if (debugMode){
            db.ref('farm').child(user.uid).child(debug_getXDayDate(getTodaysDate(), p_dayCounter)).update(item).then( function () {
              db.ref('farm').child(user.uid).child(debug_getXDayDate(getTodaysDate(), v_dayCounter)).update(emptyItem);
            });
          } else {
            db.ref('farm').child(user.uid).child(p_save_date).update(item).then( function () {
              db.ref('farm').child(user.uid).child(getTodaysDate()).update(emptyItem);
             }).then (function () {
            });
          }
          self.timerFunc = setInterval(
            () => self.getOnBlacklistedTimeToday(false, 0), 1500
          ); 
          self.eventFunc = setInterval(
            () => self.random_events(), 15000
          );           
        }
      });
    });
  }

  nextDay_debug(){
    clearInterval(this.timerFunc);
    clearInterval(this.eventFunc);
    this.getOnBlacklistedTimeToday(true, parseInt(this.refs.timeBL.value,10));
  }

  random_events(){
    var num = Math.random();
    // var num = 0.8;
    console.log("Random event num ******: ", num);
    var found_item_index = []; 
    var event = -1;
    var self = this;

    var chance = [0.085, 0.2, 0.2, 0.2]; //[0.085, 0.015, 0.04, 0.025]; [0.085, 0.2, 0.2, 0.2]
    var actual_chance = [];
    var total = 0;

    for (let v = 0 ; v < chance.length; v++){
      if (v === 0){
        total = total + chance[v];
      } else {
        total = total + chance[v] * Math.pow(1.08, this.state.farmLevel);
      }
      actual_chance.push(total);
    }

    console.log("actual chance array: ", actual_chance);

    auth.onAuthStateChanged(user => {
      if (user){
        db.ref('inventories').child(user.uid).once('value', snap => {
          if (snap.val() !== null){
            for (let i = 0; i < Object.keys(snap.val()).length; i++){
              found_item_index.push(Object.values(snap.val())[i]);
            }
          }
        }).then(function () {
          if (num < actual_chance[0]) {
            event = 0;
          } else if (num < actual_chance[1]){
            event = 1;
            if (found_item_index.length !== 0){
              if (found_item_index.indexOf("4") > -1){
                event = -1;
                self.handleItemOpen(1, 4, 1);
              } else if (found_item_index.indexOf("11") > -1){
                event = -1;
                self.handleItemOpen(1, 11, 1);
                self.item_findORclear(3, "11");
              }
            }
          } else if (num < actual_chance[2]){
            event = 2;
            if (found_item_index.length !== 0){
              if (found_item_index.indexOf("10") > -1){
                event = -1;
                self.handleItemOpen(1, 10, 2);
                self.item_findORclear(3, "10");
              }
            }
          } else if (num < actual_chance[3]){
            event = 3; 
            if (found_item_index.length !== 0){
              if (found_item_index.indexOf("9") > -1){
                event = -1;
                self.handleItemOpen(1, 9, 3);
                self.item_findORclear(3, "9");
              }
            }
          }
      
          console.log("hi random event");
      
          //check length!!!!!!
          if (self.state.events){
            console.log("hi im inside one loop.");
            if (self.state.events.indexOf(event) !== -1){
              event = -1; 
            }
          }
          console.log("tell me the event number: " + event); 
      
          if (event != -1){
            self.handleEvent(event);
          }
        });
      }
    });

  }

  // hello = () => {
  //   // return true; 
  //   var a = 1+3; 
  // }

  item_findORclear = (mode, target) => { // 1 = one_day_item; 2 = one_use_item; 3 = only find and/or clear one item
    auth.onAuthStateChanged(user => {
      if (user){
        db.ref('inventories').child(user.uid).once('value', snap => {
          if (snap.val() !== null){
            // console.log("snap.val():", snap.val());
            // console.log("length", Object.keys(snap.val()).length);
            // console.log("snap true value: ", Object.values(snap.val())[0]);
            if (mode === 1){
              for (var i = 0; i < this.props.one_day_item.length ; i++){
                let found_index = Object.values(snap.val()).indexOf(this.props.one_day_item[i]);
                if (found_index > -1){
                  db.ref('inventories').child(user.uid).child(Object.keys(snap.val())[found_index]).remove();
                  // return true;
                } else {
                  // return false;
                }
              }
            } else if (mode === 2){
              for (var i = 0; i < this.props.one_use_item.length ; i++){
                let found_index = Object.values(snap.val()).indexOf(this.props.one_use_item[i]);
                if (found_index > -1){
                  db.ref('inventories').child(user.uid).child(Object.keys(snap.val())[found_index]).remove();
                  // return true;
                } else {
                  // return false;
                }
              }
            } else if (mode === 3){
              let found_index = Object.values(snap.val()).indexOf(target);
              if ((found_index > -1)){
                db.ref('inventories').child(user.uid).child(Object.keys(snap.val())[found_index]).remove();
                // console.log("hello im inside 1");
                // return true;
              // } else if ((found_index > -1) && (!clear)){
              //   console.log("hello im inside 2");
              //   // return true;
              } else {
                // console.log("hello im inside ----false");
                // return false;
              }
            }
          } else {
            // return false;
          }
        });
      }
      // return false;
    });
  }

  //workable async function but doesn't work for firebase for unknown reasons... 
  asss = async (mode, target, clear) => {
    var booo = await this.item_findORclear(mode, target, clear);
    console.log("Booo value: ", booo);
    return booo;
  }

  componentWillMount(){
  }

  componentDidMount() {
    // console.log("Did i find my 11 item? ", this.asss(3, 11, false));
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('settings').child(user.uid).once('value', snappp => {
          if (snappp.val().debugMode !== null){
            this.setState({
              debugMode: snappp.val().debugMode,
            }, function () {
              console.log(" i found the debug mode...");
            });
          }
        });
        db.ref('analytics').child(user.uid).on('value', snap => {
          this.setState({
            analyticsData: snap.val() === null ? {} : snap.val()
          }, function (){
          });
        });
        db.ref('settings').child(user.uid).on('value', snapp => {
          if (snapp.val() !== null){
            this.setState({
              bufferTime: snapp.val().bufferTime / 1000,
            }, function (){
              console.log("Buffer Time: " + this.state.bufferTime);
            });
          }
        });
        db.ref('farm').child(user.uid).orderByChild('day').limitToLast(1).once('value', (snapshot) => {
          if (snapshot.val() == null){
            if ((this.state.farmLevel === null) || (!this.state.farmLevel)){
              this.setState({fetch:true, date:getTodaysDate(),}, function (){
                this.growth00();
                this.timerFunc = setInterval(
                  () => this.getOnBlacklistedTimeToday(false, 0), 1500
                ); 
                this.eventFunc = setInterval(
                  () => this.random_events(), 7000
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
                date: childSnapshot.val().date,

                combo_3days: childSnapshot.val().combo,
                events: childSnapshot.val().events,
  
                /*below not really necessary to push to firebase*/
                // base_dailyWage: childSnapshot.val().base_dailyWage,
                // dailyWage_randomFactor: childSnapshot.val().dailyWage_randomFactor,
                // maxReductionValue: childSnapshot.val().maxReductionValue,
                // minReductionValue: childSnapshot.val().minReductionValue,
              }, function (){
                this.setState({fetch: true}, function(){
                  console.log("(ComponentDidMount) Today's Date: " + String(getTodaysDate()));
                  console.log("(ComponentDidMount) Firebase's Date: " + String(this.state.date));
                  // if (String(this.state.date) === String(getTodaysDate())){  
                  //   this.timerFunc = setInterval(
                  //     () => this.getOnBlacklistedTimeToday(false, 0), 1000
                  //   ); 
                  // }
                  this.timerFunc = setInterval(
                    () => this.getOnBlacklistedTimeToday(false, 0), 1500
                  ); 
                  this.eventFunc = setInterval(
                    () => this.random_events(), 7000
                  );
                  if (this.state.onceOnly === true){
                    if ((this.state.farmLevel === 0) || (!this.state.farmLevel)){
                        this.growth00();
                    }
                    // } else {
                    //   for (let h = 0; h <= this.state.farmLevel; h++){
                    //     // if (h >= 10){
                    //     // //   break;
                    //     // // } else {
                    //       this.growth_animation(h);
                    //     // }
                    //   }
                    // }

                    if (this.state.farmLevel === 1){
                      this.growth00();
                      this.growth01();
                    } else if (this.state.farmLevel === 2){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                    } else if (this.state.farmLevel === 3){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                    } else if (this.state.farmLevel === 4){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                    } else if (this.state.farmLevel === 5){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                      this.growth05();
                    } else if (this.state.farmLevel === 6){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                      this.growth05();
                      this.growth06();
                    } else if (this.state.farmLevel === 7){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                      this.growth05();
                      this.growth06();
                      this.growth07();
                    } else if (this.state.farmLevel === 8){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                      this.growth05();
                      this.growth06();
                      this.growth07();
                      this.growth08();
                    } else if (this.state.farmLevel === 9){
                      this.growth00();
                      this.growth01();
                      this.growth02();
                      this.growth03();
                      this.growth04();
                      this.growth05();
                      this.growth06();
                      this.growth07();
                      this.growth08();
                      this.growth09();
                    }
                    this.setState({onceOnly: false,
                                   pb_percent: this.state.totalEarning/this.props.upgrades[this.state.farmLevel]*0.906 > 0 ? this.state.totalEarning/this.props.upgrades[this.state.farmLevel]*0.906: 0        
                    });  
                  }
                  
                });
              });
          
          });
          }
        });
      }
    });

    document.addEventListener("keydown", this.handleEscKeyPress, false);

  }

  componentWillUnmount() {
    clearInterval(this.timerFunc);
    clearInterval(this.eventFunc);
    document.removeEventListener("keydown", this.handleEscKeyPress, false)
  }

  // growth_animation(level){
  //   var {isStopped_arr, direction_arr, isLike_arr} = this.state;
  //   console.log("Growth Animation +++++++ : ", level);
  //   console.log("isStopped_arr[level]: ", isStopped_arr[level]);
  //   if (!isStopped_arr[level]){
  //     var temp_arr = direction_arr.slice(0);
  //     temp_arr[level] = temp_arr[level] * -1;
  //     console.log("temp_arr ---- ", temp_arr);
  //     this.setState({direction_arr: temp_arr});
  //   }
  //   var temp_stop_arr = isStopped_arr.slice(0);
  //   var temp_like_arr = isLike_arr.slice(0);
  //   console.log("temp stop arr: ", temp_stop_arr);
  //   console.log("temp like arr: ", temp_like_arr);
  //   temp_stop_arr[level] = false;
  //   console.log("temp stop arr [level]: ", temp_stop_arr[level]);
  //   console.log("temp stop arr: ", temp_stop_arr);
  //   temp_like_arr[level] = !temp_like_arr[level];
  //   this.setState({isStopped_arr: temp_stop_arr, isLike_arr: temp_like_arr});
  // }


  growth00(){
    const {isStopped_0, direction_0, isLike_0} = this.state;
      if (!isStopped_0) {
        this.setState({direction_0: direction_0 * -1});
      }
      this.setState({isStopped_0: false, isLike_0: !isLike_0});
  }

  growth01(){
    const {isStopped_1, direction_1, isLike_1} = this.state;
    if (!isStopped_1) {
      this.setState({direction_1: direction_1 * -1});
    }
    this.setState({isStopped_1: false, isLike_1: !isLike_1});
  }

  growth02(){
    const {isStopped_2, direction_2, isLike_2} = this.state;
      if (!isStopped_2) {
        this.setState({direction_2: direction_2 * -1});
      }
      this.setState({isStopped_2: false, isLike_2: !isLike_2});
  }

  growth03(){
    const {isStopped_3, direction_3, isLike_3} = this.state;
    if (!isStopped_3) {
      this.setState({direction_3: direction_3 * -1});
    }
    this.setState({isStopped_3: false, isLike_3: !isLike_3});
  }

  growth04(){
    const {isStopped_4, direction_4, isLike_4} = this.state;
      if (!isStopped_4) {
        this.setState({direction_4: direction_4 * -1});
      }
      this.setState({isStopped_4: false, isLike_4: !isLike_4});
  }

  growth05(){
    const {isStopped_5, direction_5, isLike_5} = this.state;
    if (!isStopped_5) {
      this.setState({direction_5: direction_5 * -1});
    }
    this.setState({isStopped_5: false, isLike_5: !isLike_5});
  }

  growth06(){
    const {isStopped_6, direction_6, isLike_6} = this.state;
      if (!isStopped_6) {
        this.setState({direction_6: direction_6 * -1});
      }
      this.setState({isStopped_6: false, isLike_6: !isLike_6});
  }

  growth07(){
    const {isStopped_7, direction_7, isLike_7} = this.state;
    if (!isStopped_7) {
      this.setState({direction_7: direction_7 * -1});
    }
    this.setState({isStopped_7: false, isLike_7: !isLike_7});
  }

  growth08(){
    const {isStopped_8, direction_8, isLike_8} = this.state;
      if (!isStopped_8) {
        this.setState({direction_8: direction_8 * -1});
      }
      this.setState({isStopped_8: false, isLike_8: !isLike_8});
  }

  growth09(){
    const {isStopped_9, direction_9, isLike_9} = this.state;
    if (!isStopped_9) {
      this.setState({direction_9: direction_9 * -1});
    }
    this.setState({isStopped_9: false, isLike_9: !isLike_9});
  }

  // growth02(){
  //   const {isStopped_c, direction_c, isLike_c, isStopped_d, direction_d, isLike_d} = this.state;
  //   if (!isStopped_c) {
  //     this.setState({direction_c: direction_c * -1});
  //   }
  //   this.setState({isStopped_c: false, isLike_c: !isLike_c});
  //   if (!isStopped_d) {
  //     this.setState({direction_d: direction_d * -1});
  //   }
  //   this.setState({isStopped_d: false, isLike_d: !isLike_d});
  //   console.log('hi animation 02');

  // }

  handleToggle = () => { 
    this.setState({
      open: !this.state.open
    })
  }

  handleLevel = (p_level, c_level) => { 
    if (p_level < c_level){
      this.setState({
        open_levelup: true,
      }); 
    } else {
      this.setState({
        open_leveldown: true,
      }); 
    }
    setTimeout(() => this.handleLevelUpOrDown(p_level, c_level), 2500);
  }

  handleLevelUpOrDown = (p_level, c_level) => {
    this.setState({
      open_levelup: false,
      open_leveldown: false,
    });
    if ((c_level === 1 && p_level === 0 ) || (c_level === 0 && p_level === 1 )){
      setTimeout(() => this.growth01(), 500);
    } else if ((c_level === 2 && p_level === 1 ) || (c_level === 1 && p_level === 2 )){
      setTimeout(() => this.growth02(), 500);
    } else if ((c_level === 3 && p_level === 2 ) || (c_level === 2 && p_level === 3 )){
      setTimeout(() => this.growth03(), 500);
    } else if ((c_level === 4 && p_level === 3 ) || (c_level === 3 && p_level === 4 )){
      setTimeout(() => this.growth04(), 500);
    } else if ((c_level === 5 && p_level === 4 ) || (c_level === 4 && p_level === 5 )){
      setTimeout(() => this.growth05(), 500);
    } else if ((c_level === 6 && p_level === 5 ) || (c_level === 5 && p_level === 6 )){
      setTimeout(() => this.growth06(), 500);
    } else if ((c_level === 7 && p_level === 6 ) || (c_level === 6 && p_level === 7 )){
      setTimeout(() => this.growth07(), 500);
    } else if ((c_level === 8 && p_level === 7 ) || (c_level === 7 && p_level === 8 )){
      setTimeout(() => this.growth08(), 500);
    } else if ((c_level === 9 && p_level === 8 ) || (c_level === 8 && p_level === 9 )){
      setTimeout(() => this.growth09(), 500);
    } 
  }

  handleEvent = (event) => {
    // console.log("My state EVENT_EFFECT: " + this.state.event_effect);
    // console.log("My Props event_effect: " + this.props.events_effect);
    // var new_effect = this.state.event_effect + this.props.events_effect[event];
    var events_arr;
    if (this.state.events.indexOf(-1) === 0){
      events_arr = [];
    } else {
      events_arr = this.state.events.slice(0);
    }
    events_arr.push(event);

    this.setState({
      open_event: true,
      // event_effect: new_effect,
      event_now: event,
      events: events_arr, 
    });

    // console.log("new event effect: ****" + new_effect);

    setTimeout(() => this.handleEventClose(), 5000);
  }

  handleEventClose = () => {
    this.setState({
      open_event: false,
      event_now: -1,
    })
  }

  sumEventsEffect = () => {
    var t = 0;
    if (this.state.events[0] !== -1){
      for (var j = 0 ; j < this.state.events.length; j ++){
        t = t + this.props.events_effect[this.state.events[j]];
      }
    }
    return t;
  }

  handleItemOpen = (msg, item, event) => {
    this.setState({
      item_used: item,
      item_used_event: event,
      item_msg: msg,
    }, function () {
      this.setState({open_item: true,});
    })
  }

  handleItemClose = () => {
    this.setState({
      open_item: false,
      item_used: -1,
      item_used_event: -1,
      item_msg: -1,
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

  handleEscKeyPress = (event) => {
    if(event.keyCode === 27) {
      this.setState({
        open_event: false,
        open_item: false,
        open_levelup: false,
        open_leveldown: false, 
      });
    }
  }

  render() {

    const {isStopped_a, isPaused_a, direction_a, speed_a, isLike_a} = this.state;
    const {isStopped_b, isPaused_b, direction_b, speed_b, isLike_b} = this.state;
    const {isStopped_c, isPaused_c, direction_c, speed_c, isLike_c} = this.state;
    const {isStopped_d, isPaused_d, direction_d, speed_d, isLike_d} = this.state;

    const {isStopped_0, isPaused_0, direction_0, speed_0, isLike_0} = this.state;
    const {isStopped_1, isPaused_1, direction_1, speed_1, isLike_1} = this.state;
    const {isStopped_2, isPaused_2, direction_2, speed_2, isLike_2} = this.state;
    const {isStopped_3, isPaused_3, direction_3, speed_3, isLike_3} = this.state;
    const {isStopped_4, isPaused_4, direction_4, speed_4, isLike_4} = this.state;
    const {isStopped_5, isPaused_5, direction_5, speed_5, isLike_5} = this.state;
    const {isStopped_6, isPaused_6, direction_6, speed_6, isLike_6} = this.state;
    const {isStopped_7, isPaused_7, direction_7, speed_7, isLike_7} = this.state;
    const {isStopped_8, isPaused_8, direction_8, speed_8, isLike_8} = this.state;
    const {isStopped_9, isPaused_9, direction_9, speed_9, isLike_9} = this.state;
    // const clickHandler = () => {
    //   const {isStopped, direction, isLike} = this.state;
    //   if (!isStopped) {
    //     this.setState({direction: direction * -1})
    //   }
    //   this.setState({isStopped: false, isLike: !isLike})
    // }

    const item_actions_level = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleItemClose}
      />,
    ];

    // const defaultOptionsA = {
    //   loop: false,
    //   autoplay: false, 
    //   animationData: animationData_a,
    //   rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid',
    //   }
    // };

    // const defaultOptionsB = {
    //   loop: false,
    //   autoplay: false, 
    //   animationData: animationData_b,
    //   rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid',
    //   }
    // };

    
    // const defaultOptionsC1 = {
    //   loop: false,
    //   autoplay: false, 
    //   animationData: animationData_c_front,
    //   rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid',

    //   }
    // };

    // const defaultOptionsC2 = {
    //   loop: false,
    //   autoplay: false, 
    //   animationData: animationData_c_back,
    //   // width: '80',
    //   // height: '80',
    //   rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid',
    //     // width: '50',
    //     // height: '50',
    //   }
    // };

    const animationOption_0 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_0,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_1 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_1,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_2 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_2,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_3 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_3,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_4 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_4,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_5 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_5,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_6 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_6,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_7 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_7,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_8 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_8,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }

    const animationOption_9 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_9,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    }
    

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
        <myfont style={{color: '#79A640', 'font-weight':'500', letterSpacing: '0px'}}> Weekly Requirement Met </myfont>
      </React.Fragment>
    ) : (
      <myfont style={{color: '#EF4A45', 'font-weight':'500', letterSpacing: '0px'}}> Weekly Requirement Not Met - ${(this.props.wk_min[this.state.farmLevel] - this.state.one_week_earning_total).toFixed(2)} remaining </myfont> 
    );

    var wage_value = this.state.dailyWage > 0 ? (
      <myfont id="wage_u">+{this.state.dailyWage.toFixed(1)}<br/></myfont> 
    ) : (
      <myfont id="wage_u" style={{color: '#EF4A44'}}>{this.state.dailyWage.toFixed(1)}<br/></myfont> 
    )

    var mins_value = this.state.timeInBlacklist < this.state.bufferTime ? ( //buffer time as 5mins
      <myfont id="mins_u" style={{color: '#79A640'}}>{this.secToMin(this.state.timeInBlacklist)}<ss>mins</ss><br/></myfont> //<ss> sec</ss>
    ) :  this.state.timeInBlacklist > 3600 ? (
      <myfont id="mins_u" style={{color: '#EF4A44'}}>{this.secToHour(this.state.timeInBlacklist)}<ss>hrs</ss><br/></myfont>
    ) : (
      <myfont id="mins_u" style={{color: '#EF4A44'}}>{this.secToMin(this.state.timeInBlacklist)}<ss>mins</ss><br/></myfont>
    );

    var levelUp_text = "Congradulations! You are now level " + this.state.farmLevel + ".";
    var levelDown_text = "Sorry! You are now down to level " + this.state.farmLevel + ".";

    var combo_text = this.state.combo_3days ? (
      <React.Fragment>
      <myfont style={{color: '#79A640', 'font-weight':'700', letterSpacing: '0px'}}>Combo Bonus: Wage +5</myfont> <br/>
      </React.Fragment>
    ) : (
      <myfont></myfont>
    );

    var event_text; 

    switch(this.state.event_now){
      case 0: 
        event_text = (
          <React.Fragment>
            <img src={harvest_icon} width="20%" height="20%"/> <br/>
            <myfont>Harvest Day!</myfont> <br/> <br/>
            <myfont style={{color: '#79A640', fontSize: '35px'}}> Wage +3</myfont>
          </React.Fragment>
        );
        break;
      case 1:
        event_text = (
          <React.Fragment>
            <img src={drought_icon}  width="28%" height="28%"/>  <br/>
            <myfont>There is no rain...</myfont> <br/> <br/>
            <myfont style={{color: '#EF4A44' , fontSize: '35px'}}> Wage -6</myfont>
          </React.Fragment>
        );
        break;
      case 2: 
        event_text = (
          <React.Fragment>
            <img src={thunder_icon}  width="20%" height="20%"/>  <br/>
            <myfont>Thunder storm is coming!</myfont> <br/> <br/>
            <myfont style={{color: '#EF4A44', fontSize: '35px'}}> Wage -2</myfont>
            
          </React.Fragment>
        );
        break;
      case 3:
        event_text = (
          <React.Fragment>
            <img src={fire_icon} width="20%" height="20%"/>  <br/>
            <myfont>Fire is spreading!</myfont> <br/> <br/>
            <myfont style={{color: '#EF4A44', fontSize: '35px'}}> Wage -4</myfont>
          </React.Fragment>
        );
        break;
      default:
        event_text = (<myfont> </myfont>);
    };

    var event_display = [];
    if (this.state.events.indexOf(-1) !== 0){
      for (var k = 0; k < this.state.events.length; k++){
        if (this.props.events_effect[this.state.events[k]] > 0){
          event_display.push(
            <React.Fragment>
              <myfont style={{color: '#79A640', 'font-weight':'700', letterSpacing: '0px'}}>{this.props.events_name[this.state.events[k]]}: wage +{this.props.events_effect[this.state.events[k]]}</myfont><br/>
            </React.Fragment>
          );
        } else {
          event_display.push(
            <React.Fragment>
              <myfont style={{color: '#EF4A44', 'font-weight':'700', letterSpacing: '0px'}}>{this.props.events_name[this.state.events[k]]}: wage {this.props.events_effect[this.state.events[k]]}</myfont><br/>
            </React.Fragment>
          );
        }
      }
    }

    var item_text = this.state.item_msg === 1? (
      <React.Fragment>
      <myfont> <myfont style={{'font-weight':'700'}}>{this.props.items_name[this.state.item_used]}</myfont> just prevents you from <myfont style={{color: '#EF4A44',  'font-weight':'700'}}>{this.props.events_name[this.state.item_used_event]}.</myfont></myfont>
      </React.Fragment>
    ):(
      <React.Fragment>
      <myfont> <myfont style={{'font-weight':'700'}}>{this.props.items_name[this.state.item_used]}</myfont> just saves you from <myfont style={{color: '#EF4A44',  'font-weight':'700'}}>{this.props.events_name[this.state.item_used_event]}.</myfont></myfont>
      </React.Fragment>
    ); 

    // var event_text = this.state.event_now === -1 ? (
    //   <myfont> </myfont>
    // ):(
    //   <React.Fragment>
    //     <img src={require(this.props.events_icon_name[this.state.event_now])}/>
    //     <myfont>{this.props.events_name[this.state.event_now]}</myfont>
    //   </React.Fragment>
    // );

    // <img src={this.props.events_icon_name[this.state.event_now]}/>

    const fetch = this.state.fetch === false;


    return (      
   
      <div className="containerr">
      {
        !fetch ? (
          <React.Fragment>
          <Dialog
            // title={levelUp_text}
            open={this.state.open_levelup}
            // style={{color: 'red', background: 'red'}}
            contentStyle={{paddingRight: '1100px', maxWidth: '0%', display: 'run-in', maxHeight: '0%'}}//width:'0%', display: 'block', zIndex: '1'
            titleStyle={{color: 'white', textAlign: 'center', width: '1000px', fontSize: '40px'}}
            // actionsContainerStyle={{color: 'red', backgroundColor: 'blue'}}
            bodyStyle={{color: 'white', textAlign: 'center', width: '1000px', fontSize: '40px'}}
            overlayStyle={{backgroundColor: 'rgb(34, 33, 33)', opacity: '0.87'}}
            // overlayStyle={{backgroundColor: 'blue'}}
          > 
            {/* <img src={money_icon}/>  */}
            {levelUp_text}
          </Dialog>

          <Dialog
            title={levelDown_text}
            open={this.state.open_leveldown}
            contentStyle={{paddingRight: '1100px', maxWidth: '0%', display: 'run-in', maxHeight: '0%'}}//width:'0%', display: 'block', zIndex: '1'
            titleStyle={{color: 'white', textAlign: 'center', width: '1000px', fontSize: '40px'}}
            overlayStyle={{backgroundColor: 'rgb(34, 33, 33)', opacity: '0.87'}}
          > 
          </Dialog>

          <Dialog 
            // title={levelUp_text}
            open={this.state.open_event}
            // style={{color: 'red', background: 'red'}}
            contentStyle={{paddingRight: '2000px', maxWidth: '0%', display: 'run-in'}}//width:'0%', display: 'block', zIndex: '1'
            // titleStyle={{color: 'white', textAlign: 'center', width: '1000px', fontSize: '40px'}}
            // actionsContainerStyle={{color: 'red', backgroundColor: 'blue'}}
            bodyStyle={{color: 'white', textAlign: 'center', width: '1500px', fontSize: '40px'}}
            overlayStyle={{backgroundColor: 'rgb(34, 33, 33)', opacity: '0.87'}}
            // overlayStyle={{backgroundColor: 'blue'}}
          > 
            {/* <img src={money_icon}/>  */}
            {event_text}
          </Dialog>

          <Dialog
            title={<myfont>Item Consumption</myfont>}
            actions={item_actions_level}
            modal={false}
            open={this.state.open_item}
            // titleStyle={{backgroundColor:'#F4F0C1'}}
          >
            {item_text}
          </Dialog>





          {/* <div>
            {
              this.state.isShowingModal &&
              <ModalContainer>
                  <h1> Testing!!! </h1>
              </ModalContainer> 
            }
          </div> */}

          <div class="top">
          </div>
  
          <div class="toptop" id="total_icon">
            <img src={money_icon}/>
          </div>
  
          <div class="toptop" id="total">
            <myfont id="total_u">{this.state.totalEarning.toFixed(2)} </myfont>
            <myfont id="total_under"> Total Earning </myfont>
          </div>
  
          <div class="toptop" id="wage">
            {wage_value}
            <myfont id="wage_under">Today's Wage</myfont>
          </div>
  
          <div class="toptop" id="mins">
            {mins_value}
            <myfont id="mins_under">Blacklist Time</myfont>
          </div>
  
          <div class="toptop" id="home">

            {/* <img src={home_icon} onClick={this.handleToggle}/> */}
          </div>
  
          {/* <div class="farm_01">
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
          </div> */}

          <div class="farm_01">
              <Lottie options={animationOption_0} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_0}
                      isPaused={isPaused_0}
                      speed={speed_0}
                      direction={direction_0}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_1} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_1}
                      isPaused={isPaused_1}
                      speed={speed_1}
                      direction={direction_1}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_2} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_2}
                      isPaused={isPaused_2}
                      speed={speed_2}
                      direction={direction_2}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_3} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_3}
                      isPaused={isPaused_3}
                      speed={speed_3}
                      direction={direction_3}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_4} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_4}
                      isPaused={isPaused_4}
                      speed={speed_4}
                      direction={direction_4}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_5} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_5}
                      isPaused={isPaused_5}
                      speed={speed_5}
                      direction={direction_5}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_6} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_6}
                      isPaused={isPaused_6}
                      speed={speed_6}
                      direction={direction_6}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_7} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_7}
                      isPaused={isPaused_7}
                      speed={speed_7}
                      direction={direction_7}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_8} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_8}
                      isPaused={isPaused_8}
                      speed={speed_8}
                      direction={direction_8}
              />
          </div>

          <div class="farm_01">
              <Lottie options={animationOption_9} 
                      height={530}
                      width={1400}
                      isStopped={isStopped_9}
                      isPaused={isPaused_9}
                      speed={speed_9}
                      direction={direction_9}
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

          <div class="top_left">
            {combo_text}
            {event_display}
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
  

          { this.state.debugMode &&
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

            <h2> Daily Wage: {this.props.dailyWage_start + (5 * this.state.farmLevel)} - ({this.props.dailyWage_start + (5 * this.state.farmLevel)} * <h22p>{this.state.timeInBlacklist}</h22p> / {this.props.maxExceedBufferTime}) + {this.state.combo_effect} + ({this.sumEventsEffect()}) + {this.state.item_effect} = <h22r>{this.state.dailyWage.toFixed(2)}</h22r> </h2>
            <h22> Daily Wage = Base Daily Wage - (Base Daily Wage * <h22p>Time Spent in Blacklisted Websites</h22p> / Toleration Time) + Combo Bonus + Disaster Effects + Item Effects </h22>
  
          
            {/* <Drawer width={220} openSecondary={true} open={this.state.open} >
              <AppBar title="DLNM" onLeftIconButtonClick={this.handleToggle} />
              <MenuItem disabled={true}>Hi, {this.props.user.providerData.displayName}</MenuItem>
              <MenuItem primaryText="My Farm" containerElement={<Link to="/" />} />
              <MenuItem primaryText="View Inventory" containerElement={<Link to="#" />} />
              <MenuItem primaryText="Shop" containerElement={<Link to="#" />} />
              <Divider />
              <MenuItem primaryText="Browsing Analytics" containerElement={<Link to="/analytics" />} />
              <MenuItem primaryText="Blacklist" containerElement={<Link to="/blacklist" />} />
              <MenuItem primaryText="About" containerElement={<Link to="/about" />} />
              <Logout />
            </Drawer> */}
          </div>
          }
  
          </React.Fragment>
        ) : ( <div class="top_middle"> <Load/> </div>)
      }
      </div>


      
    );
  }
}

export default Farm;