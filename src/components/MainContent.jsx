const React = require('react');
const styles = require('./MainContent.css');

const btoa = require('btoa');

const application = require('application');
const { selection, Artboard, ImageFill, Line, Text } = require('scenegraph');
const fs = require('uxp').storage.localFileSystem;

const UNSPLASH_API = 'https://api.unsplash.com/photos/random?client_id=b21ca0eaeafd7b2d3ad04aea61bc1ca8516fe43dfdb22ebd93e39aa25049a014';


class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};

		['handleCreateRendition', 'handleFetchImage'].forEach((fn) => {
			this[fn] = this[fn].bind(this);
		});
	}

	handleCreateRendition = () => {
		application.editDocument({ editLabel : 'Export Rendition' }, (selection, documentRoot) => {

			selection.items.forEach(async(node) => {
				const folder = await fs.getFolder();

				const filename = `${node.name}_${node.guid}${(node.fill instanceof ImageFill) ? '@2x.png' : '.svg'}`;
				const file = await folder.createFile(filename, { overwrite : true });
				const renditionSettings = [(node.fill instanceof ImageFill) ? {
					node        : node,
					outputFile  : file,
					type        : application.RenditionType.PNG,
					scale       : 2
				} : {
					node        : node,
					outputFile  : file,
					type        : application.RenditionType.SVG,
					minify      : true,
					embedImages : false,
					scale       : 1
				}];

				application.createRenditions(renditionSettings).then((results)=> {
					console.log(`Created rendition "${filename}" @ ${results[0].outputFile.nativePath}`);

				}).catch((error)=> {
					console.log('rendition error:', error);
				});
			});
		});
	};

	handleFetchImage = async() => {
		application.editDocument({ editLabel : 'Image Fill Shape' }, async(selection, documentRoot) => {
			const node = selection.items[0];
			let response = await fetch(UNSPLASH_API);

			let url = null;
			try {
				const photo = await response.json();
				url = (parseInt(response.headers.get('X-Ratelimit-Remaining'), 10) > 0) ? photo.urls.full : 'https://designengine.ai/images/logo-de-192.jpg';
				node.name = (parseInt(response.headers.get('X-Ratelimit-Remaining'), 10) > 0) ? photo.description : 'Logo - Design Engine';

			} catch (e) {
				console.log('fetch error:', e);
			}

			response = await fetch(url);
			try {
				response.arrayBuffer().then((buffer) => {
					let binary = '';
					[].slice.call(new Uint8Array(buffer)).forEach((b) => {
						binary = `${binary}${String.fromCharCode(b)}`;
					});

					node.fill = new ImageFill(`data:image/jpeg;base64,${btoa(binary)}`);
				});

			} catch (e) {
				console.log('fetch error:', e);
			}
		});
	};

	render() {
		return (<div className="main-content">
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.props.onZoomSelection}>Zoom to Selection</button>
			<button disabled={selection.items.length !== 1 || (selection.items.length > 0 && (selection.items[0] instanceof Artboard || selection.items[0] instanceof Line || selection.items[0] instanceof Text))} uxp-variant="cta" onClick={this.handleFetchImage}>Insert Random Image</button>
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.handleCreateRendition}>{`Export Rendition${(selection.items.length > 1) ? 's' : ''}`}</button>
		</div>);
	}
}

module.exports = MainContent;