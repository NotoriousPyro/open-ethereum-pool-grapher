// Copyright (C) Craig Crawford [NotoriousPyro], PyroNexus.com, Metaverse.farm
// Contact: admin@pyronexus.com, admin@metaverse.farm, craigcrawford1988@gmail.com
// Unauthorised reproduction, distribution or sharing without prior consent is
// strictly forbidden.
const refreshDelay = 300;
const timeText = 'Time (UTC)';
const timescaleText = '7 days (15 min intervals)';
const loader = $('.loader');

var jsonUrl;
var graphData;

async function refreshData() {
	loader.show();
	return new Promise(function(resolve, reject) {
		getJsonData(jsonUrl, function(data) {
			graphData = data;
			insertData();
			loader.hide();
		});
	});
}

function getJsonData(url, callback) {
	let request = new XMLHttpRequest;
	let timer = setTimeout(function() {
		getJsonData(url, callback);
	}, 10000);
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			clearTimeout(timer);
			return callback(JSON.parse(request.responseText));
		}
	}
	request.open('GET', url);
	request.send();
}

function formatHashrate(hashrateNum) {
	let hashrateUnit = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
	let iMax = hashrateUnit.length - 1;
	for (var i = 0; (hashrateNum > 1000) && (i < iMax); i++) {
		hashrateNum = hashrateNum / 1000;
	}
	return hashrateNum.toFixed(2) + " " + hashrateUnit[Math.min(i, iMax)] + "H/s";
}

function formatTooltip(x, points) {
	let date = Highcharts.dateFormat("%A, %b %e, %Y %H:%M", new Date(x));
	let tooltip = '<span style="font-size: 10px">' + date + '</span>';
	let y;
	for (let point of points) {
		if (point.series.name.includes("Hashrate")) {
			y = formatHashrate(point.y);
		}
		else if (point.y % 1 === 0) {
			y = point.y;
		}
		else {
			y = (point.y).toFixed(2);
		}
		tooltip += '<br/><span style="color:' + point.series.color + '">\u25CF</span>';
		tooltip += '<strong>' + point.series.name + ':</strong> ' + y;
	}
	return tooltip;
}