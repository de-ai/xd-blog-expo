const React = require('react');
const styles = require('./App.css');

const { editDocument } = require('application');
const { shell } = require('uxp');
const viewport = require('viewport');

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
	    documentRoot : null,
    	selection    : null
    };

    ['documentStateChanged', 'handleAboutClick', 'handleZoomSelection'].forEach((fn) => {
    	this[fn] = this[fn].bind(this);
    });
  }

  documentStateChanged(selection, documentRoot) {
	  this.setState({ documentRoot, selection });
  }

	handleAboutClick = (event) => {
  	shell.openExternal('https://github.com/de-ai/xd-blog-tutorial/blob/master/README.md');
	};

	handleZoomSelection = () => {
		editDocument({ editLabel : 'Zoom to Selection' }, (selection, documentRoot) => {
			const bounds = {
				x      : Math.min(...selection.items.map((node) => (node.globalDrawBounds.x))),
				y      : Math.min(...selection.items.map((node) => (node.globalDrawBounds.y))),
				width  : Math.max(...selection.items.map((node) => (node.globalDrawBounds.x + node.globalDrawBounds.width))),
				height : Math.max(...selection.items.map((node) => (node.globalDrawBounds.y + node.globalDrawBounds.height))),
			};

			viewport.zoomToRect(bounds.x, bounds.y, bounds.width, bounds.height);
		});
	};

  render() {
    return (<panel className={styles.panel}>
	    <div className="panel-content-wrapper">
		    <TopSection />

		    <div className="main-content-wrapper">
			    <MainContent onZoomSelection={this.handleZoomSelection} />
		    </div>

		    <BottomSection onAboutClick={this.handleAboutClick} />
	    </div>
    </panel>);
  }
}

module.exports = App;