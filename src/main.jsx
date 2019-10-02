require('./utils/react-shim');

const React = require('react');

const App = require('./components/App');
const PanelController = require('./controllers/PanelController');

const panelController = new PanelController(App);

module.exports = {
  panels : { panelController }
};
