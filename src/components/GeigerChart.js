import React, { Component } from 'react';
import { KeenAnalysis } from 'keen-analysis';
import { Chart } from 'chart.js';
import 'chartjs-plugin-streaming';
import { keys } from '../config';

const durationWithMinute = 60;
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
		title: {
			display: true,
			position: 'top',
			fontSize: 18
		},
		scales: {
			xAxes: [{
				type: 'realtime',				// x axis will auto-scroll from right to left
				realtime: {							// per-axis options
					duration: durationWithMinute * 60 * 1000,	// data in the past 24h will be displayed
					delay: 60 * 1000,			// delay of 1 minute, so upcoming values are known before plotting a line
					pause: false,					// chart is not paused
					ttl: undefined				// data will be automatically deleted as it disappears off the chart
				}
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
	componentDidMount() {
		this.updateCanvas();
	}

//	componentDidUpdate() {
//		this.updateCanvas();
//	}

	resQueryToRadiationValues(resKeen) {
		return resKeen.result.map((currentRecord) => {
			return {
				x: new Date(currentRecord.timestamp),
				y: currentRecord.usv
			};
		});
	};

	updateCanvas() {
		//const ctx = document.getElementById('chartArea').getContext('2d');
		const ctx = this.refs.canvas.getContext('2d');
		let chart = undefined;

		keen.query({
			analysis_type: 'extraction',
			event_collection: 'radiations',
			timeframe: `this_${durationWithMinute + 2}_minutes`
		})
		.then(res => {
			chart = new Chart(ctx, chartConfig);
			// append the new data to the existing chart data
			chart.data.datasets[0].data.push(...this.resQueryToRadiationValues(res));
			chart.update();
		})
		.then(() => {
			setInterval(() => {
				keen.query({
					analysis_type: 'extraction',
					event_collection: 'radiations',
					timeframe: `this_2_minutes`
				})
				.then(res => {
					// append the new data to the existing chart data
					chart.data.datasets[0].data.push(...this.resQueryToRadiationValues(res));
					// update chart datasets keeping the current animation
					chart.update({preservation: true});
				});
			}, 60 * 1000);
		});
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
