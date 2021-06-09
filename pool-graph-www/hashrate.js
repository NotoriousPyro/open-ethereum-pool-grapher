// Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
// Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
// Unauthorised reproduction, distribution or sharing without prior consent is
// strictly forbidden.
const poolGraph = $('#poolGraph');
const etpGraph = $('#etpGraph');
const hashrateLabel = 'Hashrate';
const hashrateText = 'Hashrate';
const hashrateColor = '55,128,255';
const minersText = 'Miners';
const minersColor = '200,0,0';
const blockDifficultyText = 'Block Difficulty (T)';
const blockDifficultyColor = '193,47,0';
const priceUSDText = 'Price (USD)';
const priceUSDColor = '0,200,0';

var hashrate;
var minersTotal;
var blockDifficulty;
var priceUSD;

jsonUrl = 'api/data.json';

function insertData() {
	hashrate = [];
	minersTotal = [];
	blockDifficulty = [];
	priceUSD = [];
	for (let object of graphData) {
		let time = parseInt(object.time) * 1000;
		hashrate.push([time, parseInt(object.hashrate)]);
		minersTotal.push([time, parseInt(object.minersTotal)]);
		blockDifficulty.push([time, parseInt(object.difficulty) / 1000000000000]);
		priceUSD.push([time, parseFloat(object.priceUSD)]);
	}
	poolGraph.highcharts().series[0].setData(hashrate, false);
	poolGraph.highcharts().series[1].setData(minersTotal, false);
	poolGraph.highcharts().redraw();
	etpGraph.highcharts().series[0].setData(blockDifficulty, false);
	etpGraph.highcharts().series[1].setData(priceUSD, false);
	etpGraph.highcharts().redraw();
}
	
$(document).ready(function() {
	refreshData();
	window.onhashchange = function() {
		insertData();
	}
	setInterval(function() {
		refreshData();
	}, refreshDelay * 1000);
});

poolGraph.highcharts({
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
			text: minersText,
		},
		labels: {
			style: {
				color: 'rgba(' + minersColor + ',1)',
			},
		},
		floor: 0,
		minTickInterval: 1,
		gridLineWidth: 0,
		minorGridLineWidth: 0,
		allowDecimals: false,
		opposite: true,
	}],
	series: [{
		id: '1',
		name: hashrateText,
		data: hashrate,
		type: 'spline',
		color: 'rgba(' + hashrateColor + ',0.8)',
	},{
		name: minersText,
		type: 'spline',
		data: minersTotal,
		yAxis: 1,
		color: 'rgba(' + minersColor + ',1)',
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
etpGraph.highcharts({
	chart: {
		backgroundColor: 'rgba(0,0,0,0)',
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
			text: blockDifficultyText,
		},
		labels: {
			style: {
				color: 'rgba(' + blockDifficultyColor + ',1)',
			},
		},
		floor: 0,
		minTickInterval: 0.25,
		gridLineColor: 'rgba(' + blockDifficultyColor + ',0.25)',
	},{
		title: {
			text: priceUSDText,
		},
		labels: {
			style: {
				color: 'rgba(' + priceUSDColor + ',1)',
			},
		},
		floor: 0,
		minTickInterval: 0.25,
		minorGridLineWidth: 0,
		gridLineWidth: 0,
		opposite: true,
	}],
	series: [{
		name: blockDifficultyText,
		type: 'spline',
		data: blockDifficulty,
		color: 'rgba(' + blockDifficultyColor + ',0.8)',
	},{
		name: priceUSDText,
		type: 'spline',
		data: priceUSD,
		yAxis: 1,
		color: 'rgba(' + priceUSDColor + ',0.8)',
	}]
});