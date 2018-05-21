import React, { Component } from 'react';
import '../styles/Setup.css';

import Blacklist from './Blacklist';
import Settings from './Settings';

import Lottie from 'react-lottie';
import animationData_a from '../animations/stepper_demo';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import {amber600} from 'material-ui/styles/colors';

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
      isStopped_a: true,
      isPaused_a: false,
      speed_a: 1,
      direction_a: 1,
      isLike_a: false,
    }
  }
  
  componentDidMount() {
    this.growth00();
  }

  componentWillUnmount() {}

  growth00 = () => {
    const {isStopped_a, direction_a, isLike_a} = this.state;
    if (!isStopped_a) {
      this.setState({direction_a: direction_a * -1});
    }
    this.setState({isStopped_a: false, isLike_a: !isLike_a});
  }

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

  getStepContent = (stepIndex) => {
    const {isStopped_a, isPaused_a, direction_a, speed_a, isLike_a} = this.state;
    const defaultOptionsA = {
      loop: true,
      autoplay: false, 
      animationData: animationData_a,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid',
      }
    };

    switch (stepIndex) {
      case 0:
      return (
        <div>
          <h1 className="stepper__title--center">Hey there, welcome to 'Delay No More'!</h1>
          <Lottie 
            options={defaultOptionsA} 
            height={450}
            width={450}
            isStopped={isStopped_a}
            isPaused={isPaused_a}
            speed={speed_a}
            direction={direction_a}
          />
          <p>
            In a nutshell, the goal of this app is to help you become more productive.
            The main objective is to grow your own virtual farm by avoiding your own self-defined
            'blacklisted' websites that distract you from your work like <b>*cough*</b> Facebook <b>*cough*</b>.
          </p>
          <p>
            With this app, we want you to practice your own self-discipline.
            Ultimately, we’ve designed it so that it only works best when you’re being honest.
            Sure, you could still grow your farm while slacking on Facebook if you exclude
            it from your blacklist, but then you wouldn’t be cheating anyone else other than yourself.
          </p>
          <p>Click <span className="stepper__span--strong-em">Next</span> if you still wish to continue.</p>
        </div>
      ); 
      case 1:
        return (
          <div>
            <p>
              Great to see that you've decided to become more productive! The first step towards this commitment
              is to <span className="stepper__span--strong-em">create your blacklist. </span>
              Simply enter the URL of any site you want to blacklist below.
              To make things easier, we have also recommended some insanely distracting
              websites that you may want to blacklist.
            </p>
            <Blacklist className="blacklist--full" />
            <p style={{paddingTop: "50px"}}>
              Keep in mind that you may still go on blacklisted websites, but your virtual farm will be penalized if you
              stay on them for too long.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <p>
              We realize that everyone has their own rhythm and habits when they’re working.
              For instance, <em>Jack</em> may take a 10-minute break on Facebook every hour while <em>Jill</em> may take 20.
              For this reason, we have allowed you to set your own buffer time,
              which lets you spend a limited time on your blacklisted websites without penalizing your farm.
            </p>
            <Settings className="settings--full" />
            <p style={{paddingTop: "50px"}}>
              To fit your personal work schedule, you may also set the days in which you want your blacklist to 
              be deactivated. For example, if you’re the type of person who likes to relax during the weekends, 
              you can uncheck <span className="stepper__span--focus">SAT</span> and <span className="stepper__span--focus">SUN
              </span> so that you can go on any website to your heart’s content without having your farm penalized.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="stepper-content__features">
            <div>
              <h1 className="stepper__title">Daily Wage</h1>
              <p>
                You will receive a daily wage for every day you’re logged in.
                The more you spend time on blacklisted websites, the less you earn and vice versa.
              </p>
              <p>
                Random events that happen occasionally, such as natural disasters will also affect your daily wage.
              </p>
              <p>
                You will receive combo bonuses for every 3 consecutive days your time spent
                on blacklisted websites is within your buffer time.
              </p>
              <p>
                Lastly, in-game items can also be bought in our
                <span className="stepper__span--focus"> shop </span>
                to increase your daily wage or to protect your farm from being harmed by random events.
              </p>              
            </div>
            <div>
              <h1 className="stepper__title">Leveling Up</h1>
              <p>
                Your farm will upgrade every time your total earnings reach the next level requirement.
                For example, $200 is required to reach the next level and you earned $205,
                then your farm will automatically <span className="stepper__span--positive">level-up </span> and you will be left with $5.
              </p>              
            </div>
            <div>
              <h1 className="stepper__title">Reaching Your Weekly-Earnings Requirement </h1>
              <p>
                Your farm will <span className="stepper__span--negative">downgrade </span>
                a level if you don’t reach your weekly-earnings requirement.
              </p>
              <p>
                The red text (as shown above) will tell you how much you need to earn in a
                given week in order to reach your weekly-earnings requirement.
              </p>
              <p>
                Wk X Day Y indicates the time that has passed since your account creation.
                Please note that you need to be signed in for your days to be counted.
                For example, if you only sign in 2 days this week, your date indicator will be sown as ‘Wk 1, Day 2’.
              </p>              
            </div>
            <p>Click <span className="stepper__span--strong-em">Finish</span> to start!</p>
          </div>
        );
      default:
        return 'Have fun!';
    }
  }

  renderContent = () => {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      auth.onAuthStateChanged(user => {
        if (user) {
          db.ref('settings').child(user.uid).child('setupCompleted').set(true);
        }
      });
    }

    return (
      <div style={contentStyle} className="stepper__content">
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
            labelColor="white"
            label={stepIndex === 3 ? 'Finish!' : 'Next'}
            onClick={this.handleNext}
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;

    return (
      <div className="stepper">
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel className="stepper__label">Welcome!</StepLabel>
          </Step>
          <Step>
            <StepLabel className="stepper__label">Create Blacklist</StepLabel>
          </Step>
          <Step>
            <StepLabel className="stepper__label">Settings</StepLabel>
          </Step>
          <Step>
            <StepLabel className="stepper__label">How this Farming Game Works</StepLabel>
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