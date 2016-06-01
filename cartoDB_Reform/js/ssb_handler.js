$(document).ready(function(){
	$.getJSON('http://data.ssb.no/api/v0/dataset/1080.json?lang=no',function(response,status,xhr){

		if(status == "error"){
			console.log("error");
		}else{
			
		}
	});
 });
