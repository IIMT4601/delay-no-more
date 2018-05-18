import React, { Component } from 'react';
import '../styles/Blacklist.css';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import {amber600, transparent, grey900} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';

import firebase from '../firebase';
const auth = firebase.auth();
const db = firebase.database();

const styles = {
  textField: {
    margin: '1rem',
    fontSize: '20px',
    floatingLabel: {
      borderColor: amber600,
      color: amber600,
    }
  },
  buttons: {
    remove: {
      color: '#D32F2F',
      fontWeight: 'bold'
    }
  },
  table: {
    row: {
      borderColor: transparent,
      textColor : grey900    
    },
    headerColumn: {
      fontSize: '18px',
      color: '#263238',
      fontWeight: 'bold',
      backgroundColor: '#F5F5F5',
      padding: '0 0 0 10px',
      height: '45px'
    },
    rowColumn: {
      blacklistedSiteName: {
        fontSize: '15px'
      },
      recommendedSiteLogo: {
        width: '2.5em'
      },
      recommendedSiteName: {
        width: '10rem',
        fontSize: '15px'
      },
      actions: {
        float: 'right',
        padding: '0 50px 0 0px'
      }  
    }
  }
};

const defaultBlacklistKeyToTitle = {
  socialMediaSites: "Recommended Social Media Sites",
  entertainmentSites: "Recommended Entertainment Sites"
};

class Blacklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blacklist: {},
      defaultBlacklist: { 
        socialMediaSites: [
          {
            siteName: "Facebook",
            url: "www.facebook.com",
            logo: "fab fa-facebook",
            logoColor: "fb-color",
            isBlacklisted: false,
          },
          {
            siteName: "Twitter",
            url: "twitter.com",
            logo: "fab fa-twitter",
            logoColor: "twitter-color",
            isBlacklisted: false,
          },
          {
            siteName: "Instagram",
            url: "www.instagram.com",
            logo: "fab fa-instagram",
            logoColor: "ig-color",
            isBlacklisted: false,
          }
        ],
        entertainmentSites: [
          {
            siteName: "YouTube",
            url: "www.youtube.com",
            logo: "fab fa-youtube",
            logoColor: "yt-color",
            isBlacklisted: false,
          },
          {
            siteName: "Pinterest",
            url: "www.pinterest.com",
            logo: "fab fa-pinterest",
            logoColor: "pinterest-color",
            isBlacklisted: false,
          },
          {
            siteName: "Tumblr",
            url: "www.tumblr.com",
            logo: "fab fa-tumblr",
            logoColor: "tumblr-color",
            isBlacklisted: false,
          },
          {
            siteName: "Reddit",
            url: "www.reddit.com",
            logo: "fab fa-reddit",
            logoColor: "reddit-color",
            isBlacklisted: false,
          },
          {
            siteName: "Twitch",
            url: "www.twitch.tv",
            logo: "fab fa-twitch",
            logoColor: "twitch-color",
            isBlacklisted: false,
          }
        ],
      },
      dialogOpen: false,
      keyToBeDeleted: null,
      categoryKey: null,
      keyToBeAdded: null,
      inputValue: "",
      inputError: "",
      snackbarOpen: false,
      snackbarMessage: ""
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).on('value', snap => {
          console.log("snap.val():", snap.val());
          this.setState({
            blacklist: snap.val() === null ? {} : snap.val()
          });
        });
      }
    });
  }

  componentWillUnmount() {}

  handleChange = e => {
    this.setState({
      inputValue: e.target.value,
      inputError: ""
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const url = "http://" + e.target.value;
      try {
        const parsedURL = new URL(url);
        if (Object.values(this.state.blacklist).indexOf(parsedURL.host) > -1) {
          this.setState({
            inputError: "Site had already been blacklisted."
          });
        }
        else {
          auth.onAuthStateChanged(user => {
            if (user) {
              db.ref('blacklists').child(user.uid).push(parsedURL.host, err => {
                if (err) {
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Unable to save site to blacklist. Please try again."
                  });
                }
                else {
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Site added to your blacklist"
                  });                   
                }
              });
            }
          });
          this.setState({
            inputValue: ""
          });
        }
      }
      catch (err) {
        this.setState({
          inputError: "Please enter a valid URL."
        });
      }
      console.log("handleKeyPress:", this.state);
    }
  };

  handleDelete = () => {
    const k = this.state.keyToBeDeleted;
    auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('blacklists').child(user.uid).child(k).remove(err => {
          if (err) {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Unable to remove site from blacklist. Please try again."
            });
          }
          else {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Site removed from your blacklist"
            });
          }
        });
      }
    });
    this.handleDialogClose();
    console.log("handleDelete:", this.state);
  };

  handleDialogOpen = k => {
    this.setState({
      dialogOpen: true,
      keyToBeDeleted: k
    })
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      keyToBeDeleted: null
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      snackbarOpen: false
    });
  };

  handleAddRecommended = (k1, k2) => {
    this.setState({
      categoryKey: k1,
      keyToBeAdded: k2
    }, () => {
      let category;
      switch(k1){
        case 0:
          category = this.state.defaultBlacklist.socialMediaSites;
          break;
        case 1:
          category = this.state.defaultBlacklist.entertainmentSites;
          break;
        default:
          console.log("error...");
      }

      let url = "http://" + category[k2].url;
      console.log("URL to be added: ", url);

      try{
        const parsedURL = new URL(url);

        if (Object.values(this.state.blacklist).indexOf(parsedURL.host) > -1){
          this.setState({
            snackbarOpen: true,
            snackbarMessage: "This site has already been blacklisted. ",
          });
        }else{
          auth.onAuthStateChanged(user => {
            if (user){
              db.ref('blacklists').child(user.uid).push(parsedURL.host, err => {
                if (err){
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Unable to save site to blacklist. Please try again."
                  });
                }else{
                  this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Site added to your blacklist.",
                  });

                }
              });
            }
          });
        }
      }catch(err){
        this.setState({
          inputError: "There are some problems with the handleAddRecommended function."
        });
      }
    })

  };

  render() {
    console.log("this.state:", this.state);

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleDialogClose}
      />,
      <FlatButton
        style={styles.buttons.remove}
        label="Remove"
        onClick={this.handleDelete}
        autoFocus
      />,
    ];

    return (
      <div className={this.props.className ? this.props.className : "blacklist"}>
        <div className="blacklist__my-list">
          <TextField
            fullWidth={true}
            style={styles.textField}
            hintText="Enter a site you want to blacklist"
            floatingLabelText="http://"
            floatingLabelStyle={styles.textField.floatingLabel}
            floatingLabelFixed={true}
            errorText={this.state.inputError}
            value={this.state.inputValue}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            autoFocus
            underlineFocusStyle={styles.textField.floatingLabel}
          />
          <Table style={styles.table}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow
                style={styles.table.row}
              >
                <TableHeaderColumn 
                  style={styles.table.headerColumn}
                  colSpan="3"
                >
                  My Blacklist
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
            >
              {Object.keys(this.state.blacklist).slice().reverse().map(k => (
                <TableRow
                  key={k}
                >
                  <TableRowColumn style={styles.table.rowColumn.blacklistedSiteName}>
                    {this.state.blacklist[k]}
                  </TableRowColumn>
                  <TableRowColumn style={styles.table.rowColumn.actions}>
                    <IconButton>
                      <NavigationCancel
                        onClick={() => this.handleDialogOpen(k)}
                        hoverColor="#D32F2F"
                      />
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>        
        </div>
        
        <div className="blacklist__recommendations">
          {Object.keys(this.state.defaultBlacklist).map((category, k1) => (
            <Table
              style={styles.table}
              key={k1}
            >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}
              >
                <TableRow style={styles.table.row}>
                  <TableHeaderColumn
                    style={styles.table.headerColumn} 
                    colSpan="3"
                  >
                    {defaultBlacklistKeyToTitle[category]}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(this.state.defaultBlacklist[category]).map((sites, k2) => (
                  <TableRow
                    key={k2}
                    displayBorder={false}
                  >
                    <TableRowColumn style={styles.table.rowColumn.recommendedSiteLogo}>
                      <div className="blacklist-recommendations__icons">
                        <i 
                          className={
                            this.state.defaultBlacklist[category][sites].logo + " " 
                            + this.state.defaultBlacklist[category][sites].logoColor
                          }
                        />
                      </div>
                    </TableRowColumn>
                    <TableRowColumn style={styles.table.rowColumn.recommendedSiteName}>
                      {this.state.defaultBlacklist[category][sites].siteName}
                    </TableRowColumn>
                    <TableRowColumn style={styles.table.rowColumn.actions}>
                      <IconButton
                        disabled={this.state.defaultBlacklist[category][sites].isBlacklisted}
                      >
                        <ContentAddCircle
                          hoverColor={amber600}
                          onClick={() => this.handleAddRecommended(k1,k2)}
                        >
                        </ContentAddCircle>
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
        </div>

        <Dialog
          title={this.state.blacklist[this.state.keyToBeDeleted]}
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          Are you sure you want to remove this website from your blacklist?
        </Dialog>

        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
          contentStyle={{textAlign: 'center'}}
        />
      </div>
    );
  }
}

export default Blacklist;