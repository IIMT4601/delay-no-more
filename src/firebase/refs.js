import firebase from './index';
const db = firebase.database();

export const getParentARefs = () => ({
  childARef: db.ref('parentA').child('childA')
})