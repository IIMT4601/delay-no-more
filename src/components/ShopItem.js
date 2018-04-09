import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faMoneyBillAlt from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

class ShopItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Paper zDepth={2} className="shopItem">
        <h2>{this.props.name}</h2>
        <img height="100" src="#" alt=""/>
        <p>{this.props.description}</p>
        <h3><FontAwesomeIcon icon={faMoneyBillAlt} /> {this.props.price}</h3>
        <RaisedButton
          label="Buy"
          secondary={true}
          icon={<FontAwesomeIcon icon={faShoppingCart} />}
          onClick={this.props.handleDialogOpen}
        />
      </Paper>
    );
  }
}

export default ShopItem;