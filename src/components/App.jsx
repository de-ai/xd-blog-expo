const React = require('react');
const styles = require('./App.css');

const application = require('application');
const { selection } = require('scenegraph');
const { shell } = require('uxp');
const fs = require('uxp').storage.localFileSystem;

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

    this.state = { selection : null };

    ['documentStateChanged', 'handleAboutClick', 'handleCreateRendition'].forEach((fn) => {
    	this[fn] = this[fn].bind(this);
    });
  }

  documentStateChanged(selection, documentRoot) {
	  this.setState({ selection });
  }

	handleAboutClick = (event) => {
  	shell.openExternal('https://github.com/de-ai/xd-blog-tutorial/blob/master/README.md');
	};

	handleCreateRendition = () => {
		application.editDocument({ editLabel : 'Export Rendition' }, async(selection, docRoot) => {
			const node = selection.items[0];
			const folder = await fs.getFolder();
			const file = await folder.createFile(`${node.name}_${node.guid}.svg`);

			const renditionSettings = [{
				node        : node,
				outputFile  : file,
				type        : application.RenditionType.SVG,
				minify      : true,
				embedImages : true,
				background  : false,
				scale       : 1
			}];

			application.createRenditions(renditionSettings).then((results)=> {
			  console.log(`SVG rendition has been saved at ${results[0].outputFile.nativePath}`);

			}).catch((error)=> {
			  console.log(error);
			});
		});
	};

  render() {
    return (<panel className={styles.panel}>
	    <div className="panel-content-wrapper">
		    <TopSection />

		    <div className="main-content-wrapper">
			    <MainContent onCreateRendition={this.handleCreateRendition} />
		    </div>

		    <BottomSection onAboutClick={this.handleAboutClick} />
	    </div>
    </panel>);
  }
}

module.exports = App;