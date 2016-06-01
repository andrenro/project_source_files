$(document).ready(function() {

  /**
   * 
   * @return public object literal containing function objects
   */
  LayersHandler = (function() {


    function showTotal() {
      sublayers[0].setSQL("SELECT * FROM statuskart_med_resultater");
      sublayers[0].setCartoCSS("#statuskart_med_resultater[resultat='ja']{line-color: #000000;polygon-fill:#003762} #statuskart_med_resultater[resultat='nei']{line-color: #000000;polygon-fill:#940E19} #statuskart_med_resultater[resultat='']{line-color: #000000;polygon-fill:#ACACAC}");
      cartodb.vis.Vis.addInfowindow(map, sublayers[0], ["valgdeltakelse","prosent_ja", "prosent_nei", "prosent_blankt", "kommune"]);

      var ja_count = 0;
      var nei_count = 0;
      var no_results = 0;
      var total = 0;

      DataHandler.getData("andreasroeed", "SELECT resultat,valgdeltakelse,prosent_ja,prosent_nei,prosent_blankt FROM statuskart_med_resultater", function(data) {
        var has_results = 0;
        var mean_participation = 0;
        console.log(data);
        for (var x = 0; x < data.rows.length; x++) {

          mean_participation += data.rows[x].valgdeltakelse;
          if (data.rows[x].resultat == "ja") {
            has_results++;
            ja_count++;
          } else if (data.rows[x].resultat == "nei") {
            nei_count++;
            has_results++;
          } else if (data.rows[x].resultat == "") {
            no_results++;
          } else {
            continue;
          }
        }

        total = ja_count + nei_count + no_results;

        var percent_ja = ((ja_count * 100) / has_results)
        var percent_nei = ((nei_count * 100) / has_results)

        mean_participation = (mean_participation/ has_results);
        var data = [percent_ja,percent_nei,mean_participation];

        ChartHandler.showTotal(data);

      });
    };



    /**
     * @param  {string} css - styling
     * @param  {string} bigger - The value to compare with smaller
     * @param  {string} smaller - The value to compare with bigger
     * @return {undefined} 
     */
    function showResults(css, bigger, smaller,result) {
      sublayers[0].setSQL("SELECT * FROM statuskart_med_resultater WHERE " + bigger + " > " + smaller + " OR resultat='"+result+"'");
      sublayers[0].setCartoCSS(css);
      var bigger = bigger;


      DataHandler.getData("andreasroeed", "SELECT prosent_nei,prosent_ja,prosent_blankt,resultat,kommune,valgdeltakelse FROM statuskart_med_resultater WHERE (" + bigger + " > " + smaller + ") OR resultat='"+result+"'", function(data) {
        var tmp = [];
        var topRated = [];
        var tmp_high = 0;
        var high_index = 0;
        var copy = data.rows;
        for (let y = 0; y < 5;y++){
          for (let x = 0; x < copy.length;x++){
            if(copy[x].valgdeltakelse){
              if(copy[x].valgdeltakelse > tmp_high){
                high_index = x;
              }
            }
          }
          topRated.push(copy[high_index]);
          copy.splice(high_index,1);
        }

        var data = [topRated[0], topRated[1], topRated[2],topRated[3],topRated[4]];
        ChartHandler.decidedChart(topRated, bigger);
        
      });
    };
    /**
     * NOT in USE
     * @param  {string} attribute - The attribute to check
     * @param  {string} input - The input value to compare with @param attribute
     * @return {undefined} 
     */
    function byCount(attribute, input) {
      sublayers[0].setSQL("SELECT * FROM statuskart_med_resultater WHERE " + attribute + " >= " + input + "");
      sublayers[0].setCartoCSS(cssyes);
    };
    /**
     * @param  {string} attribute
     * @param  {string} input
     * @return {[undefined]}
     */
    function byName(attribute, input) {

      var result = "";
      var color = "";

      var inputString = "'" + input + "'";
      var mapQuery = "SELECT * FROM statuskart_med_resultater WHERE " + attribute + " ILIKE " + inputString;

      DataHandler.getData("andreasroeed",mapQuery,function(data){
        mapQuery = "SELECT * FROM statuskart_med_resultater WHERE " + attribute + " ILIKE " + inputString;
        var css = data.rows[0].resultat == "ja" ? cssyess : cssno;

        sublayers[0].setSQL(mapQuery);
        sublayers[0].setCartoCSS(css);
      });


    };

    return {
      showTotal: showTotal,
      showResults: showResults,
      byCount: byCount,
      byName: byName
    }

  })();

});