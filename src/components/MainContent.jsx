const React = require('react');
const styles = require('./MainContent.css');

const btoa = require('btoa');

const { editDocument } = require('application');
const { selection, ImageFill } = require('scenegraph');
const viewport = require('viewport');

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
		this.props.onCreateRendition();
	};

	handleFetchImage = async() => {
		editDocument({ editLabel : 'Image Fill Shape' }, async (selection, documentRoot) => {
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
		return (<div className="main-content">
			<button disabled={selection.items.length !== 1} uxp-variant="cta" onClick={this.handleFetchImage}>Insert Image</button>
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.handleZoomSelection}>Zoom to Selection</button>
			<button disabled={selection.items.length === 0} uxp-variant="cta" onClick={this.handleCreateRendition}>Export Rendition</button>
		</div>);
	}
}

module.exports = MainContent;