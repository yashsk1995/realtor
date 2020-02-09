(function() {


    var queryString = new Array();
    $(function () {
        if (queryString.length == 0) {
            if (window.location.search.split('?').length > 1) {
                var params = window.location.search.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].split('=')[0];
                    var value = decodeURIComponent(params[i].split('=')[1]);
                    queryString[key] = value;
                }
            }
        }
        if (queryString["p1"] != null && queryString["p2"] != null) {
            // var data = "<u>Values from QueryString</u><br /><br />";
            // data += "<b>Name:</b> " + queryString["name"] + " <b>Technology:</b> " + queryString["technology"];
            // $("#lblData").html(data);
            $("#avg").text(queryString['p1']);
            $("#cost").text(queryString['p2']);
            var avgPrice = parseFloat(queryString['p1']);
            var costRepair= parseFloat(queryString['p2']);
            console.log(avgPrice);
            console.log(costRepair);
            var ans = ((avgPrice*70)/100);

            $("#per").text(ans);
            // var ans = q1+avgPrice;
            console.log(ans);
            var offer = (ans - parseFloat(costRepair));
            $("#offer").text(offer);
            console.log(offer);

            var bid = ((offer*85)/100);
            console.log(bid);
            $("#bid").text(bid);
            // console.log(queryString['p1']);
            // console.log(queryString['p2']);
             var countTen = (bid*10)/100;
            console.log(countTen);
            var Plusten = (countTen+bid);
            console.log("10+ "+ Plusten);

            // var countTenMinus = (avg*10)/100;
            // console.log(countTen);
            var Minusten = (bid-countTen);
            console.log("10- "+ Minusten);

            Highcharts.chart('container', {

                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
            
                title: {
                    text: 'Gauge Meter'
                },
            
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },
            
                // the value axis
                yAxis: {
                    min: Minusten,
                    max: Plusten,
            
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
            
                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: '$'
                    },
                    plotBands: [{
                        from: 0,
                        to: 120,
                        color: '#55BF3B' // green
                    }, {
                        from: Minusten,
                        to: Minusten+(Minusten-(Minusten*0.20)),
                        color: '#DDDF0D' // yellow
                    }, {
                        from: Plusten,
                        to: Plusten+(Plusten+(Plusten*0.20)),
                        color: '#DF5353' // red
                    }]
                },
            
                series: [{
                    name: 'Speed',
                    data: [bid],
                    tooltip: {
                        valueSuffix: ' $'
                    }
                }]
            
            },
            // Add some life
            );
        }
    });


  })();





//   function (chart) {
//     if (!chart.renderer.forExport) {
//         setInterval(function () {
//             var point = chart.series[0].points[0],
//                 newVal,
//                 inc = Math.round((Math.random() - 0.5) * 20);

//             newVal = point.y + inc;
//             if (newVal < 0 || newVal > 200) {
//                 newVal = point.y - inc;
//             }

//             point.update(newVal);

//         }, 3000);
//     }
// }