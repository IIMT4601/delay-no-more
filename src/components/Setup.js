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
import {amber600, redA400, greenA400} from 'material-ui/styles/colors';

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
        finished: stepIndex >= 3,
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
          <p style={{textAlign:"left", paddingTop:"40px"}}>
            <h1>Hey you, welcome to Delay-No-More!</h1> <br/> <br/>
            In a nutshell, the goal of this app is to help you become more productive.
            The main objective is to grow your own virtual farm by avoiding your own self-defined
            'blacklisted' websites that distract you from your work like <b>*cough*</b> Facebook <b>*cough*</b>.
            <br/><br/>
            With this app, we want you to practice your own self-discipline.
            Ultimately, we’ve designed it so that it only works best when you’re being honest.
            Sure, you could still grow your farm while slacking on Facebook if you exclude
            it from your blacklist, but then you wouldn’t be cheating anyone else other than yourself.
            <br/><br/>
            Click 'Next' if you still wish continue.
          </p>
        </div>
      ); 
      case 1:
        return (
          <div className="stepper-line-height stepper-blacklist-outer">
            <p>
              Great to see that you've decided to become more productive! The first step towards this commitment
              is to <span className="stepper-blacklist-text"> create your blacklist. </span>
              Simply enter the URL of any site you want to blacklist below.
              To make things easier, we have also recommended some insanely distracting
              websites that you may want to blacklist.
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
          <div className="stepper-settings-outer">
            <div className="stepper-line-height">
              <p style={{textAlign:"left", paddingTop:"40px"}}>
                We realize that everyone has their own rhythm and habits when they’re working.
                For instance, Jack may take a 10-minute break on Facebook every hour while Jill may take 20.
                For this reason, we have allowed you to set your own buffer time,
                which lets you spend a limited time on your blacklisted websites without penalizing your farm.
              </p>
              <br/>
              <Settings />
              <p style={{textAlign:"left", paddingTop:"50px"}}>
                To fit your personal work schedule, you may also set the days in which you
                want your blacklist to be deactivated. For example, if you’re the type of
                person who likes to relax during the weekends, you can uncheck ’SAT’ and
                ’SUN’ so that you can go on any website to your heart’s content without
                having your farm penalized.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="stepper-line-height">
            {/* <TimePicker wtime={2} minDailyTime={this.handleMinDailyTime}>
            </TimePicker>
            <p style={{textAlign:"center"}}>
              Please also tell us the MINIMUM TIME you browse DAILY. If within a day, you don't enable this app more than the time you specified above, you will receive NO wage for that day. 
            </p> */}
            <h1 style={{textAlign:"left", paddingTop:"50px"}}>Daily Wage</h1>
            <p style={{textAlign:"left", paddingTop:"20px"}}>
              You will receive a daily wage for every day you’re logged in.
              The more you spend time on blacklisted websites, the less you earn and vice versa.
              <br/><br/>
              Random events that happen occasionally, such as natural disasters will also affect your daily wage.
              <br/><br/>
              You will receive combo bonuses for every 3 consecutive days your time spent
              on blacklisted websites is within your buffer time.
              <br/><br/>
              Lastly, in-game items can also be bought in our
              <b style={{color:"rgb(255, 64, 129)", fontSize:"17px"}}> shop </b>
              to increase your daily wage or to protect your farm from being harmed by random events.
            </p>
            <h1 style={{textAlign:"left", paddingTop:"50px"}}>Leveling Up</h1>
            <p style={{textAlign:"left", paddingTop:"20px"}}>
              Your farm will upgrade every time your total earnings reach the next level requirement.
              For example, $200 is required to reach the next level and you earned $205,
              then your farm will automatically <b style={{color:greenA400, fontSize:"17px"}}>level-up </b> and you will be left with $5.
            </p>
            <h1 style={{textAlign:"left", paddingTop:"50px"}}>Reaching Your Weekly-Earnings Requirement </h1>
            <p style={{textAlign:"left", paddingTop:"20px"}}>
              Your farm will <b style={{color:redA400, fontSize:"17px"}}>downgrade </b>
              a level if you don’t reach your weekly-earnings requirement.
              <br/><br/>
              The red text (as shown above) will tell you how much you need to earn in a
              given week in order to reach your weekly-earnings requirement.
              <br/><br/>
              Wk X Day Y indicates the time that has passed since your account creation.
              Please note that you need to be signed in for your days to be counted.
              For example, if you only sign in 2 days this week, your date indicator will be sown as ‘Wk 1, Day 2’.
              <br/><br/>
              Click ‘Finish’ to start!
            </p>
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
            label={stepIndex === 3 ? 'Finish!' : 'Next'}
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
            <StepLabel className="step-label"> How this Farming Game Works </StepLabel>
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