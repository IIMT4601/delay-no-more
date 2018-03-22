import React, { Component } from 'react';
import DemoA from './DemoA';
import PropTypes from 'prop-types';
import firebase from '../firebase';
import './Farm.css';
import Lottie from 'react-lottie';
// import * as animationData from './cow_001.json';
import * as animationData_a from './growth_00.json';
import * as animationData_b from './growth_01.json';
import * as animationData_c_front from './growth_02_front.json';
import * as animationData_c_back from './growth_02_back.json';
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

    var v_be4_farmLevel = this.state.farmLevel;

    v_farmLevel = this.state.farmLevel;

    /*Get time-exceed-buffer-time*/
    if (this.refs.timeBL.value === ''){
      v_timeInBlackList = getRandomInt(0, 3000);
      // v_timeInBlackList = getRandomInt(0, this.props.maxExceedBufferTime);
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

    /*temp*/
    if (v_timeInBlackList < this.props.bufferTime){
      v_dailyWage = v_base_dailyWage * v_dailyWage_randomFactor;
    } else {
      v_dailyWage = v_base_dailyWage * v_dailyWage_randomFactor - v_dailyWage_reductionValue;
    }

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

    /*animation for now*/
    if ((v_farmLevel === 1 && v_be4_farmLevel === 0 ) || (v_farmLevel === 0 && v_be4_farmLevel === 1 )){
      this.growth01();
    } else if ((v_farmLevel === 2 && v_be4_farmLevel === 1 ) || (v_farmLevel === 1 && v_be4_farmLevel === 2 )){
      this.growth02();
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
              dailyWage: childSnapshot.val().dailyWage,

              /*below not really necessary to push to firebase*/
              base_dailyWage: childSnapshot.val().base_dailyWage,
              dailyWage_randomFactor: childSnapshot.val().dailyWage_randomFactor,
              maxReductionValue: childSnapshot.val().maxReductionValue,
              minReductionValue: childSnapshot.val().minReductionValue,
            }, function (){
              if (this.state.onceOnly === true){
                if (this.state.farmLevel === 1){
                  this.growth01();
                } else if (this.state.farmLevel === 2){
                  this.growth01();
                  this.growth02();
                }
                this.setState({onceOnly: false});     
              }        
            });
          });
        });
      }
    });

    if ((this.state.farmLevel === 0) || (!this.state.farmLevel)){
      this.growth00();
    } 
    
  }

  componentWillUnmount() {
    // clearInterval(this.timerFunc);
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

  nextDay(){
    this.daySim();
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
        preserveAspectRatio: 'xMidYMid'
      }
    };

    const defaultOptionsB = {
      loop: false,
      autoplay: false, 
      animationData: animationData_b,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid'
      }
    };

    
    const defaultOptionsC1 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_c_front,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid'
      }
    };

    const defaultOptionsC2 = {
      loop: false,
      autoplay: false, 
      animationData: animationData_c_back,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid'
      }
    };

    return (
      <div class = "outter">
        <div class = "left">
          <h1>Day {this.state.day_counter} - Total Earning: ${this.state.totalEarning.toFixed(2)} </h1>
          <br/>
          <div>
            <h22>Time stayed in Blacklisted websites: </h22> <br/> <br/>
            <input type="text" ref="timeBL" />
          </div>
          <br/>
          <button type ="button" onClick={this.nextDay.bind(this)}> Next Day! </button> 

          {/* animation */}
          {/* <button type ="button" onClick={this.clickHandler.bind(this)}>Animate</button> */}

          <br/> <br/>

          <h2> This week total earning:  {this.state.one_week_earning_total.toFixed(2)} </h2>
          <h22> Weekly Minimum Requirement: {this.props.wk_min[this.state.farmLevel]} </h22>

          <h2> Current Level: {this.state.farmLevel} </h2>
          <h22> Next Upgrade Requirement: {this.props.upgrades[this.state.farmLevel]} </h22> 

          <br/><br/><br/>
          {/* <h22><i><h22k> (Buffer Time: 10 minutes) </h22k></i></h22>    */}

          
        </div>
        <div class = "right">


        </div> 

        <div class="right_sss">
          <Lottie options={defaultOptionsC2} 
                    height={650}
                    width={650}
                    isStopped={isStopped_c}
                    isPaused={isPaused_c}
                    speed={speed_c}
                    direction={direction_c}
            />
        </div>

        <div class="right_s">
          <Lottie options={defaultOptionsA} 
                    height={650}
                    width={650}
                    isStopped={isStopped_a}
                    isPaused={isPaused_a}
                    speed={speed_a}
                    direction={direction_a}
            />
        </div>

        <div class="right_ss">
          <Lottie options={defaultOptionsB} 
                    height={650}
                    width={650}
                    isStopped={isStopped_b}
                    isPaused={isPaused_b}
                    speed={speed_b}
                    direction={direction_b}
            />
        </div>

        <div class="right_ssss">
          <Lottie options={defaultOptionsC1} 
                    height={650}
                    width={650}
                    isStopped={isStopped_d}
                    isPaused={isPaused_d}
                    speed={speed_d}
                    direction={direction_d}
            />
        </div>

        <div class="center_down">
          <h2> Daily Wage: {this.state.base_dailyWage} * {this.state.dailyWage_randomFactor.toFixed(2)} - <h22p>{this.state.timeInBlacklist}</h22p> / {this.props.maxExceedBufferTime} * ({this.state.maxReductionValue} - {this.state.minReductionValue}) = <h22r>{this.state.dailyWage.toFixed(2)}</h22r> </h2>
          <h22> Daily Wage = Base Daily Wage * Random Factor - (<h22p>Time Spent in Blacklisted Websites</h22p> / Toleration Time) * (MaxReductionValue - MinReductionValue) </h22>
        </div>
       
      </div>
    );
  }
}

// Farm.propTypes = {
//   bufferTime: PropTypes.number, 
// }

export default Farm;