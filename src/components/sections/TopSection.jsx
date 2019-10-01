import React from 'react';
import './TopSection.css';

const logo = require('../../assets/images/logo@3x.png');
const navLinks = require('../../assets/json/nav-links');

function TopSection(props) {
	return (<div className="top-section">
		<div className="top-section-logo-wrapper">
			<img src={logo} className="top-section-logo" alt="Logo" />
		</div>

		<div className="top-section-link-wrapper">
			{(navLinks.map((navLink, i)=> (
				<div key={i} className="top-section-link" onClick={()=> props.handleOpenURL(navLink.url)}>{navLink.title}</div>
			)))}
		</div>
	</div>);

}

module.exports = TopSection;