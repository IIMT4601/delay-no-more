import React, { Component } from 'react';
import '../styles/Farm.css';

import Lottie from 'react-lottie';
import * as load_animation from '../animations/preloader_02.json';

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: load_animation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid',
  }
};

class Load extends Component {
  constructor(){
    super();
  }
  render(){
    return (
      <Lottie options={defaultOptions} 
        height={330}
        width={400}
        isStopped={false}
        isPaused={false}
        speed={1.4}
        direction={1}
      />
    );
  }
} 

export default Load;