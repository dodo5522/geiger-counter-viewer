import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { KeenAnalysis } from 'keen-analysis';
import { Chart } from 'chart.js';
import { keys } from '../config';
import moment from 'moment';

const color = Chart.helpers.color;

const chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

const styles = themes => ({
	areaChart: {
		position: 'relative',
		margin: 'auto',
		height: '60vh',
		width: '100vw',
	},
});

const msOneMinute = 60 * 1000;

const keen = new KeenAnalysis(keys.keen);

const chartConfig = {
	type: 'line',
	data: {
		datasets: [{
			label: '昭島市東町2丁目',
			backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
			borderColor: chartColors.blue,
			fill: 'origin',
			cubicInterpolationMode: 'default',
			lineTension: 0,
			borderJoinStyle: 'round',
			data: []
		}]
	},
	options: {
		responsiveAnimationDuration: 2,
		maintainAspectRatio: false,
		scales: {
			xAxes: [{
				type: 'time',				// x axis will auto-scroll from right to left
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'uSv/h',
				},
				ticks: {
					beginAtZero: true,
					min: 0,
					suggestedMax: 0.3,		// uSv/h as maximum on this graph
					stepSize: 0.05,
				}
			}]
		},
		plugins: {
			streaming: {			// per-chart option
				frameRate: 1		// chart is drawn this times every second
			}
		}
	}
};

class GeigerChart extends Component {
	chart = undefined;
	chartUpdater = undefined;

	constructor(props) {
		super(props);

		this.state = {
			interval: props.interval,
			start: props.start,
			end: props.end,
		};
	}

	componentDidMount() {
		this.startChart(this.state.interval);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.start) {
			this.setState({start: nextProps.start});
		}
		if (nextProps.end) {
			this.setState({end: nextProps.end});
		}
		if (nextProps.interval) {
			this.setState({interval: nextProps.interval});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this.stopChart();
		this.drawInitialChart(this.state.interval);
	}

	async getAveragedValues(start, end, interval, timezone='Asia/Tokyo') {
		const res = await keen.query({
				analysis_type: 'average',
				event_collection: 'radiations',
				target_property: 'usv',
				interval: interval,
				timezone: timezone,
				timeframe: { start, end }
			});

		return res.result.map((r) => {
				return {
					x: r.timeframe.start,
					y: r.value
				};
			});
	}

	async drawInitialChart(interval='minutely') {
		const data = await this.getAveragedValues(this.state.start, this.state.end, interval);
		const context = this.refs.canvas.getContext('2d');

		if (!this.chart) {
			this.chart = new Chart(context, chartConfig);
		}
		this.chart.data.datasets[0].data = [];

		for (const d of data) {
			if (d.y === null) {
				continue;
			}
			// append the new data to the existing chart data
			this.chart.data.datasets[0].data.push(d);
		}

		this.chart.update();
	}

	startChart = (interval='minutely') => {
		const startPeriodicChartUpdater = () => {
			if (this.chartUpdater) {
				clearInterval(this.chartUpdater);
			}

			this.chartUpdater = setInterval(() => {
				const now = Date.now();
				const start = moment(now - msOneMinute).format();
				const end = moment(now).format();

				this.getAveragedValues(start, end, interval)
				.then(data => {
					for (const d of data) {
						if (d.y === null) {
							continue;
						}
						// append the new data to the existing chart data
						this.chart.data.datasets[0].data.splice(0, 1);
						this.chart.data.datasets[0].data.push(d);
					}
					// update chart datasets keeping the current animation
					this.chart.update();
				});
			}, msOneMinute);
		};

		if (!this.chart) {
			this.drawInitialChart()
			.then(() => {
				startPeriodicChartUpdater();
			});
		} else {
			startPeriodicChartUpdater();
		}
	}

	stopChart = () => {
		if (this.chartUpdater) {
			clearInterval(this.chartUpdater);
			this.chartUpdater = undefined;
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.areaChart}>
				<canvas ref="canvas" />
			</div>
		);
	}
}


GeigerChart.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeigerChart);
