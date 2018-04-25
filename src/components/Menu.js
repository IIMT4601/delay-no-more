import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import Logout from './Logout';

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
    const style = {
      margin: 0,
      top: 'auto',
      right: 150,
      bottom: 40,
      left: 'auto',
      position: 'fixed',
      zIndex: 1299
    }

    return (
      <div>
        <FloatingActionButton onClick={this.handleToggle} style={style}>
          <ActionHome />
        </FloatingActionButton>
        
        <Drawer width={220} openSecondary={true} open={this.state.open} >
          <AppBar title="DLNM" onLeftIconButtonClick={this.handleToggle} />
          <MenuItem disabled={true}>Hi, {this.props.user.providerData.displayName}</MenuItem>
          <MenuItem primaryText="My Farm" containerElement={<Link to="/" />} />
          <MenuItem primaryText="Shop" containerElement={<Link to="/shop" />} />
          <Divider />
          <MenuItem primaryText="Browsing Analytics" containerElement={<Link to="/analytics" />} />
          <MenuItem primaryText="Blacklist" containerElement={<Link to="/blacklist" />} />
          <MenuItem primaryText="Settings" containerElement={<Link to="/settings" />} />
          <Divider />
          <MenuItem primaryText="About" containerElement={<Link to="/about" />} />
          <Logout />
        </Drawer>
      </div>
    );
  }
}

export default Menu;