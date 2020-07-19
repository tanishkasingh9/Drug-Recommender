firstTimeFocus = true
searchTop = 0
searchTags = []
drugPanelIds = []
drugPanelDrugs = []
inputFile = "data/webMD_part3.csv"

conditions = []
drugIdDict = []
drugsConditionDict = []
datasetJson = null
drugsSatisfactionDict =[]
drugsEffectiveDict = []

//barwidth = (50/(0+searchTags.length)).toString()+"%"
barwidthDivider = 25
stackMultiplier = 1
barSeparator = 5
barMaxHeight = 80
stachColorArr = ["#b33040", "#d25c4d", "#f2b447", "#d9d574"]

// var stachColorArr = {"con 1":"#b33040", "con 2":"#d25c4d", "a":"#f2b447", "b":"#d9d574"};
function filterbytags_andCreateXY(drugid,search_tags,satdict){
    data = []
    x = 0
    for (i=0; i<search_tags.length; i++){
        scoresbydrug = {"condition":searchTags[i]}
        for(j=0; j<drugid.length; j++){
            x += 1
            //console.log(satdict[search_tags[i]])
            rating = satdict[search_tags[i]][drugid[j]]
            if (rating){
                sum = 0
                count =0
                scores = ["1","2","3","4","5"]
                countSum = scores.map(function(d){
                    count += rating[d]
                    sum += parseInt(d)*rating[d]
                })
                average = sum/count
                //console.log(search_tags[i],average)
                scoresbydrug[drugid[j]] = average
            }
        }
        data.push(scoresbydrug) 
    }
    // console.log(data)
    return data;
}

function makeGraph(drug_ids, drug_names){
    $(".graphPannel").html('')
    var margin = {top: 100, right: 160, bottom: 100, left: 30};
    var width = Math.max(75,$(".graphPannel").width() - margin.left - margin.right),
        height = $(".graphPannel").height() - margin.top - margin.bottom;

    var svg = d3.select(".graphPannel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('pointer-events', 'all')
    .attr('cursor','pointer')
    .append("g")
    .attr("class", "main_g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    barGdata = filterbytags_andCreateXY(drug_ids,searchTags,drugsSatisfactionDict)
    // console.log("hi")
    // console.log(barGdata)
    // console.log("bye")

    var data = []

    for(var ob in barGdata){
        curD = {}
        for(var key in barGdata[ob]){
            // console.log(key, barGdata[ob][key])
            curD[key] = barGdata[ob][key]
        }
        data.push(curD)
    }
    var parse = d3.time.format("%Y").parse;


    // Transpose the data into layers
    // var dataset = d3.layout.stack()(drug_names.map(function(fruit) {
    // return data.map(function(d) {
    //     return {x: parse(d.condition), y: +d[fruit]};
    // });
    // }));
    
    stackdata = drug_ids.map(function(c){
        return barGdata.map(function(d,i) {
          return {x:d["condition"], y:d[c]} })
        })
    var stack = d3.layout.stack()
    var dataset = stack(stackdata)
    //console.log("dataset", dataset)
    
    
    // Set x, y and colors
    var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

    var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

    var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];

    // Prep the tooltip bits, initial display is hidden
    
    // console.log(tooltip)
    var tooltip = svg.append("g")
    .attr("class", "toolTip")
    .style("display", "none");

    tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);
  
    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

    // Define and draw axes
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // .tickFormat(d3.time.format("%Y"));
 

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


    //Create groups for each series, rects for each segment 
    var groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { 
        // console.log(d)
        return colors[i]; });


    // Draw legend
    var legend = svg.selectAll(".legend")
    .data(colors.slice(0,drug_ids.length))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
    
    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice(0,drug_ids.length).reverse()[i];});
    
    legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) { 
        return drug_names.slice().reverse()[i]
    });


    
    var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { 
        return y(d.y0 + d.y); })
    .attr("height", function(d) { 
        //console.log("yoo")
        return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .attr("class", "dataRect")
    .attr('pointer-events', 'all')
    .attr('cursor','pointer');

    rect.on("mousemove", function() {
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y);
    })
    rect.on("mouseover", function() {
        console.log("yello");
        tooltip.style("display", null); 
    })
    rect.on("mouseout", function() {
        console.log("bello");
        tooltip.style("display", "none"); 
    })
    
    
    
    
}


// function makeGraph_old(drug_ids, drug_names){

//     axis_xval = []
//     $(".graphpannel").html('')
//     var canvas = d3.select(".graphpannel").append('svg')
//                                             .attr("height","100%")
//                                             .attr("width", "100%")
//                                             .attr("y","10%")
//                                             // .style("fill","white");
//     var rect = canvas.append('rect')
//                         .attr("height","80%")
//                         .attr("width", "100%")
//                         .attr("y","10%")
//                         .style("fill","white");
//     barGdata = filterbytags_andCreateXY(drug_ids,searchTags,drugsSatisfactionDict)

//     stackdata = drug_ids.map(function(c){
//         return barGdata.map(function(d,i) {
//           return {x:d["condition"], y:d[c]} })
//         })
//     var stack = d3.layout.stack()
//     var dataset_cond = stack(stackdata)
//     console.log(dataset_cond)
//     classInd = 0
//     var groups = canvas.selectAll("g")
//                     .data(dataset_cond)
//                     .enter()
//                     .append("g")
//                     .attr("class", function(d){
//                         classInd += 1
//                         return "barGroup"+(classInd-1).toString()
//                     })
//                     .style("fill", function(d, i) {
//                         // console.log(i)
//                         // console.log(d) 
//                         return stachColorArr[i]})

//     var bar = groups.selectAll(".bar_rect")
//                     //.selectAll(".bar_rect")
//                     .data(function(d) {return d})
//                     .enter()
//                     .append("rect")
//                     .attr("class", "bar_rect")
//                     .attr("x", function(d, i) {
//                         axis_xval.push(((i+1) * (barwidthDivider/(searchTags.length) +  barSeparator)))
//                         return ((i+1) * (barwidthDivider/(searchTags.length) +  barSeparator)).toString() + "%";
//                     })
//                     .attr("y", function(d,i) {
//                         return  (barMaxHeight-((d.y0+d.y) * stackMultiplier)).toString()+"%"
//                     })
//                     .attr("height", function(d,i) {
//                         return (d.y * stackMultiplier).toString()+"%"
//                     })
//                     .attr("width", (barwidthDivider/(searchTags.length)).toString()+"%");
    
//     lineStartx = $(".barGroup0 rect:first-child").position().left
//     lineStarty = $(".barGroup0 rect:first-child").position().top
//     lineEndx = $(".barGroup0 rect:last-child").position().left
//     lineEndy = $(".barGroup0 rect:last-child").position().top

//     // var axis = canvas.append("g").attr("class", "axis")
//                     // .attr("transform", "translate(0," + 25 + ")")
//                     canvas.append('line')
//                         .style("stroke", "lightgreen")
//                         .style("stroke-width", 100)
//                         .attr("x1", lineStartx)
//                         .attr("y1", lineStarty)
//                         .attr("x2", lineEndx)
//                         .attr("y2", lineStarty)


//     // canvas.append("g")
    

//     // console.log($('.classInd0'))
//     // var x = d3.scale.ordinal()
//     //                 .domain(dataset_cond[0].map(function(d) { return d.x; }))
//     //                 .range(axis_xval.map(function(d) {
//     //                     return (d).toString()+"%"
//     //                 }))
//     // console.log(x)
//     // var xAxis = d3.svg.axis().scale(x);
    
//     // var xAxis = d3.svg.axis()
//     //                 .scale(x)
//     //                 .orient("bottom")
//     //                 // .tickFormat(d3.time.format("%Y"));
//     // canvas.append("g")
//     //                 .attr("class", "x axis")
//     //                 //.attr("transform", "translate(0%," + 25 + "%)")
//     //                 .call(xAxis);
                  
//     // console.log(drug_ids)
//     // console.log(drug_names)
// }

function findCommonElements(inArrays) {
  // check for valid input
  if (typeof inArrays==="undefined") return undefined;
  if (typeof inArrays[0]==="undefined") return undefined;
  
  return _.intersection.apply(this, inArrays);
}

function removeSymptomsWithNoCommonDrugs(myconditions, mysearchTags){
    new_conditions = []

    my_conditions_with_common_drugs = []
    for(i=0;i<searchTags.length;i++){
        my_conditions_with_common_drugs.push(drugsConditionDict[searchTags[i]])
    }

    for(i=0;i<myconditions.length;i++){
        my_conditions_with_common_drugs.push(drugsConditionDict[myconditions[i]])
        myPossibleSymptoms = findCommonElements(my_conditions_with_common_drugs);
        if(myPossibleSymptoms.length != 0){
            new_conditions.push(myconditions[i])
        }
        my_conditions_with_common_drugs.pop()
    }
    return new_conditions
}

function updateDrugsPanel(){
    
    drugPanelIds = []
    conditions_with_common_drugs = []
    for(i=0;i<searchTags.length;i++){
        conditions_with_common_drugs.push(drugsConditionDict[searchTags[i]])
    }
    
    drugPanelIds = findCommonElements(conditions_with_common_drugs);
    
    if(drugPanelIds != null){
        drugPanelDrugs = drugPanelIds.map(drugPanelId => drugIdDict[drugPanelId])
        drugsList = drugPanelDrugs.map(drug => `<li class=drugOpt value=${drug}>${drug}</li>`)
        $(".drugList").html(!drugsList ? '' : drugsList.join(''));
        makeGraph(drugPanelIds, drugPanelDrugs)
    }
    else{
        $(".graphpannel").html('')
        $(".drugList").html('')
    }
}

function updateSearchTags() {
    // tempTags = searchTags.map(searchTag => `<div class=aSearchTag><div class="searchText">${searchTag}</div><div class="tagCross"><i class="fas fa-times crossFas"></i></div></div>`)
    tempTags = searchTags.map(searchTag => `<div class=aSearchTag>${searchTag}</div>`)
    $(".searchTags").html(!tempTags ? '' : tempTags.join(''));
    $('.aSearchTag').on('click', function () {
        // console.log($(this).text());
        searchTags = searchTags.filter(searchTag => searchTag != $(this).text());
        $(".searchTags").html('');
        updateSearchTags()
    });

    updateDrugsPanel()
}

function firstTimeSearchFocus() {
    if (firstTimeFocus) {
        firstTimeFocus = false;
    }
    else {
        return;
    }
    $(".searchContent").css({ "animation-name": "searchMoveUp", "animation-duration": "1s" }).css({ "top": "20%" });
    $(".dashboard").css({ "animation-name": "dashboardMoveUp", "animation-duration": "1s" }).css({ "top": "60%", "opacity":"1" });
    
}

function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split("~");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split("~");
  
        for(var j=0;j<headers.length;j++){
            // if(currentline[j] == "")
            // {
            //     obj[headers[j]] = lines[i-1].split(",")[j];
            // }
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    return result; //JSON
}

function scoreDict(json,cond_list,key,value){
    var dict = {};
    for (i=0;i<cond_list.length;i++){
        dict[cond_list[i]] = {}
    }
    
    for (i=0;i<json.length;i++)
    {   //console.log(i, json[i])
        if (cond_list.indexOf(json[i]["Condition"]) != -1){
            if (dict[json[i]["Condition"]][json[i][key]]==null){
                dict[json[i]["Condition"]][json[i][key]] = {'5':0, '4':0, '3':0, '2':0, '1':0}
            }
            if (dict[json[i]["Condition"]][json[i][key]]){
                if (json[i][key][value] != NaN){
                    dict[json[i]["Condition"]][json[i][key]][json[i][value]] += 1;
                }
            }
        }
    }
    return dict
}


function toDict(json,key,value){
    var dict = {};
    for (i=0;i<json.length;i++)
    {   //console.log(i, json[i])
        if (dict[json[i][key]]==null){
            dict[json[i][key]] = []
        }
        if (dict[json[i][key]]){
            dict[json[i][key]].push(json[i][value]);
            dict[json[i][key]] = Array.from(new Set(dict[json[i][key]]))
        }
        
    }
    
    return dict;
}

function getColAsArray(Json, key) {

    arr = [];
    for (i = 0; i < Json.length; i++) {
        // console.log(i,myJ[i][key])
        arr.push(Json[i][key]);
    }
    return arr;
}

function removeSelected(my_conditions, my_searchTags) {

    return my_conditions.filter(x => !my_searchTags.includes(x));
}

$(document).ready(function () {
    $.ajax({
        url: inputFile,
        dataType: "text",
        success: function (data) {
            datasetJson = csvJSON(data)

            // datasetJson = data//JSON.parse(data)
            // console.log(datasetJson)
            conditions = getColAsArray(datasetJson,"Condition");
            conditions.pop()
            conditions = Array.from(new Set(conditions))
            drugIdDict = toDict(datasetJson, "DrugId", "Drug")
            drugsConditionDict = toDict(datasetJson, "Condition", "DrugId")
            drugsSatisfactionDict = scoreDict(datasetJson, conditions, "DrugId", "Satisfaction") 
            drugsEffectiveDict = scoreDict(datasetJson, conditions, "DrugId", "Effectiveness") 
            // console.log(datasetJson[1])
            // console.log(drugsSatisfactionDict)
            // console.log(drugsEffectiveDict)
            // console.log(drugIdDict)
            // console.log(drugsConditionDict)

            // for (i=0;i<conditions.length-1;i++)
            // {
            //     console.log(i,conditions[i]);
            // }
        }
    });

    $(".input").keyup(function (data) {
        let searchOptions = []
        updatedConditions = removeSelected(conditions, searchTags)
        updatedConditions = removeSymptomsWithNoCommonDrugs(updatedConditions, searchTags)

        searchOptions = updatedConditions.filter(condition => condition.toLowerCase().includes(data.target.value.toLowerCase()));
        if (data.target.value == '') {
            searchOptions = []
        }
        
        searchOptions = searchOptions.map(searchOption => `<li class=searchOpt value=${searchOption}>${searchOption}</li>`)
        $(".searchList").html(!searchOptions ? '' : searchOptions.join(''));

        $('.searchOpt').on('click', function () {
            $(".input").val($(this).text())
            $('.searchOpt').off('click');
            $(".searchList").html('');
            searchTags.push($(this).text())
            updateSearchTags()
        });

    });

    $('.searchbtn').on('click', function(){
        currVal = $(".input").val()
        updatedConditions = removeSelected(conditions, searchTags)
        updatedConditions = removeSymptomsWithNoCommonDrugs(updatedConditions, searchTags)

        searchOptions = updatedConditions.filter(condition => condition.toLowerCase() == currVal.toLowerCase());
        if (searchOptions.length != 0) {
            searchTags.push(currVal)
            updateSearchTags()
            $('.searchOpt').off('click');
            $(".searchList").html('');
        }
    });
    $( window ).resize(function() {
        updateSearchTags()
      });

});



