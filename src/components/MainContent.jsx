const React = require('react');
const styles = require('./MainContent.css');

const btoa = require('btoa');

const application = require('application');
const { selection, ImageFill } = require('scenegraph');
const fs = require('uxp').storage.localFileSystem;

const UNSPLASH_API = 'https://api.unsplash.com/photos/random?client_id=b21ca0eaeafd7b2d3ad04aea61bc1ca8516fe43dfdb22ebd93e39aa25049a014';


class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		['handleFetchImage'].forEach((fn) => {
			this[fn] = this[fn].bind(this);
		});
	}

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

	handleFetchImage = async() => {
		application.editDocument({ editLabel : 'Image Fill Shape' }, async (selection, documentRoot) => {
			const node = selection.items[0];
			let response = await fetch(UNSPLASH_API);

			try {
				response = await response.json();

			} catch (e) {
				console.log('fetch(e)', e);
			}

			response = await fetch(response.urls.regular);

			try {
				response.arrayBuffer().then((buffer) => {
					let binary = '';
					[].slice.call(new Uint8Array(buffer)).forEach((b) => {
						binary = `${binary}${String.fromCharCode(b)}`;
					});

					node.fill = new ImageFill(`data:image/jpeg;base64,${btoa(binary)}`);
				});

			} catch (e) {
				console.log('fetch(e)', e);
			}
		});
	};

	render() {
		return (<div className="main-content">
			<button disabled={selection.items.length !== 1} uxp-variant="cta" onClick={this.handleFetchImage}>Insert Image</button>
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.props.onZoomSelection}>Zoom to Selection</button>
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.handleCreateRendition}>Export Rendition</button>
		</div>);
	}
}

module.exports = MainContent;