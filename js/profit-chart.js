'use strict';

// document.addEventListener("DOMContentLoaded", function() {
//   if (!window.d3) {
//     console.error("D3 library is not loaded");
//     return;
//   }

function initCharts() {
    if (!window.d3) {
      console.error("D3 library is not loaded");
      return;
    }

  var dataset1 = [
      { count: 89, size: 15 },   // Cost MS
      { count: 11, size: 25 }    // Profit MS
  ];

  var dataset2 = [
      { count: 85, size: 15 },   // Cost HSD
      { count: 15, size: 25 }    // Profit HSD
  ];

  var width = 300;
  var height = 300;
  var donutWidth = 50;
  var innerRadius = (Math.min(width, height) / 2) - donutWidth;
  var profitstr = "Profit Margin";

  var colorScale1 = d3.scale.ordinal()
      .domain([0, 1])
      .range(['#99a5b8', 'blue']); // Light blue, blue d8ddfa

  var colorScale2 = d3.scale.ordinal()
      .domain([0, 1])
      .range(['#99a5b8', '#fa7000']); // Light orange, orange

console.log(document.querySelector('#donut-chart-1'));
console.log(document.querySelector('#donut-chart-2'));
  
  // Chart 1
  var svg1 = d3.select('#donut-chart-1')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var arc1 = d3.svg.arc()
      .innerRadius(innerRadius + 5)
      .outerRadius(function (d) {
          return innerRadius + d.data.size;
      });

  var pie1 = d3.layout.pie()
      .value(function (d) { return d.count; })
      .sort(null);

  var path1 = svg1.selectAll('path')
      .data(pie1(dataset1))
      .enter()
      .append('path')
      .attr('d', arc1)
      .attr('fill', function (d, i) {
          return colorScale1(i);
      });

  // Calculate profit percentage for Chart 1
  var profit1 = Math.round((dataset1[1].count / (dataset1[0].count + dataset1[1].count)) * 100);

  var text1 = svg1.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('fill', '#000');
  text1.append('tspan')
      .text('Profit Margin')
      .attr('dy', '-0.1em')
      .attr('x', 0)
      .attr("font-size", "1.6em");
  text1.append('tspan')
      .text(profit1 + '%')
      .attr('dy', '1.3em')
      .attr('x', 0)
      .attr("font-size", "1.6em");

  // Chart 2
  var svg2 = d3.select('#donut-chart-2')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var arc2 = d3.svg.arc()
      .innerRadius(innerRadius + 5)
      .outerRadius(function (d) {
          return innerRadius + d.data.size;
      });

  var pie2 = d3.layout.pie()
      .value(function (d) { return d.count; })
      .sort(null);

  var path2 = svg2.selectAll('path')
      .data(pie2(dataset2))
      .enter()
      .append('path')
      .attr('d', arc2)
      .attr('fill', function (d, i) {
          return colorScale2(i);
      });

  // Calculate profit percentage for Chart 2
  var profit2 = Math.round((dataset2[1].count / (dataset2[0].count + dataset2[1].count)) * 100);

  var text2 = svg2.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('fill', '#000');
  text2.append('tspan')
      .text('Profit Margin')
      .attr('dy', '-0.1em')
      .attr('x', 0)
      .attr("font-size", "1.6em");
  text2.append('tspan')
      .text(profit2 + '%')
      .attr('dy', '1.3em')
      .attr('x', 0)
      .attr("font-size", "1.6em");
}
window.onload = initCharts;
