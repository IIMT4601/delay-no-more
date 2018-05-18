import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import {amber600} from 'material-ui/styles/colors';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSeedling from '@fortawesome/fontawesome-free-solid/faSeedling';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie';
import faThList from '@fortawesome/fontawesome-free-solid/faThList';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';

import Logout from './Logout';

const styles = {
  button: {
    margin: 0,
    top: 'auto',
    right: '4rem',
    bottom: '3rem',
    left: 'auto',
    position: 'fixed',
    zIndex: 1299
  },
  appBar: {
    backgroundColor: amber600
  }
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <div>
        <FloatingActionButton 
          style={styles.button}
          backgroundColor="#FFB300"
          onClick={this.handleToggle} 
        >
          <ActionHome />
        </FloatingActionButton>

        <Drawer width={220} openSecondary={true} open={this.state.open} docked={false} onRequestChange={(open) => this.setState({open})}>
          <AppBar title="DLNM" onLeftIconButtonClick={this.handleToggle} style={styles.appBar} showMenuIconButton={false} />
          <MenuItem disabled={true}>Hi, {this.props.user.providerData.displayName}</MenuItem>
          <MenuItem primaryText="Farm" containerElement={<Link to="/" />} onClick={this.handleToggle} leftIcon={<FontAwesomeIcon icon={faSeedling} />} />
          <MenuItem primaryText="Store" containerElement={<Link to="/shop" />} onClick={this.handleToggle} leftIcon={<FontAwesomeIcon icon={faShoppingCart} />} />
          <Divider />
          <MenuItem primaryText="Analytics" containerElement={<Link to="/analytics" />} onClick={this.handleToggle} leftIcon={<FontAwesomeIcon icon={faChartPie} />} />
          <MenuItem primaryText="Blacklist" containerElement={<Link to="/blacklist" />} onClick={this.handleToggle} leftIcon={<FontAwesomeIcon icon={faThList} />} />
          <MenuItem primaryText="Settings" containerElement={<Link to="/settings" />} onClick={this.handleToggle} leftIcon={<FontAwesomeIcon icon={faCog} />} />
          <Divider />
          <Logout />
        </Drawer>
      </div>
    );
  }
}

export default Menu;