import React, { Component } from 'react';
import GeigerChart from './GeigerChart';
import Navigation from './Navigation';
//import ButtonNavigation from './AppBar';

class Main extends Component {
	render () {
		return (
			<div>
				<Navigation />
				<GeigerChart />
			</div>
		);
	}
}

export default Main;
