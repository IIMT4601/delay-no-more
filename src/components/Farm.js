import React, { Component } from 'react';
import DemoA from './DemoA';
import PropTypes from 'prop-types';
import firebase from '../firebase';
import './Farm.css';
import Lottie from 'react-lottie';
import * as animationData from './t_003.json';
import * as animationDataX from './loaders.json';


const auth = firebase.auth();
const db = firebase.database();

function getTodaysDate() {
  const d = new Date();

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

function getOnBlacklistedTimeToday() {
  let todaysDate = getTodaysDate();
  let onBlacklistedTime = 0;

  Object.values(this.state.analyticsData[todaysDate]).forEach(v => { //Change this.state.analyticsData
    const accessDuration = v.accessDuration;
    if (v.isBlacklisted) onBlacklistedTime += accessDuration;
  });

  return onBlacklistedTime;    
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

      minReductionValue: 0,
      maxReductionValue: 0,
      dailyWage_reductuionValue: 0,
      dailyWage_randomFactor: 0,    // fixed for each day 
      base_dailyWage: 0,

      // time_counter: 0,
      day_counter: 0,
      // start_bool: true,

      // firebase_items: [],
      isStopped: true,
      isPaused: false,
      speed: 1,
      direction: 1,
      isLike: false,
    }
  }

  static defaultProps = {
    // minLevel: 0,
    // maxLevel: 4,
    dailyWage_start: 10,
    // day: 86400,                           //24hrs
    minDailyUsage: 3600,                  //1hr
    bufferTime: 600,                      //10mins
    maxExceedBufferTime: 1800,            //30mins
    upgrades: [100, 800, 2500, 4000],
    wk_min: [21, 36.75, 56, 78,75, 105],
  }

  tick(){
    this.setState({
      time_counter: this.state.time_counter+1
    }, function (){
      // console.log(this.state.time_counter);
    });
  }

  daySim(){ //
    var v_farmLevel, v_array_one_week_earning, v_one_week_earning_total;
    var v_timeInBlackList, v_dailyWage, v_base_dailyWage, v_minReductionValue, v_maxReductionValue, v_dailyWage_randomFactor, v_dailyWage_reductionValue;
    var v_totalEarning;
    var v_dayCounter;

    v_farmLevel = this.state.farmLevel;

    /*Get time-exceed-buffer-time*/
    if (this.refs.timeBL.value === ''){
      v_timeInBlackList = getRandomInt(0, this.props.maxExceedBufferTime);
      // this.setState({ timeInBlacklist: getRandomInt(0, this.props.maxExceedBufferTime) });
    } else {
      v_timeInBlackList = this.refs.timeBL.value;
      // this.setState({ timeInBlacklist: this.refs.timeBL.value });
    }

    /*base daily wage*/
    v_base_dailyWage = this.props.dailyWage_start + (5 * v_farmLevel);

    /*calculate daily wage*/
    v_minReductionValue = v_base_dailyWage * 0.2;
    v_maxReductionValue = v_base_dailyWage * 0.9;
    v_dailyWage_randomFactor = getRandomInRange(0.9, 1.1);
    v_dailyWage_reductionValue = calReductionValue(v_timeInBlackList, this.props.maxExceedBufferTime, v_minReductionValue, v_maxReductionValue);
    v_dailyWage = v_base_dailyWage * v_dailyWage_randomFactor - v_dailyWage_reductionValue;



    /* if daily usage of this app is less than 60mins --> no daily wage gain */ /* open up this function when you have the data */
    // if (timeInApp < this.props.minDailyUsage){
    //   v_dailyWage = 0;
    // } 



    /*increment dayCounter*/
    v_dayCounter = this.state.day_counter;
    v_dayCounter += 1;
    //can use % operator to find the day of the week (i.e. Monday)

    /*add daily wage into one_week_earning & re-calculate total Earning*/
    if (v_dayCounter % 7 === 1){ // 1st day of the week
      v_array_one_week_earning = [];
      v_one_week_earning_total = 0;
    } else {
      v_array_one_week_earning = this.state.one_week_earning.slice(0);
    }
    v_array_one_week_earning.push(v_dailyWage);
    v_totalEarning = this.state.totalEarning + v_dailyWage;
    
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

    /*trigger animation*/
    if (v_farmLevel > this.state.farmLevel){
      //build
    } else if (v_farmLevel < this.state.farmLevel){
      //unbuild
    }

    this.setState({
      timeInBlacklist: v_timeInBlackList,
      dailyWage: v_dailyWage,
      totalEarning: v_totalEarning,
      farmLevel: v_farmLevel,
      day_counter: v_dayCounter,
      one_week_earning_total: v_one_week_earning_total,
      one_week_earning: v_array_one_week_earning,
      day_counter: v_dayCounter,

      minReductionValue: v_minReductionValue,
      maxReductionValue: v_maxReductionValue,
      dailyWage_reductuionValue: v_dailyWage_reductionValue,
      dailyWage_randomFactor: v_dailyWage_randomFactor,
      base_dailyWage: v_base_dailyWage,

      isStopped: false,
    }, function(){
      console.log(this.state.one_week_earning);
    });

    /* variables to be pushed to firebase */ 
    const item = { 
      day: v_dayCounter,
      dailyWage: v_dailyWage,
      timeInBlacklist: v_timeInBlackList,
      dailyWage_reductuionValue: v_dailyWage_reductionValue,
      dailyWage_randomFactor: v_dailyWage_randomFactor,
      totalEarning: v_totalEarning,
      farmLevel: v_farmLevel,
      one_week_earning: v_array_one_week_earning,
      one_week_earning_total: v_one_week_earning_total,

      /*below not really necessary to push to firebase*/
      base_dailyWage: v_base_dailyWage,
      dailyWage_randomFactor: v_dailyWage_randomFactor,
      maxReductionValue: v_maxReductionValue,
      minReductionValue: v_minReductionValue,
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('farm').child(user.uid).push(item);
      }
    });
      
  }

  doSim_secondPart(){
    
  }

  componentWillMount(){
  }

  componentDidMount() {
    // this.timerFunc = setInterval(
    //   () => {for (var i = 0; i < 1; i++) {this.tick()}}, 1000
    // );  
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('farm').child(user.uid).orderByChild('day').limitToLast(1).on('value', (snapshot) => {
          // let items = snapshot.val();
          snapshot.forEach ((childSnapshot) => {
            this.setState({
              farmLevel:  childSnapshot.val().farmLevel,
              day_counter: childSnapshot.val().day,
              one_week_earning: childSnapshot.val().one_week_earning,
              totalEarning: childSnapshot.val().totalEarning,
              one_week_earning_total: childSnapshot.val().one_week_earning_total,
              timeInBlacklist: childSnapshot.val().timeInBlacklist,

              /*below not really necessary to push to firebase*/
              base_dailyWage: childSnapshot.val().base_dailyWage,
              dailyWage_randomFactor: childSnapshot.val().dailyWage_randomFactor,
              maxReductionValue: childSnapshot.val().maxReductionValue,
              minReductionValue: childSnapshot.val().minReductionValue,
            }, function (){
            });
          });
        });
      }
    });
  }

  componentWillUnmount() {
    // clearInterval(this.timerFunc);
  }

  render() {
    console.log("getOnBlacklistedTimeToday", getOnBlacklistedTimeToday());

    const {isStopped, isPaused, direction, speed, isLike} = this.state;

    const clickHandler = () => {
      const {isStopped, direction, isLike} = this.state;
      if (!isStopped) {
        this.setState({direction: direction * -1})
      }
      this.setState({isStopped: false, isLike: !isLike})
    }

    const defaultOptions = {
      loop: false,
      autoplay: false, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid scale'
      }

    };
    const defaultOptionsX = {
      loop: false,
      autoplay: false, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid'
      }
      // rendererSettings: {
      //   preserveAspectRatio: xMidYMid 
      // }
    };


    return (
      <div class = "outter">
        <div class = "left">
          <h1>Day {this.state.day_counter} (0 = sunday; 6 = saturday) - Total Earning: {this.state.totalEarning.toFixed(2)} </h1>

          <div>
            <label>Time stayed in Blacklisted websites: </label> <br/> <br/>
            <input type="text" ref="timeBL" />
          </div>
          <br/>
          <button type ="button" onClick={this.daySim.bind(this)}> Next Day! </button> 

          {/* animation */}
          <button type ="button" onClick={clickHandler}>{isLike ? 'unlike' : 'like'}</button>

          <br/> <br/>
          <h4> Current Farm Level: {this.state.farmLevel} </h4>

          <h4> Weekly Minimum Requirement: {this.props.wk_min[this.state.farmLevel]} </h4>

          <h4> Next Automatic Upgrade Requirement: {this.props.upgrades[this.state.farmLevel]} </h4>

          <h4> That week total earning: {this.state.one_week_earning_total.toFixed(2)} </h4>

          <h4> Daily Wage: {this.state.base_dailyWage} * {this.state.dailyWage_randomFactor} - {this.state.timeInBlacklist} / {this.props.maxExceedBufferTime} * ({this.state.maxReductionValue} - {this.state.minReductionValue}) = {this.state.dailyWage.toFixed(2)} </h4>

        </div>
        {/* <div class = "right">
          <h1> Hello </h1>  
          <Lottie options={defaultOptions} 
                  height={400}
                  width={400}
                  isStopped={this.state.isStopped}
          />

        </div> */}

        <div class="right_s">
          
          <Lottie options={defaultOptionsX} 
                    height={400}
                    width={600}
                    isStopped={isStopped}
                    isPaused={isPaused}
                    speed={speed}
                    direction={direction}
            />

        </div>
      </div>
    );
  }
}

// Farm.propTypes = {
//   bufferTime: PropTypes.number, 
// }

export default Farm;