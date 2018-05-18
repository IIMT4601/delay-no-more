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

  hasPurchased = k => {
    return Object.values(this.props.inventory).indexOf(k) > -1
  }

  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            {Object.keys(this.props.shop).filter(k => this.props.shop[k].category === this.props.category).map(k =>
              <Col lg={3}>
                <ShopItem 
                  {...this.props.shop[k]} 
                  handleDialogOpen={() => this.props.handleDialogOpen(k)} 
                  hasPurchased={this.hasPurchased(k)}
                />
              </Col>
            )}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ShopPanel;