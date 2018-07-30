# Delay No More (DLNM)

DLNM is a chrome extension that aims to facilitate users in building a long term habit of
working productively on the Internet; via gamification.

## Installation

1.  Install dependencies:

```
cd delay-no-more
npm install
```

2.  Build production code:

```
npm run build
```

3.  Load the extension on Google Chrome:

    1.  Open `chrome://extensions`
    2.  Enable `Developer mode`
    3.  Click on `Load unpacked extension`
    4.  Select your `build` directory

## How does the game work?

In a nutshell, users in DLNM grow (and level-up) a _virtual farm_ by avoiding their self-defined _blacklisted websites_ that distract them from
their work. On the other hand, if users spend more than their self-defined _daily buffer time_ on
such blacklisted websites, their farm will be penalized and eventually downgraded back to
its previous levels.

Using their _farm earnings_, users may purchase various _in-game items_ to e.g. accelerate farm growth; defend farm against _natural disasters_ etc.

## Features

- A beautifully animated virtual farm that grows over time
- In-game store (non-premium / premium items) with Chrome payment support
- A blacklist with a set of recommended websites to be blacklisted; and pops-up warning Chrome notifications whenever the user browses a blacklisted website
- Real-time analytics to help users monitor and discover their browsing habits
- Settings for maximum browsing flexibility (e.g. set daily buffer time, set blacklist active days etc.)
- ...

## Technology

DLNM uses:

- Firebase
- React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
- [Material-UI](https://github.com/mui-org/material-ui)
- [React-Flexbox-Grid](https://github.com/roylee0704/react-flexbox-grid)
- [React-Lottie](https://github.com/chenqingspring/react-lottie)
- [Nivo](https://github.com/plouc/nivo)

## Authors

DLNM is a collaboration between:

- [Emily Lam](https://github.com/emlylam)
- [Hyun Ji Lee](https://github.com/HJLee1130)
- [Ian Liu](https://github.com/ianthl)
- [Jonathan Chan](https://github.com/jon0401)
