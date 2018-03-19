import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveCalendar } from '@nivo/calendar';

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
        db.ref('analytics').child(user.uid).on('value', snap => {
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
    let seconds = parseInt((duration / 1000) % 60, 10);
    let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + "h " + minutes + "m " + seconds + "s";
  }

  getTodaysDate = () => {
    const d = new Date();
  
    const YYYY = d.getFullYear();
    let MM = d.getMonth() + 1;
    let DD = d.getDate();
  
    if (MM < 10) MM = '0' + MM;
    if (DD < 10) DD = '0' + DD;
  
    return YYYY + "-" + MM + "-" + DD;
  }

  getPieData = () => {
    let data = [];
    const todaysDate = this.getTodaysDate();

    if (this.state.analyticsData[todaysDate]) {
      Object.values(this.state.analyticsData[todaysDate]).forEach(v => {
        data.push({
          id: v.siteHost, 
          label: v.siteHost, 
          value: v.duration
        });
      });      
    }

    return data;
  }

  getDivergingBarData = () => {
    let data = [];

    Object.keys(this.state.analyticsData).slice(-7).forEach(date => {
      let onBlacklistedTime = 0;
      let onNonBlacklistedTime = 0;
      
      Object.values(this.state.analyticsData[date]).forEach(v => {
        const duration = v.duration;
        if (v.isBlacklisted) onBlacklistedTime += duration;
        else onNonBlacklistedTime += duration;
      });

      const onBlacklistedTimePercentage = Math.round(
        onBlacklistedTime * 100 / (onNonBlacklistedTime + onBlacklistedTime)
      );
      const onNonBlacklistedTimePercentage = Math.round(
        onNonBlacklistedTime * 100 / (onNonBlacklistedTime + onBlacklistedTime)
      );

      data.push({
        date, 
        'Percentage of time on non-blacklisted sites': onNonBlacklistedTimePercentage,
        'Percentage of time on blacklisted sites': -onBlacklistedTimePercentage
      });
    });

    return data;
  }

  getCalendarData = () => {
    let data = [];

    Object.keys(this.state.analyticsData).forEach(k => {
      let onBlacklistedTime = 0;
      let totalBrowsingTime = 0;

      Object.values(this.state.analyticsData[k]).forEach(v => {
        const duration = v.duration;
        if (v.isBlacklisted) onBlacklistedTime += duration;
        totalBrowsingTime += duration;
      });

      data.push({
        "day": k,
        "value": Math.round(onBlacklistedTime * 100 / totalBrowsingTime)
      });
    });

    return data;
  }

  getCalendarFromDate = () => {
    const d = new Date();
    return (d.getFullYear() - 1) + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  getCalendarToDate = () => {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  render() {
    const divergingBarProps = {
      margin: { top: 60, right: 80, bottom: 60, left: 80 },
      padding: 0.4,
      labelSkipWidth: 16,
      labelSkipHeight: 16,
      indexBy: 'date',
      minValue: -100,
      maxValue: 100,
      enableGridX: true,
      enableGridY: false,
      label: d => Math.abs(d.value),
      labelTextColor: 'inherit:darker(1.2)',
      axisTop: {
        tickSize: 0,
        tickPadding: 12,
      },
      axisBottom: {
        legend: 'Date',
        legendPosition: 'center',
        legendOffset: 50,
        tickSize: 0,
        tickPadding: 12,
      },
      axisLeft: null,
      axisRight: {
        format: v => `${Math.abs(v)}%`,
      },
      markers: [
        {
          axis: 'y',
          value: 0,
          lineStyle: { strokeOpacity: 0 },
          textStyle: { fill: '#2ebca6' },
          legend: 'Non-blacklisted Sites',
          legendPosition: 'top-left',
          legendOrientation: 'vertical',
          legendOffsetY: 60,
        },
        {
          axis: 'y',
          value: 0,
          lineStyle: { stroke: '#f47560', strokeWidth: 1 },
          textStyle: { fill: '#e25c3b' },
          legend: 'Blacklisted Sites',
          legendPosition: 'bottom-left',
          legendOrientation: 'vertical',
          legendOffsetY: 60,
        },
        {
          axis: 'y',
          value: 0,
          lineStyle: { strokeOpacity: 0 },
          textStyle: { fill: '#000000' },
          legend: 'Browsing Time %',
          legendPosition: 'top-left',
          legendOrientation: 'vertical',
          legendOffsetY: -60,
          legendOffsetX: -20
        },
      ],
    };

    return (
      <div>
        <h1>My Browsing Analytics:</h1>
        <div id="analyticsPie">
          <ResponsivePie
            data={this.getPieData()}
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
            enableSlicesLabels={false}
            tooltipFormat={value => this.millisecToTime(value)}
          />         
        </div>
        <div id="analyticsBar">
          <ResponsiveBar
            {...divergingBarProps}
            data={this.getDivergingBarData()}
            keys={['Percentage of time on non-blacklisted sites', 'Percentage of time on blacklisted sites']}
            colors={['#97e3d5', '#e25c3b']}
            labelFormat={v => `${v}%`}
            tooltipFormat={v => `${Math.abs(v)}%`}
            isInteractive={true}
          /> 
        </div>
        <div id="analyticsCalendar">
        <ResponsiveCalendar
          data={this.getCalendarData()}
          from={this.getCalendarFromDate()}
          to={this.getCalendarToDate()}
          emptyColor="#eeeeee"
          colors={[
            "#61cdbb",
            "#97e3d5",
            "#F1E15B",
            "#E8A838",
            "#E25C3B",
          ]}
          margin={{
            "top": 100,
            "right": 30,
            "bottom": 60,
            "left": 30
          }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          monthLegendOffset={10}
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              "anchor": "bottom-right",
              "direction": "row",
              "translateY": 36,
              "itemCount": 5,
              "itemWidth": 34,
              "itemHeight": 36,
              "itemDirection": "top-to-bottom"
            }
          ]}
          domain={[0, 40]}
        />
        </div>
      </div>
    );
  }
}

export default Analytics;