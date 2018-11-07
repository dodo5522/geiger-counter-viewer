import React, { Component } from 'react';
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

const msOneMinute = 60 * 1000;
const msOneHour = 60 * msOneMinute;

const keen = new KeenAnalysis(keys.keen);

const chartConfig = {
	type: 'line',
	data: {
		datasets: [{
			label: '昭島市東町2丁目',
			backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
			borderColor: chartColors.blue,
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: []
		}]
	},
	options: {
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
	chartUpdater = undefined;

	constructor(props) {
		const now = Date.now();
		super(props);

		this.state = {
			interval: (props.interval) ? props.interval : 'hourly',
			start: (props.start) ? props.start : moment(now - msOneHour).format(),
			end: (props.end) ? props.end : moment(now).format(),
		};
	}

	getContextCanvas() {
		return this.refs.canvas.getContext('2d');
	}

	componentDidMount() {
		console.log('didMount');
		if (!this.chartUpdater) {
			this.drawInitialChart()
			.then(() => {
				this.startChartUpdater();
			});
		}
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
		const chart = new Chart(this.getContextCanvas(), chartConfig);

		for (const d of data) {
			if (d.y === null) {
				continue;
			}
			// append the new data to the existing chart data
			chart.data.datasets[0].data.push(d);
		}

		chart.update();
	}

	startChartUpdater(interval='minutely') {
		const chart = new Chart(this.getContextCanvas(), chartConfig);

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
					chart.data.datasets[0].data.splice(0, 1);
					chart.data.datasets[0].data.push(d);
				}
				// update chart datasets keeping the current animation
				chart.update();
			})
			.catch(() => {
			});
		}, msOneMinute);
	}

	render() {
		return (
			<div>
				<canvas ref="canvas" width='100%' height='100%'/>
			</div>
		);
	}
}

export default GeigerChart;
