// Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
// Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
// Unauthorised reproduction, distribution or sharing without prior consent is
// strictly forbidden.
const accountGraph = $('#accountGraph');
const hashrateLabel = 'Hashrate';
const hashrateText = 'Average Hashrate (24hr)';
const hashrateColor = '55,128,255';
const currentHashrateText = 'Current Hashrate (1hr)';
const currentHashrateColor = '55,200,255';
const workersText = 'Workers';
const workersColor = '200,0,0';

var currentHashrate;
var hashrate;
var workersOnline;

function insertData() {
	currentHashrate = [];
	hashrate = [];
	workersOnline = [];
	for (let object of graphData) {
		let time = parseInt(object.time) * 1000;
		currentHashrate.push([time, parseInt(object.currentHashrate)]);
		hashrate.push([time, parseInt(object.hashrate)]);
		workersOnline.push([time, parseInt(object.workersOnline)]);
	}
	accountGraph.highcharts().series[0].setData(currentHashrate, false);
	accountGraph.highcharts().series[1].setData(hashrate, false);
	accountGraph.highcharts().series[2].setData(workersOnline, false);
	accountGraph.highcharts().redraw();
}

function getMiner() {
	jsonUrl = 'api/' + location.hash.replace(/#/, '') + '.json';
}

$(document).ready(function() {
	getMiner();
	refreshData();
	window.onhashchange = function() {
		getMiner();
		refreshData();
	}
	setInterval(function() {
		refreshData();
	}, refreshDelay * 1000);
});

accountGraph.highcharts({
	chart: {
		backgroundColor: 'rgba(0,0,0,0)',
		alignTicks: false,
	},
	title: {
		text: '',
	},
	subtitle: {
		text: timescaleText,
	},
	tooltip: {
		shared: true,
		valueDecimals: 2,
		formatter: function() {
			return formatTooltip(this.x, this.points);
		},
	},
	legend: {
		layout: 'horizontal',
	},
	credits: {
		enabled: false,
	},
	xAxis: {
		title: {
			text: timeText,
		},
		type: 'datetime',
		showFirstLabel: true,
	},
	yAxis: [{
		title: {
			text: hashrateLabel,
		},
		labels: {
			style: {
				color: 'rgba(' + hashrateColor + ',1)',
			},
			formatter: function() {
				return formatHashrate(this.value);
			},
		},
		floor: 0,
		gridLineColor: 'rgba(' + hashrateColor + ',0.25)',
	},{
		title: {
			text: '',
		},
		floor: 0,
	},{
		title: {
			text: 'Workers',
		},
		labels: {
			style: {
				color: 'rgba(' + workersColor + ',1)',
			},
		},
		floor: 0,
		minTickInterval: 1,
		minorGridLineWidth: 0,
		gridLineWidth: 0,
		allowDecimals: false,
		opposite: true,
	}],
	series: [{
		id: '1',
		name: currentHashrateText,
		data: currentHashrate,
		type: 'spline',
		color: 'rgba(' + currentHashrateColor + ',0.8)',
	},{
		id: '2',
		name: hashrateText,
		data: hashrate,
		type: 'spline',
		color: 'rgba(' + hashrateColor + ',0.8)',
	},{
		id: '3',
		name: workersText,
		data: workersOnline,
		type: 'spline',
		yAxis: 2,
		color: 'rgba(' + workersColor + ',1)',
		lineWidth: 0,
		marker: {
			enabled: true,
			radius: 1,
		},
		states: {
			hover: {
				lineWidthPlus: 0,
			},
		},
	}]
});