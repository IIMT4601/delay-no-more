import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import Blacklist from './Blacklist';
import TimePicker from './TimePicker';
import PropTypes from 'prop-types';
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
      minT: "00:00:00",
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
        finished: stepIndex >= 2,
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

  handleMinDailyTime = (mt) => {
    console.log("Min Daily usage Time: " + mt);
    this.setState({minT: mt});
  }

  handleFinish = () => {
    // console.log("Im finished");
    auth.onAuthStateChanged(user => {
      if (user){
        db.ref('settings').child(user.uid).set({
          bufferTime: this.state.bufferT,
          minDailyTime: this.state.minT,
        });
        // console.log("Saved to Firebase");
      }
    });
  }


  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <p>To setup your blacklist, please enter websites you want to blacklist below.</p>
            <Blacklist>
            </Blacklist>
          </div>
        );
      case 1:
        return (
          <div>
            <TimePicker wtime={1} bufferTime={this.handleBufferTime}>
            </TimePicker>
            <p style={{textAlign:"center"}}>
              Please tell us the MAXIMUM TIME you want to spend on the blacklisted websites daily. 
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <TimePicker wtime={2} minDailyTime={this.handleMinDailyTime}>
            </TimePicker>
            <p style={{textAlign:"center"}}>
              Please also tell us the MINIMUM TIME you browse DAILY. If within a day, you don't enable this app more than the time you specified above, you will receive NO wage for that day. 
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
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onClick={this.handleNext}
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
            <StepLabel>Create Blacklist</StepLabel>
          </Step>
          <Step>
            <StepLabel>Tolerance Time</StepLabel>
          </Step>
          <Step>
            <StepLabel>Minimum Usage Time</StepLabel>
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