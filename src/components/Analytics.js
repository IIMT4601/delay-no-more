import React, { Component } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveCalendar } from '@nivo/calendar';

import 'react-table/react-table.css'
import ReactTable from 'react-table'

import { Grid, Row, Col } from 'react-flexbox-grid';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Analytics extends Component {
  constructor() {
    super();
    this.state = {
      analyticsData: {},
      selectValue: 1
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

  handleChange = (event, index, selectValue) => this.setState({selectValue});

  millisecToTime = duration => {
    //let milliseconds = parseInt((duration % 1000) / 100);
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
          value: v.accessDuration,
          color: v.isBlacklisted ? "#FB8072" : "#97E3D5"
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
        const accessDuration = v.accessDuration;
        if (v.isBlacklisted) onBlacklistedTime += accessDuration;
        else onNonBlacklistedTime += accessDuration;
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
        const accessDuration = v.accessDuration;
        if (v.isBlacklisted) onBlacklistedTime += accessDuration;
        totalBrowsingTime += accessDuration;
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

  getTableData = () => {
    let data = [];
    const todaysDate = this.getTodaysDate();

    if (this.state.analyticsData[todaysDate]) {
      const totalAccessDurationToday = Object.values(this.state.analyticsData[todaysDate]).reduce((a, b) => {
        return a + b.accessDuration;
      }, 0); 

      const totalAccessDurationAllTime = Object.values(this.state.analyticsData).reduce((d1, d2) => {
        return d1 + Object.values(d2).reduce((a, b) => {
          return a + b.accessDuration;
        }, 0); 
      }, 0);

      const accessDurationAllTime = siteHost => {
        return Object.values(this.state.analyticsData).reduce((d1, d2) => {
          return d1 + Object.values(d2).reduce((a, b) => {
            if (b.siteHost == siteHost) return a + b.accessDuration;
            else return a + 0;
          }, 0); 
        }, 0);
      }

      Object.values(this.state.analyticsData[todaysDate]).forEach(v => {
        data.push({
          siteHost: v.siteHost,
          accessDuration: v.accessDuration,
          accessDurationPercentage: v.accessDuration * 100 / totalAccessDurationToday,
          isBlacklisted: v.isBlacklisted,
          accessDurationAllTime: accessDurationAllTime(v.siteHost)
        });
      });
    }
    return data.sort((a, b) => +b.accessDuration > +a.accessDuration).map((d, i) => {return {...d, rank: i + 1}});
  }

  tableColumns = [
    {
      Header: 'Blacklisted?',
      accessor: 'isBlacklisted',
      Cell: props => props.value ? "Yes" : "No",
      maxWidth: 120,
      filterMethod: (filter, row) => {
        if (filter.value === "all") {
          return true;
        }
        if (filter.value === "true") {
          return row[filter.id] === true;
        }
        return row[filter.id] === false;
      },
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "all"}
        >
          <option value="all">Show All</option>
          <option value="true">Blacklisted</option>
          <option value="false">Non-Blacklisted</option>
        </select>
    },
    {
      Header: 'Website',
      accessor: 'siteHost',
      maxWidth: 250
    },
    {
      Header: 'Duration',
      accessor: 'accessDuration',
      Cell: props => <span>{this.millisecToTime(props.value)}</span>,
      maxWidth: 120,
      className: "analyticsTableDuration",
      filterable: false
    },    
    {
      Header: 'Time %',
      accessor: 'accessDurationPercentage',
      Cell: props => <span>{props.value.toFixed(2)}%</span>,
      maxWidth: 80,
      className: "analyticsTableTimePercentage",
      filterable: false
    }
  ];

  divergingBarProps = {
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
        legend: 'Non-Blacklisted',
        legendPosition: 'top-left',
        legendOrientation: 'vertical',
        legendOffsetY: 60,
      },
      {
        axis: 'y',
        value: 0,
        lineStyle: { stroke: '#f47560', strokeWidth: 1 },
        textStyle: { fill: '#e25c3b' },
        legend: 'Blacklisted',
        legendPosition: 'bottom-left',
        legendOrientation: 'vertical',
        legendOffsetY: 60,
      },
      {
        axis: 'y',
        value: 0,
        lineStyle: { strokeOpacity: 0 },
        textStyle: { fill: '#000000' },
        legend: 'Browsing Time',
        legendPosition: 'top-left',
        legendOrientation: 'vertical',
        legendOffsetY: -60,
        legendOffsetX: -20
      },
    ],
  };

  render() {
    console.log("this.state:", this.state);

    const renderCharts = selectValue => {
      if (selectValue === 1) {
        return (
          <Grid fluid>
            <Row>
              <Col lg={6}>
                <div id="analyticsTable">
                  <ReactTable
                    data={this.getTableData()}
                    filterable
                    columns={this.tableColumns}
                    defaultSorted={[
                      {
                        id: "accessDurationPercentage",
                        desc: true
                      }
                    ]}
                    defaultPageSize={10}
                    style={{
                      height: "30rem"
                    }}
                    SubComponent={row => {
                      console.log(row);
                      return (
                        <div className="analyticsTableSub">
                          <p>Rank today: {row.original.rank} / {Object.keys(this.state.analyticsData[this.getTodaysDate()]).length}</p>
                          <p>All-time duration: {this.millisecToTime(row.original.accessDurationAllTime)}</p>
                        </div>
                      )
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
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
                    colorBy={d => d.color}
                  />         
                </div>
              </Col>
            </Row>
          </Grid>
        )
      }
      else if (selectValue === 2) {
        return (
          <div id="analyticsBar">
            <ResponsiveBar
              {...this.divergingBarProps}
              data={this.getDivergingBarData()}
              keys={['Percentage of time on non-blacklisted sites', 'Percentage of time on blacklisted sites']}
              colors={['#97e3d5', '#e25c3b']}
              labelFormat={v => `${v}%`}
              tooltipFormat={v => `${Math.abs(v)}%`}
              isInteractive={true}
            /> 
          </div>
        )
      }
      else if (selectValue === 3) {
        return (
          <Grid fluid>
            <Row>
              <Col lg={9}>
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
                      "top": 40,
                      "right": 0,
                      "bottom": 0,
                      "left": 40
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
                    tooltipFormat={v => `${v}%`}
                  />
                </div>
              </Col>
              <Col lg={3}>
                <div id="analyticsCalendarLegends">
                  <h2>
                    Browsing Time
                    <br/>
                    <small>(Blacklisted Sites)</small>
                  </h2>
                  <table>
                    <colgroup>
                      <col width="30" />
                      <col width="200" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td bgcolor="#61cdbb" />
                        <td>0%</td>
                      </tr>
                      <tr>
                        <td bgcolor="#97e3d5" />
                        <td>&le; 10%</td>
                      </tr>
                      <tr>
                        <td bgcolor="#F1E15B" />
                        <td>&le; 20%</td>
                      </tr>
                      <tr>
                        <td bgcolor="#E8A838" />
                        <td>&le; 30%</td>
                      </tr>
                      <tr>
                        <td bgcolor="#E25C3B" />
                        <td>&gt; 30%</td>
                      </tr>                      
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Grid>
        )
      }
    }

    return (
      <div>
        <SelectField
          floatingLabelText="Browsing Analytics"
          value={this.state.selectValue}
          onChange={this.handleChange}
        >
          <MenuItem value={1} primaryText="Today" />
          <MenuItem value={2} primaryText="Past 7 Days" />
          <MenuItem value={3} primaryText="Past Year" />
        </SelectField>
        {renderCharts(this.state.selectValue)}
      </div>
    );
  }
}

export default Analytics;