$(document).ready(function() {

    function numberCompareAscending(a, b) {
        return a > b ? 1 : a == b ? 0 : -1;
    }

    function numberCompareDescending(a, b) {
        return a < b ? 1 : a == b ? 0 : -1;
    }

    function showLoader(){
        $(".loader").show();
    }

    function hideLoader(){
        $(".loader").hide();

    }


    // var columnTitles = ["Knr", "Kommune", "Folketall", "Barnehage", "Grunnskole", "25_66_år", "Sysselsatte", "Eldre", "Driftsresultat", "Lånegjeld", "Disp.fond", "Kostnadsnivå", "Inntektsnivå"];
    var columns = ["Knr", "Kommune", "Folketall", "Grunnskole", "Eldre", "Driftsresultat", "Disp.fond", "Kostnadsnivå"];
    //0 for ascending, 1 for descending. 
    var sortingOrder = 0;


    $('input[type=radio][name=sorting]').change(function() {
        if (this.value == 'ascending') {
            sortingOrder = 0;

        } else if (this.value == 'descending') {
            sortingOrder = 1;
        }
    });

    showLoader();

    d3.json("https://api.myjson.com/bins/5bxz4", function(error, data) {
        if (error) throw error;

        hideLoader();
    // var parsedRows = d3.jsonParse(jsonData);
    // function tabulate(data, columns) {
        var counter = 0;
        var table = d3.select('div#data-table').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody');

        thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(column) {
            return column
        });

        var rows = tbody.selectAll("tr").data(data).enter().append('tr').attr('data-id',function(row){
            return row["Knr"];
        }).attr('data-name',function(row){
            return row["Kommune"];
        }).on('click',function(row){
            //Fetch info for this.
            var id = this.dataset.id;
            populateModal(id,row);
        });


        css = "";
        var cells = rows.selectAll('td').data(function(row) {
            counter++;
            return columns.map(function(column) {

                if (typeof(row[column]) == "string" || (row[column] >= 100)) {
                    counter % 2 == 0 ? cssClass = "stringSkip" : cssClass = "string";
                }
                //More values are above 3, so this checks will go slightly faster than the reversed order
                else if (row[column] >= 6) {
                    cssClass = "six";
                } else if (row[column] >= 5) {
                    cssClass = "five";
                } else if (row[column] >= 4) {
                    cssClass = "four";
                } else if (row[column] >= 3) {
                    cssClass = "three";
                } else if (row[column] >= 2) {
                    cssClass = "two";
                } else if (row[column] >= 1) {
                    cssClass = "one";
                }

                //cssClass will loose its effect when sorting, due to the fact that the class is bound to the data-object.
                return {
                    column: column,
                    value: row[column],
                    cssClass: cssClass
                };
            });

        }).enter().append('td').attr('class', function(d) {
            return d.cssClass;
        }).text(function(d) {
            return d.value
        });

        d3.selectAll("thead th").data(data).on("click", function(k) {
            var key = this.innerText;

            rows.sort(function(a, b) {
                if (sortingOrder > 0) {
                    return numberCompareDescending(a[key], b[key]);
                }
                return numberCompareAscending(a[key], b[key]);
            });

        });
    // }

});

    //Opens modal popup and adds textual info
    function populateModal(id,data){

        $(".modal-body").html(id);
        $(".modal-title").html(data["Kommune"]);
        $("#myModal").modal();

    }

    //TODO: Either send all data from mysjon.com, or load one big file
    // tabulate(jsonData, columnTitles);

});
