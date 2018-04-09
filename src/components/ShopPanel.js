import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import ShopItem from './ShopItem';

class ShopPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="shopPanel">
        <Grid fluid>
          <Row>
            {this.props.shop.filter(item => item.category === this.props.category).map(item =>
              <Col lg={3}>
                <ShopItem name={item.name} description={item.description} price={item.price} />
              </Col>
            )}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ShopPanel;