import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Blacklist from './Blacklist';
import Settings from './Settings';
import TimePicker from './TimePicker';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import {amber600, fullWhite} from 'material-ui/styles/colors';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Setup extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      finished: false,
      stepIndex: 0,
      bufferT: "00:00:00",
      // minT: "00:00:00",
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 5,
      }));
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };

  handleBufferTime = (bt) => {
    console.log("Buffer Time: " + bt);
    this.setState({bufferT: bt});
  }

  // handleMinDailyTime = (mt) => {
  //   console.log("Min Daily usage Time: " + mt);
  //   this.setState({minT: mt});
  // }

  handleFinish = () => {
    // console.log("Im finished");
    auth.onAuthStateChanged(user => {
      if (user){
        db.ref('settings').child(user.uid).set({
          bufferTime: this.state.bufferT,
          // minDailyTime: this.state.minT,
        });
        // console.log("Saved to Firebase");
      }
    });
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
      return (
        <div className="stepper-line-height">
          <p style={{textAlign:"left", paddingTop:"50px"}}> 
            Welcome to Delay-No-More! <br/> <br/>
            Delay-No-More is a gamified farm-building/productivity app. To help you build a better browsing habit, this app connects your browsing behaviour and your farm-building progress. In short, your goal is to grow and sustain your farm. So, the less you spend time on unnecessary websites (we call it Blacklisted websites), the more money you will earn each day to grow your farm. To get you started, please read the followings and tell us your browsing preference.  
          </p>
        </div>
      ); 
      case 1:
        return (
          <div className="stepper-line-height stepper-blacklist-outer">
            <p>
              Great to see that you've decided to become more productive! The first step towards this commitment
              is to <span className="stepper-blacklist-text"> create your blacklist.</span> Simply enter the URL of
              any site you want to blacklist below.  To make things easier, we have also recommended some popular websites
              you may want to blacklist.
            </p>
            <Blacklist />
            <br/>
            <p>
              Keep in mind that you may still go on blacklisted websites, but your virtual farm will be penalized if you
              stay on them for too long.
            </p>
          </div>
        );
      case 2:
        return (
          <Settings />
          /*
          <div className="stepper-line-height">
            <p style={{textAlign:"left", paddingTop:"50px"}}> 
              Buffer time allows users to spend for a limited time on blacklisted websites without reducing daily wage. For example, if you specified your buffer time to be 10 minutes, and you browsed only 9 minutes on blacklisted websites, then you would still receive full daily wage on that day. <br/><br/>
              Please tell us the MAXIMUM TIME you want to spend on the blacklisted websites daily:  
            </p>
            <TimePicker bufferTime={this.handleBufferTime}>
            </TimePicker>
            <p  style={{textAlign:"center"}}> Please input Minute and Second </p>
          </div>
          */
        );
      case 3:
        return (
          <div className="stepper-line-height">
            {/* <TimePicker wtime={2} minDailyTime={this.handleMinDailyTime}>
            </TimePicker>
            <p style={{textAlign:"center"}}>
              Please also tell us the MINIMUM TIME you browse DAILY. If within a day, you don't enable this app more than the time you specified above, you will receive NO wage for that day. 
            </p> */}
            <p style={{textAlign:"left", paddingTop:"50px"}}> 
              For each day you log onto this app, you will gain a daily wage. The amount you earn on daily wage majorly depends on the blacklisted time (the time you spend on blacklisted websites). Other than that, random events will occur occasionally according to your level and affect your daily wage. Combo bonus will be given if your blacklist time doesn’t exceed your buffer time for 3 consecutive days. Items can also be bought in the shop to increase your daily wage or to protect your farm from being harmed by random events.  
            </p>
          </div>
        );
      case 4:
        return (
          <div className="stepper-line-height">
            <p style={{textAlign:"left", paddingTop:"50px"}}> 
             if your total earnings reach to the next level requirement (see above figure), the farm will be automatically upgraded. For example, if you have 205 total earnings and you have just reached the next level requirement of 200, then you will be upgraded to the next level and you will have 5 total earnings left.              
            </p>
          </div>
        ); 
      case 5:
        return (
          <div className="stepper-line-height">
            <p style={{textAlign:"left", paddingTop:"50px"}}> 
             Wk X Day X indicates how many days and how many weeks have passed since your first account creation. Please note that this day indicator will only count the day you have signed in. For example, if 20th April 2018 is the first day you use this app, and 30th April 2018 is the second day you use this app, it will indicate as Wk 1 Day2 instead of Wk 2 Day 3. <br/> <br/>            </p>
             This date indicator is important because you need to reach a weekly earning requirement. If you do not do so, you will be automatically downgraded by 1 level. A red text (as shown above) will be displayed reminding how much you need to earn for that week to reach the weekly earning requirement. 
          </div>
        ); 
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
                this.handleFinish();
              }}
            >
              Click here
            </a> to reset the example.
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 100, marginBottom: 50}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            backgroundColor={amber600}
            label={stepIndex === 5 ? 'Finish!' : 'Next'}
            onClick={this.handleNext}
            className="stepper-raised-button"
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel className="step-label"> Welcome! </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label"> Create Blacklist </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label"> Settings </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label"> Daily Wage </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label"> Level Growth </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label"> Weekly Requirement </StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}

export default Setup;