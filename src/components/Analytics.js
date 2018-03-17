import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Analytics extends Component {
  constructor() {
    super();
    this.state = {
      analyticsData: {}
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('analytics').child(user.uid).once('value', snap => {
          console.log("snap.val():", snap.val());
          this.setState({
            analyticsData: snap.val() === null ? {} : snap.val()
          });
        });
      }
    });
  }

  componentWillUnmount() {}

  millisecToTime = duration => {
    let milliseconds = parseInt((duration%1000)/100);
    let seconds = parseInt((duration/1000)%60);
    let minutes = parseInt((duration/(1000*60))%60);
    let hours = parseInt((duration/(1000*60*60))%24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + "h " + minutes + "m " + seconds + "s";
  }

  render() {
    const d = new Date();
    const todaysDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    let pieData = [];

    if (this.state.analyticsData[todaysDate]) {
      Object.values(this.state.analyticsData[todaysDate]).map(v => {
        pieData.push({
          id: v.siteHost, 
          label: v.siteHost, 
          value: v.duration,
          time: this.millisecToTime(v.duration)
        });
      });      
    }
    console.log("pieData:", pieData);

    return (
      <div>
        <h1>My Browsing Analytics:</h1>
        <div id="analyticsPie">
          <ResponsivePie
            data={pieData}
            margin={{
              "top": 40,
              "right": 80,
              "bottom": 40,
              "left": 80
            }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors="d320c"
            colorBy="id"
            borderColor="inherit:darker(0.6)"
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor="inherit"
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            legends={[
              {
                "anchor": "bottom",
                "direction": "row",
                "translateY": 56,
                "itemWidth": 100,
                "itemHeight": 14,
                "symbolSize": 14,
                "symbolShape": "circle"
              }
            ]}
            radialLabel={d => `${d.id} (${d.time})`}
            enableSlicesLabels={false}
          />          
        </div>
      </div>
    );
  }
}

export default Analytics;