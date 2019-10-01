// shims, in case they aren't present in the current environment
require('./utils/react-shim');

const React = require('react');
const ReactDOM = require('react-dom');

const App = require('./components/App');
const PanelController = require('./controllers/PanelController');

const panelController = new PanelController(App);

module.exports = {
  panels : { panelController }
};
