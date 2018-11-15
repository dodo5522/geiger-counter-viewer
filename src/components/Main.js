import React, { Component } from 'react';
import GeigerChart from './GeigerChart';
import AppBar from './AppBar';
import Tabs from './Tabs';
import moment from 'moment';

const msOneMinute = 60 * 1000;
const msOneHour = 60 * msOneMinute;

class Main extends Component {
	constructor (props) {
		super(props);

		const now = Date.now();
		const start = moment(now - msOneHour);
		const end = moment(now);

		this.state = {
			interval: 'minutely',
			start: start.format(),
			end: end.format(),
		}
	}

	getInterval = (start, end) => {
		const s = moment(start);
		const e = moment(end);
		const interval =
			(e.diff(s, 'years') > 3) ? 'yearly' :
			(e.diff(s, 'months') > 3) ? 'monthly' :
			(e.diff(s, 'weeks') > 3) ? 'weekly' :
			(e.diff(s, 'days') > 3) ? 'daily' :
			(e.diff(s, 'hours') > 3) ? 'hourly' : 'minutely';
		return interval;
	};

	handleStartDate = (e) => {
		const start = e.target.value;
		const end = this.state.end;

		this.setState({start});
		this.setState({interval: this.getInterval(start, end)});
	}

	handleEndDate = (e) => {
		const start = this.state.start;
		const end = e.target.value;

		this.setState({end});
		this.setState({interval: this.getInterval(start, end)});
	}

	render () {
		return (
			<div>
				<AppBar
					startDateTime={this.state.start.split(':').splice(0, 2).join(':')}
					endDateTime={this.state.end.split(':').splice(0, 2).join(':')}
					handleStartDate={this.handleStartDate}
					handleEndDate={this.handleEndDate}
				/>
				<Tabs />
				<GeigerChart
					interval={this.state.interval}
					start={this.state.start}
					end={this.state.end}
				/>
			</div>
		);
	}
}

export default Main;
