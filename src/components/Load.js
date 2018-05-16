import React from 'react';
import '../styles/Farm.css';

import Lottie from 'react-lottie';
import load_animation from '../animations/preloader_02';

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: load_animation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid',
  }
};

const Load = () => (
  <Lottie 
    options={defaultOptions} 
    height={330}
    width={400}
    isStopped={false}
    isPaused={false}
    speed={1.4}
    direction={1}
  />
);

export default Load;