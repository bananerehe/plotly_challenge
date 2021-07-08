UpdatePage();
// Update all plots on new sample selection
d3.select("#selDataset").on("change", UpdatePage);

function UpdatePage() {
    d3.json("data/samples.json").then(function(dataSamples) {
        
        // Fetch JSON data
        console.log(dataSamples);
        
        let uniqueNames=dataSamples["names"].filter((item, i, ar) => ar.indexOf(item) === i);
        console.log(uniqueNames);
        
        uniqueNames.forEach(name => d3.select("#selDataset").append("option").text(name));
        
        let selectedId=d3.select("#selDataset").property("value");
        console.log(selectedId);
        d3.select("#sample-metadata").html("");
        
        let selectedMeta=dataSamples['metadata'].filter(sampleInfo =>sampleInfo["id"]==selectedId);
        console.log(selectedMeta[0]);
        
        selectedMeta.forEach(demoInfo=> {
            Object.entries(demoInfo).forEach(([key,value])=> {
                d3.select("#sample-metadata").append("p").append("strong").text(`${key}: ${value}`);
            })
        });
        
        let selectedOtus=dataSamples['samples'].filter(otu => otu["id"]==selectedId);
        let otuIds=selectedOtus[0].otu_ids;
        let sampleValues=selectedOtus[0].sample_values;
        let otuLabels=selectedOtus[0].otu_labels;
        let selectedList=otuIds.map((a,i)=>[a,sampleValues[i],otuLabels[i]]);
        
        console.log(selectedList);

        // Top 10 OTUs 
        sortedList=selectedList.sort((a,b)=>(b[1]-a[1])).slice(0,10);
        console.log(sortedList);
        
        // Horizontal Bar Chart
        PlotBar(sortedList, selectedId);

        // Bubble Chart
        PlotBubble (otuIds, sampleValues,selectedList, selectedId);  
    });
};

function PlotBar (sortedList, selectedId) {
    var data = [{
            type: 'bar',
            x: sortedList.map(a=>a[1]).reverse(),
            y: sortedList.map(a=>`OTU${a[0]} `).reverse(),
            text: sortedList.map(a=>a[2]).reverse(),
            marker: {
                color: 'e5f9f8',
                line: {width: 0.5}
            },
            orientation: 'h'
        }];
    var layout = {
            title: `Top 10 OTUs in Test Subject ID ${selectedId}`,
            xaxis: {title: 'OTU Value'},
            font: {size: 12},
            showlegend: false
        };
    Plotly.newPlot('bar', data, layout);
};

function PlotBubble(otuIds, sampleValues,selectedList, selectedId){
  var trace1 = {
          x: otuIds,
          y: sampleValues,
          text: selectedList,
          mode: 'markers',
          marker: {
              color: otuIds,
              size: sampleValues
          }
      };
  var layout = {
          title: `All OTUs found in Test Subject ID ${selectedId}`,
          font: {size: 12},
          xaxis: {title: 'OTU ID'},
          showlegend: false
      };
  Plotly.newPlot('bubble', [trace1], layout);
};