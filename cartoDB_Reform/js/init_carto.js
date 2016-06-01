//Global Map Object
var map;
var layerUrl = "https://andreasroeed.cartodb.com/api/v2/viz/47e50244-2700-11e6-9b13-0e5db1731f59/viz.json";
var sublayers = [];

cssyes = "#statuskart_med_resultater{line-color: #000000;polygon-fill:#003762}";
cssno = "#statuskart_med_resultater{line-color: #000000;polygon-fill:#940E19}";

function main() {

  $(document).ready(function() {
    //Check if DOM-element exists on this page
    if ($("#map").length == 0) {
      return false;
    }

    // Choose center and zoom level
    var options = {
      center: [63.44, 10.42], // Trondheim
      zoom: 4,
      minZoom: 4,
      maxZoom: 7
    }

    // Instantiate map on specified DOM element
    map = new L.Map('map', options);
    var standard = 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
    var stamen = 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
      // Add a basemap to the map object just created
    L.tileLayer(standard, {
      attribution: 'Stamen'
    }).addTo(map);

    cartodb.createLayer(map, layerUrl)
      .addTo(map)
      .on("done", function(layer) {
        var sublayer = layer.getSubLayer(0);
        sublayers.push(sublayer);
        LayersHandler.showTotal();
        // SliderHandler.addTimeSlider(sublayer[0]); // Not in use
      })
      .on("error", function(err) {
        alert("err: " + err);
      });
  });
} //main ends

window.onload = main;


//Handle click events
$(document).ready(function() {


  $("#total").click(function() {
    LayersHandler.showTotal();
  });

  $("#No").click(function() {
    LayersHandler.showResults(cssno, "prosent_nei", "prosent_ja","nei");
  });

  $("#Yes").click(function() {
    LayersHandler.showResults(cssyes, "prosent_ja", "prosent_nei","ja");
  });

  $("#byCount").change(function() {
    LayersHandler.byCount("prosent_nei", $(this).val());
  });

  $("#byName").change(function() {
    if ($(this).val() === "") {
      return false;
    } else {
      query = "SELECT prosent_ja,prosent_nei,prosent_blankt,kommune,valgdeltakelse FROM statuskart_med_resultater WHERE kommune ILIKE '" + $(this).val() + "'";
    }

    DataHandler.getData("andreasroeed", query, function(data) {
      dataArray = [];
      dataArray.push(data.rows[0].prosent_ja);
      dataArray.push(data.rows[0].prosent_nei);
      dataArray.push(data.rows[0].prosent_blankt);
      dataArray.push(data.rows[0].valgdeltakelse);
      dataArray.push(data.rows[0].kommune);
      ChartHandler.updateChart(dataArray);
    });

    LayersHandler.byName("kommune", $(this).val());


  });

});