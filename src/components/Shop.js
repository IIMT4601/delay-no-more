import React, { Component } from 'react';
import ShopPanel from './ShopPanel';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSeedling from '@fortawesome/fontawesome-free-solid/faSeedling';
import faSun from '@fortawesome/fontawesome-free-solid/faSun';
import faFire from '@fortawesome/fontawesome-free-solid/faFire';
import faMoneyBillAlt from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class Shop extends Component {
  constructor() {
    super();
    this.state = {
      slideIndex: 0,
      shop: [
        {category: 0, name: "Item 1", description: "Description 1", price: 1},
        {category: 0, name: "Item 2", description: "Description 2", price: 2},
        {category: 0, name: "Item 3", description: "Description 3", price: 3},
        {category: 0, name: "Item 4", description: "Description 4", price: 4},
        {category: 0, name: "Item 5", description: "Description 5", price: 5},
        {category: 1, name: "Item 6", description: "Description 6", price: 6},
      ],
      user: {
        money: 100
      }
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleChange = value => {
    this.setState({
      slideIndex: value
    });
  };

  render() {
    return (
      <div id="shop">
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="Shop" />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle 
              text={
                <span>
                  You have: <FontAwesomeIcon icon={faMoneyBillAlt} /> {this.state.user.money} 
                  &emsp;<FlatButton label="Get more!" primary={true} />
                </span>
              } 
            />
          </ToolbarGroup>
        </Toolbar>

        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab 
            label="Infrastructure" 
            value={0} 
            icon={<FontAwesomeIcon icon={faSeedling} />}
          />
          <Tab 
            label="Background" 
            value={1} 
            icon={<FontAwesomeIcon icon={faSun} />}
          />
          <Tab 
            label="Disaster Relief" 
            value={2} 
            icon={<FontAwesomeIcon icon={faFire} />}
          />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <ShopPanel shop={this.state.shop} category={0} />
          <ShopPanel shop={this.state.shop} category={1} />
          <ShopPanel shop={this.state.shop} category={2} />
        </SwipeableViews>
      </div>
    );
  }
}

export default Shop;