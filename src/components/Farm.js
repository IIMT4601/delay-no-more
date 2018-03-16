import React, { Component } from 'react';
import DemoA from './DemoA';
import PropTypes from 'prop-types';

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInRange(min, max) {
  return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

function calReductionValue(time, maxBuffer, minV, maxV){ // not used 
  return time / maxBuffer * (maxV - minV);
}

class Farm extends Component {
  constructor() {
    super();
    this.state = {
      totalEarning: 0,
      dailyWage: 10,
      farmLevel: 0,
      timeInBlacklist: 0,
      minReductionValue: 0,
      maxReductionValue: 0,

      dailyWage_reductuionValue: 0,
      dailyWage_randomFactor: 0,

      time_counter: 0,
      day_counter: 0,

      one_week_earning: [],
      one_week_earning_total: 0
      // start_bool: true,
    }
  }

  static defaultProps = {
    minLevel: 0,
    maxLevel: 4,
    dailyWage_start: 10,
    day: 86400,           //24hrs
    minDailyUsage: 3600,  //1hr
    bufferTime: 600,      //10mins
    maxExceedBufferTime: 1800,
    upgrades: [100, 800, 2500, 4000],
    wk_min: [21, 36.75, 56, 78,75, 105],

    //temporaraily only for below values - should be stored either locally or remotely 
    currentLevel: 0,
  }

  tick(){
    this.setState({
      time_counter: this.state.time_counter+1
    }, function (){
      // console.log(this.state.time_counter);
    });
  }

  daySim(){ //

    if (this.refs.timeBL.value === ''){
      this.setState({ timeInBlacklist: getRandomInt(0, this.props.maxExceedBufferTime) });
    } else {
      this.setState({ timeInBlacklist: this.refs.timeBL.value });
    }


    this.setState({
      dailyWage: this.props.dailyWage_start + (5 * this.state.farmLevel),
    }, function () {
      this.setState({
        minReductionValue: this.state.dailyWage * 0.2,
        maxReductionValue: this.state.dailyWage * 0.9,
      }, function (){
        this.setState({
          day_counter: this.state.day_counter + 1,
    
          farmLevel: this.state.farmLevel,
    
          dailyWage_randomFactor: getRandomInRange(0.9, 1.1),
    
        }, function (){
          this.setState({
            dailyWage_reductuionValue: this.state.timeInBlacklist/this.props.maxExceedBufferTime*(this.state.maxReductionValue-this.state.minReductionValue)
          }, function (){
            this.setState({
              dailyWage: this.state.dailyWage * this.state.dailyWage_randomFactor - this.state.dailyWage_reductuionValue
            }, function (){
              this.setState({
                totalEarning: this.state.totalEarning + this.state.dailyWage
              }, function () {
                // console.log(this.state.day_counter);
                // console.log(this.state.timeInBlacklist);
                // console.log(this.state.dailyWage_randomFactor);
                // console.log(this.state.dailyWage_reductuionValue);
                // console.log(this.state.dailyWage); 
    
                this.setState({one_week_earning: [...this.state.one_week_earning, this.state.dailyWage]
                }, function () {
                  var sumSeven = 0;
                  for (var i = 0; i < this.state.one_week_earning.length; i++){
                    sumSeven = sumSeven + this.state.one_week_earning[i];
                  }
                  this.setState({one_week_earning_total: sumSeven});
                  console.log(this.state.one_week_earning);
                  console.log(sumSeven);
            
                  if (this.state.day_counter >= 7){
                    if (this.state.one_week_earning_total < this.props.wk_min[this.state.farmLevel]){
                      if (this.state.farmLevel != 0){
                        this.setState({farmLevel: this.state.farmLevel - 1});
                      }
                    }
                    this.setState({day_counter: 0});
                    this.setState({one_week_earning: []});
                  }
              
                  if (this.state.totalEarning >= this.props.upgrades[this.state.farmLevel]){
                    this.setState({
                      totalEarning: this.state.totalEarning - this.props.upgrades[this.state.farmLevel]
                    }, function () {
                      this.setState({
                        farmLevel: this.state.farmLevel + 1
                      });
                    });
                    console.log('total earnings more than upgrades!');
                  }
                });
    
    
              });
            });
          });
          // console.log(this.state.minReductionValue);
          // console.log(this.state.maxReductionValue);
        });
      });
    })
      
  }

  doSim_secondPart(){
    
  }

  componentDidMount() {
    this.timerFunc = setInterval(
      () => {for (var i = 0; i < 1; i++) {this.tick()}}, 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerFunc);
  }

  render() {

    // console.log(this.props.bufferTime);
    // console.log(this.state.start_bool);
    return (
      <div>
        <h1>Day {this.state.day_counter} (0 = sunday; 6 = saturday) - Total Earning: {this.state.totalEarning.toFixed(2)} </h1>

        <div>
          <label>Time stayed in Blacklisted websites: </label> <br/> <br/>
          <input type="text" ref="timeBL" />
        </div>
        <br/>
        <button type ="button" onClick={this.daySim.bind(this)}> Next Day! </button> 

        <br/> <br/>
        <h4> Current Farm Level: {this.state.farmLevel} </h4>

        <h4> Weekly Minimum Requirement: {this.props.wk_min[this.state.farmLevel]} </h4>

        <h4> Next Automatic Upgrade Requirement: {this.props.upgrades[this.state.farmLevel]} </h4>

        <h4> That week total earning: {this.state.one_week_earning_total.toFixed(2)} </h4>

        <h4> Daily Wage: {this.state.timeInBlacklist} / {this.props.bufferTime} * ({this.state.maxReductionValue} - {this.state.minReductionValue}) = {this.state.dailyWage.toFixed(2)} </h4>

      </div>
    );
  }
}

Farm.propTypes = {
  bufferTime: PropTypes.number, 
}

export default Farm;