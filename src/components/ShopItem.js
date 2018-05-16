import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faMoneyBillAlt from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import faCreditCard from '@fortawesome/fontawesome-free-solid/faCreditCard';

class ShopItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const displayPrice = this.props.isPremium ? (
      <h3>${this.props.price}</h3>
    ) : (
      <h3><FontAwesomeIcon icon={faMoneyBillAlt} /> {this.props.price}</h3>
    );

    return (
      <Paper 
        zDepth={this.props.hasPurchased ? 1 : 2} 
        className="shopItem" 
        style={this.props.hasPurchased ? {color: "#A0A0A0"} : {}}
      >
        <h2>{this.props.name}</h2>
        <img height="100" src={this.props.imgSrc} alt=""/> <br/><br/>
        <p>{this.props.description}</p>
        { displayPrice }
        <RaisedButton
          label={this.props.hasPurchased ? "Bought" : "Buy"}
          secondary={true}
          icon={<FontAwesomeIcon icon={this.props.isPremium ? faCreditCard : faShoppingCart}/>}
          onClick={this.props.handleDialogOpen}
          disabled={this.props.hasPurchased}
        />
      </Paper>
    );
  }
}

export default ShopItem;