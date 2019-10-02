const React = require('react');
const styles = require('./App.css');

const { shell } = require('uxp');

const MainContent = require('./MainContent');
const logo = require('../assets/images/logo@3x.png');


const TopSection = (props) => {
	return (<div className="top-section">
		<div className="top-section-logo-wrapper">
			<img src={logo} className="top-section-logo" alt="Logo" />
		</div>
	</div>);
};

const BottomSection = (props) => {
	return (<div className="bottom-section">
		<button onClick={props.onAboutClick}>About</button>
	</div>);
};


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    ['documentStateChanged', 'handleAboutClick'].forEach((fn) => {
    	this[fn] = this[fn].bind(this);
    });
  }

  documentStateChanged(selection, documentRoot) {
  }

	handleAboutClick = (event) => {
  	shell.openExternal('https://github.com/de-ai/xd-blog-tutorial/blob/master/README.md');
	};

  render() {
    return (<panel className={styles.panel}>
	    <div className="panel-content-wrapper">
		    <TopSection />

		    <div className="main-content-wrapper">
			    <MainContent />
		    </div>

		    <BottomSection onAboutClick={this.handleAboutClick} />
	    </div>
    </panel>);
  }
}

module.exports = App;