import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Blacklist from './Blacklist';
import {amber600, fullWhite} from 'material-ui/styles/colors';



class Setup extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      finished: false,
      stepIndex: 0,
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


  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div className="stepper-line-height">
            <p>
              Great to see that you've decided to become more productive! The first step towards this commitment
              is to <span className="stepper-blacklist-text"> create your blacklist.</span> Simply enter the URL of
              any site you want to blacklist below.  To make things easier, we have also recommended some popular websites
              you may want to blacklist.
            </p>
            <Blacklist>
            </Blacklist>
            <br/>
            <p>
              Keep in mind that you may still go on blacklisted websites, but your virtual farm will be penalized if you
              stay on them for too long.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="stepper-line-height">
            <p>
              Ad group status is different than the statuses for campaigns, ads, and keywords, though the
              statuses can affect each other. Ad groups are contained within a campaign, and each campaign can
              have one or more ad groups. Within each ad group are ads, keywords, and bids.
            </p>
            <p>Something something whatever cool</p>
          </div>
        );
      case 2:
        return (
          <div className="stepper-line-height">
            <p>
              Try out different ad text to see what brings in the most customers, and learn how to
              enhance your ads using features like ad extensions. If you run into any problems with your
              ads, find out how to tell if they're running and how to resolve approval issues.
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
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            backgroundColor={amber600}
            label={stepIndex === 2 ? 'Finish!' : 'Next'}
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
            <StepLabel className="step-label">
              Create Blacklist
            </StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label">Set Your Buffer Time</StepLabel>
          </Step>
          <Step>
            <StepLabel className="step-label">Start Growing Your Farm!</StepLabel>
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