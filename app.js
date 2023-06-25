const bacteriaData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function initMenu() {
    let dropDownMenu = d3.select("#selDataset");
    d3.json(bacteriaData).then((data) => {
        console.log(data);
        let bacteriaNames = data.names;
        bacteriaNames.forEach((bacteriaName) => {
            dropDownMenu.append("option").text(bacteriaName).property("value", bacteriaName);
        });
        let sampleName = bacteriaNames[0];
        createBarChart(sampleName);
        metatable(sampleName);
        createBubbleChart(sampleName);
        createGaugeChart(sampleName);
    });
}

function createBarChart(selectedSample) {
    d3.json(bacteriaData).then((data) => {
        console.log(data);
        let bacteriaSamples = data.samples;
        let samplesArray = bacteriaSamples.filter(bacteriaSample => bacteriaSample.id === selectedSample);
        let result = samplesArray[0];
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let bacteriaSampleValues = result.sample_values;
        let yTicks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
        let xTicks = bacteriaSampleValues.slice(0, 10).reverse();
        let hoverLabels = otuLabels.slice(0, 10).reverse();
        let trace = {
            x: xTicks,
            y: yTicks,
            text: hoverLabels,
            type: "bar",
            orientation: "h"
        };
        let barData = [trace];
        let title = "Top 10 Bacteria Found in Individual";
        let barLayout = {
            title: title,
            margin: {
                t: 100,
                b: 100,
                l: 100,
                r: 100
            }
        };
        Plotly.newPlot('bar', barData, barLayout);
    });
}

function metatable(selectedSample) {
    d3.json(bacteriaData).then((data) => {
        console.log(data);
        let metaSamples = data.metadata;
        let metaArray = metaSamples.filter(metaSample => metaSample.id === parseInt(selectedSample));
        let result = metaArray[0];
        let metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

function createBubbleChart(selectedSample) {
    d3.json(bacteriaData).then((data) => {
        console.log(data);
        let bacteriaSamples = data.samples;
        let samplesArray = bacteriaSamples.filter(bacteriaSample => bacteriaSample.id === selectedSample);
        let result = samplesArray[0];
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let bacteriaSampleValues = result.sample_values;
        let trace = {
            x: otuIds,
            y: bacteriaSampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: bacteriaSampleValues,
                color: otuIds,
                colorscale: 'Earth'
            }
        };
        let bubbleData = [trace];
        let layout = {
            xaxis: { title: "OTU ID" },
            showlegend: false,
            height: 600,
            width: 1000
        };
        Plotly.newPlot("bubble", bubbleData, layout);
    });
}

function createGaugeChart(selectedSample) {
    d3.json(bacteriaData).then((data) => {
        console.log(data);
        let metaSamples = data.metadata;
        console.log(metaSamples);
        let metaArray = metaSamples.filter(metaSample => metaSample.id === parseInt(selectedSample));
        console.log(metaArray);
        let result = metaArray[0];
        console.log(result);
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 20 } },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9], nticks: 10 },
                steps: [
                    { range: [0, 1], color: "rgb(247, 241, 233)" },
                    { range: [1, 2], color: "rgb(243, 239, 225)" },
                    { range: [2, 3], color: "rgb(230, 227, 195)" },
                    { range: [3, 4], color: "rgb(225, 228, 170)" },
                    { range: [4, 5], color: "rgb(207, 225, 146)" },
                    { range: [5, 6], color: "rgb(174, 198, 135)" },
                    { range: [6, 7], color: "rgb(127, 184, 125)" },
                    { range: [7, 8], color: "rgb(125, 179, 132)" },
                    { range: [8, 9], color: "rgb(120, 172, 127)" }
                ],
            }
        }];
        let layout = {
            width: 500,
            height: 400,
            margin: { t: 100, b: 100, l: 100, r: 100 }
        };
        Plotly.newPlot("gauge", trace, layout);
    });
}

function optionChanged(newSample) {
    createBarChart(newSample);
    metatable(newSample);
    createBubbleChart(newSample);
    createGaugeChart(newSample);
}

initMenu();

