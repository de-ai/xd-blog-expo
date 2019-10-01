const React = require('react');
const styles = require('./App.css');

const { shell } = require('uxp');

const TopSection = require('./sections/TopSection');
const ContentPage = require('./pages/ContentPage');
const RegisterPage = require('./pages/RegisterPage');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { profile : null };

    ['documentStateChanged', 'handleOpenURL', 'handleUserProfile'].forEach((fn)=> {
    	this[fn] = this[fn].bind(this);
    });
  }

  documentStateChanged(selection, documentRoot) {
  }

  handleOpenURL = (url)=> {
	  shell.openExternal(url);
	};

	handleUserProfile = (profile)=> {
		this.setState({ profile });
	};


  render() {
    const { profile } = this.state;

    return (<div>
	    <panel className={styles.panel}>
		    <div className="panel-content-wrapper">
			    <TopSection onURL={this.handleOpenURL} />

			    <div className="content-wrapper">
				    {(profile)
					    ? (<RegisterPage onProfile={this.handleUserProfile} />)
					    : (<ContentPage />)
				    }
			    </div>
		    </div>
	    </panel>
    </div>);
  }
}

module.exports = App;