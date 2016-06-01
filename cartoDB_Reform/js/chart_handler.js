$(document).ready(function() {



    ChartHandler = (function() {

        function initChart() {

             chart_container = new HighCharts.Chart({ 
            // $('#chart_container').highcharts({
                
                chart: {
                    renderTo: "chart_container",
                    type: 'column',

                },
                colors: ['#003762', '#940E19', '#003762'],
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['Ja', 'Nei', 'Blankt']
                },
                yAxis: {
                    title: {
                        text: 'Antall Stemmer'
                    }
                },
                series: [{
                    name: 'Kommune',
                    data: [1, 2, 3]
                }]
            });

        }

        function showTotal(data) {
            $('#chart_container').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Nasjonale resultater: ' + data[2].toFixed(2) + " % gjennomsnittlig valgdeltakelse"
                },
                xAxis: {
                    categories: ['Ja', 'Nei']
                },
                yAxis: {
                    title: {
                        text: 'Nasjonale Resultater (%)'
                    }
                },
                series: [{
                    name:"Resultat",
                    data: [{
                        name:"% av kommunene der resultatet ble ja",
                        y: parseInt(data[0].toFixed(2)),
                        color: "#003762"
                    }, {
                        name:"% av kommunene der resultatet ble nei",
                        y: parseInt(data[1].toFixed(2)),
                        color: "#940E19"
                    }]
                }]
            });
        }

        function decidedChart(data, result) {
            var columnColor = {};
            console.log(data[0]);
            switch (result) {
                case "prosent_ja":
                    columnColor.first = "#003762";
                    columnColor.second = "#00457c";
                    columnColor.third = "#0062af";
                    break;
                case "prosent_nei":
                    columnColor.first = "#940E19";
                    columnColor.second = "#bb111f";
                    columnColor.third = "#e91627";
                    break;
                default:
                    break;
            }

            $('#chart_container').highcharts({
                chart: {
                    type: 'bar'
                },
                colors: [],
                title: {
                    text: "Topp "+ data.length+ " kommuner med størst valgdeltakelse"
                },
                xAxis: {
                    categories: [data[0].kommune, data[1].kommune, data[2].kommune,data[3].kommune,data[4].kommune]
                },
                yAxis: {
                    title: {
                        text: "Prosentvis valgdeltakelse"
                    }
                },
                series: [{
                    name: "Valgdeltakelse",
                    data: [{
                        y: data[0].valgdeltakelse,
                        color: columnColor.third
                    }, {
                        y: data[1].valgdeltakelse,
                        color: columnColor.second
                    }, {
                        y: data[2].valgdeltakelse,
                        color: columnColor.second
                    },
                    {
                        y: data[3].valgdeltakelse,
                        color: columnColor.first
                    },
                    {
                        y: data[4].valgdeltakelse,
                        color: columnColor.first
                    }]
                }]
            });
        }

        //Data[0] = ja
        //Data[1] = nei
        //Data[2] = prosent_blankt
        function updateChart(data) {
            $('#chart_container').highcharts({
                chart: {
                    type: 'bar'
                },
                colors: [],
                title: {
                    text: data[4] +"<br>"+" (" +data[3] +" % deltakelse)"
                },
                xAxis: {
                    categories: ['Ja', 'Nei', 'Blankt']
                },
                yAxis: {
                    title: {
                        text: 'Prosent antall stemmer'
                    }
                },
                series: [{
                    name: "Resultat",
                    data: [{
                        y:data[0],
                        color: "#003762"
                    },{
                        y:data[1],
                        color: "#940E19"
                    },{
                        y:data[2],
                        color: "#ACACAC"
                    }]
                }]
            });
        }

        return {
            initChart: initChart,
            updateChart: updateChart,
            showTotal: showTotal,
            decidedChart: decidedChart
        }


    })();


});