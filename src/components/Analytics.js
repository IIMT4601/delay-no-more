import React, { Component } from 'react';
import { getTodaysDate, millisecToTime, millisecToTimeWithDays } from '../utils';
import { weekday } from '../constants';
import '../styles/Analytics.css';

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

  getPieData = () => {
    let data = [];
    const todaysDate = getTodaysDate();

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

  getTableData = () => {
    let data = [];
    const todaysDate = getTodaysDate();

    if (this.state.analyticsData[todaysDate]) {
      const totalAccessDurationToday = Object.values(this.state.analyticsData[todaysDate]).reduce((a, b) => {
        return a + b.accessDuration;
      }, 0); 

      Object.values(this.state.analyticsData[todaysDate]).forEach(v => {
        data.push({
          siteHost: v.siteHost,
          accessDuration: v.accessDuration,
          accessDurationPercentage: v.accessDuration * 100 / totalAccessDurationToday,
          isBlacklisted: v.isBlacklisted
        });
      });
    }
    
    return data.sort((a, b) => b.accessDuration - a.accessDuration).map((d, i) => {return {...d, rank: i + 1}});
  }

  getPieAllTimeData = () => {    
    return this._getUniqueSiteHosts().map(siteHost => {
      return {
        id: siteHost,
        label: siteHost,
        value: this._accessDurationAllTime(siteHost)
      }
    });
  }

  getTableAllTimeData = () => {
    let data = [];

    if (this.state.analyticsData) {
      const totalAccessDurationAllTime = Object.values(this.state.analyticsData).reduce((d1, d2) => {
        return d1 + Object.values(d2).reduce((a, b) => {
          return a + b.accessDuration;
        }, 0); 
      }, 0);

      this._getUniqueSiteHosts().forEach(siteHost => {
        const accessDurationAllTime = this._accessDurationAllTime(siteHost);
        data.push({
          siteHost,
          accessDuration: accessDurationAllTime,
          accessDurationPercentage: accessDurationAllTime * 100 / totalAccessDurationAllTime,
          accessDurationByWeekday: this._accessDurationAllTimeByWeekday(siteHost)
        });
      });
    }

    return data.sort((a, b) => b.accessDuration - a.accessDuration).map((d, i) => {return {...d, rank: i + 1}});
  }

  _accessDurationAllTime = siteHost => {
    return Object.values(this.state.analyticsData).reduce((d1, d2) => {
      return d1 + Object.values(d2).reduce((a, b) => {
        if (b.siteHost == siteHost) return a + b.accessDuration;
        else return a + 0;
      }, 0); 
    }, 0);
  }

  _accessDurationAllTimeByWeekday = siteHost => {
    let accessDurationAllTimeByWeekday = {};

    for (let i = 0; i < 7; i++) {
      accessDurationAllTimeByWeekday[i] = Object.keys(this.state.analyticsData).reduce((d1, d2) => {
        if (new Date(d2).getDay() === i) {
          return d1 + Object.values(this.state.analyticsData[d2]).reduce((a, b) => {
            if (b.siteHost == siteHost) return a + b.accessDuration;
            else return a + 0;
          }, 0);          
        }
        else {
          return d1 + 0;
        }
      }, 0);      
    }

    return accessDurationAllTimeByWeekday;
  }
  
  _getUniqueSiteHosts = () => {
    let siteHosts = [];
    if (this.state.analyticsData) {
      Object.values(this.state.analyticsData).forEach(analyticsByDate => {
        Object.values(analyticsByDate).forEach(v => {
          siteHosts.push(v.siteHost);
        });
      });
    }
    return [...new Set(siteHosts)];
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
      Cell: props => <span>{millisecToTime(props.value)}</span>,
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

  tableAllTimeColumns = [
    {
      Header: 'Website',
      accessor: 'siteHost',
      maxWidth: 320
    },
    {
      Header: 'Duration',
      accessor: 'accessDuration',
      Cell: props => <span>{millisecToTimeWithDays(props.value)}</span>,
      maxWidth: 170,
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
                          <p><small><b>Rank:</b></small> {row.original.rank} / {Object.keys(this.state.analyticsData[getTodaysDate()]).length}</p>
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
                    tooltipFormat={value => millisecToTime(value)}
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
                        <td>&nbsp;0%</td>
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
      else if (selectValue === 4) {
        return (
          <Grid fluid>
            <Row>
              <Col lg={6}>
                <div id="analyticsTable">
                  <ReactTable
                    data={this.getTableAllTimeData()}
                    filterable
                    columns={this.tableAllTimeColumns}
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
                      const accessDurationByWeekdayData = Object.keys(row.original.accessDurationByWeekday).map(k => {
                        return {
                          id: weekday[k],
                          Weekday: row.original.accessDurationByWeekday[k]
                        };
                      });
                      const dailyAverageDuration = row.original.accessDuration / Object.keys(this.state.analyticsData).length;
                      return (
                        <div className="analyticsTableSub">
                          <p><small><b>Rank:</b></small> {row.original.rank} / {this._getUniqueSiteHosts().length}</p>
                          <div className="analyticsTableSubBar">
                            <ResponsiveBar
                              data={accessDurationByWeekdayData}
                              keys={["Weekday"]}
                              margin={{
                                "top": 50,
                                "right": 130,
                                "bottom": 50,
                                "left": 0
                              }}
                              padding={0}
                              colors={["#9ECAE1"]}
                              colorBy="id"
                              borderColor="inherit:darker(1.6)"
                              labelSkipWidth={12}
                              labelSkipHeight={12}
                              labelTextColor="inherit:darker(1.6)"
                              animate={true}
                              motionStiffness={90}
                              motionDamping={15}
                              enableGridY={false}
                              axisBottom={{
                                "orient": "bottom",
                                "tickSize": 0,
                                "tickPadding": 5,
                                "tickRotation": 0,
                                "legendPosition": "center",
                                "legendOffset": 36
                              }}
                              borderWidth={0}
                              enableLabel={false}
                              tooltipFormat={v => `${(v * 100/ row.original.accessDuration).toFixed(2)}% (${millisecToTimeWithDays(v)})`}
                              markers={[{axis: "y", value: 0, lineStyle: {stroke: "#9ECAE1", strokeWidth: 2}}]}
                            />
                          </div>
                          <p><small><b>Daily average:</b></small> {millisecToTime(dailyAverageDuration)}</p>
                        </div>
                      )
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div id="analyticsPie">
                  <ResponsivePie
                    data={this.getPieAllTimeData()}
                    margin={{
                      "top": 40,
                      "right": 80,
                      "bottom": 40,
                      "left": 80
                    }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors="pastel2"
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
                    tooltipFormat={value => millisecToTimeWithDays(value)}
                  />         
                </div>
              </Col>
            </Row>
          </Grid>
        )
      }  
    }

    return (
      <div className="analyticsContainer">
        <SelectField
          floatingLabelText="Browsing Analytics"
          value={this.state.selectValue}
          onChange={this.handleChange}
        >
          <MenuItem value={1} primaryText="Today" />
          <MenuItem value={2} primaryText="Past 7 Days" />
          <MenuItem value={3} primaryText="Past Year" />
          <MenuItem value={4} primaryText="All-Time" />
        </SelectField>
        {renderCharts(this.state.selectValue)}
      </div>
    );
  }
}

export default Analytics;