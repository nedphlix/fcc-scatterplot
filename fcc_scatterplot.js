function draw(data) {
	
	// format data
	var parseTime = d3.timeParse("%M:%S");

	data.forEach(function(d) {
		d["Time"] = parseTime(d["Time"]);
	});

	// basic variables
	"use strict";
	var margin = 75,
		width = 900 - margin,
		height = 600 - margin,
		radius = 5,
		color = 'black';

	// chart title 
	d3.select("body")
		.append("h2")
		.text("Doping in Professional Bicycle Racing");

	d3.select("body")
		.append("p")
		.text("Tour de France: 35 Fastest times up Alpe d'Huez");

	// set up svg chart element
	var svg = d3.select("body")
		.append("svg")
			.attr("width", width + margin)
			.attr("height", height + margin)
		.append("g")
			.attr("class", "chart");

	d3.select("svg")
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle");

	// find range of time column
	var time_extent = d3.extent(data, function(d) {
		return d["Time"];
	})
	time_extent.reverse();
	console.log("time_extent: " + time_extent);

	// find range of place
	var place_extent = d3.extent(data, function(d) {
		return d["Place"];
	})
	place_extent.reverse();
	console.log("place_extent: " + place_extent);

	// create x-axis scale mapping times -> pixels
	var time_scale = d3.scaleTime()
		.range([margin, width])
		.domain(time_extent);

	// create y-axis mapping place -> pixels
	var place_scale = d3.scaleLinear()
		.range([height, margin])
		.domain(place_extent);

	// create x axis for time
	var time_axis = d3.axisBottom()
		.scale(time_scale);

	// create y axis for place
	var place_axis = d3.axisLeft()
		.scale(place_scale);

	// draw x-axis
	d3.select("svg")
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(time_axis
			.tickFormat(d3.timeFormat("%M-%S"))
		);

	// draw y axis
	d3.select("svg")
		.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin + ",0)")
		.call(place_axis);

	// draw data circles
	d3.selectAll("circle")
		.attr("class", "circle")
		.attr("cx", function(d) {
			return time_scale(d["Time"]);
		})
		.attr("cy", function(d) {
			return place_scale(d["Place"]);
		})
		.attr("r", radius)
		.attr("fill", color);

	// add description text below
	d3.select("body")
		.append("p")
		.attr("class", "description")
		.html("Sources:<br><a href='https://en.wikipedia.org/wiki/Alpe_d%27Huez' target='blank'>1</a> | <a href='http://www.fillarifoorumi.fi/forum/showthread.php?38129-Ammattilaispy%F6r%E4ilij%F6iden-nousutietoja-%28aika-km-h-VAM-W-W-kg-etc-%29&p=2041608#post2041608' target='blank'>2</a> | <a href='https://alex-cycle.blogspot.com/2015/07/alpe-dhuez-tdf-fastest-ascent-times.html' target='blank'>3</a> | <a href='http://www.dopeology.org/' target='blank'>4</a>");

};

d3.json("cyclist_data.json", draw);