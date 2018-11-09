import React, { Component } from 'react';
import GeigerChart from './GeigerChart';
import Navigation from './Navigation';
import moment from 'moment';

const now = Date.now();
const msOneMinute = 60 * 1000;
const msOneHour = 60 * msOneMinute;

class Main extends Component {
	state = {
		start: moment(now - msOneHour).format(),
		end: moment(now).format(),
	}

	handlerStartDate = (e) => {
		this.setState({start: e.target.value});
	}

	handlerEndDate = (e) => {
		this.setState({end: e.target.value});
	}

	render () {
		return (
			<div>
				<Navigation handlerStartDate={this.handlerStartDate} handlerEndDate={this.handlerEndDate} />
				<GeigerChart start={this.state.start} end={this.state.end} />
			</div>
		);
	}
}

export default Main;
