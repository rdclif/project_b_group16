document.addEventListener('DOMContentLoaded',function(){
	
	document.getElementById('car_info').addEventListener('submit',function(event){
		var payload = {make: null, model: null, year:null, license:null, car_photo:null};

        payload.make = document.getElementById('make').value;
        payload.model = document.getElementById('model').value;
        payload.year = document.getElementById('year').value;
        payload.license = document.getElementById('license').value;
       
        var req = new XMLHttpRequest();
        req.open('POST', '/add', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault();
	});	
	
	document.getElementById('logout').addEventListener('submit',function(event){
    	var req = new XMLHttpRequest();
        req.open("GET", "/logout", true);
        req.addEventListener('load',function() {
            if(req.status >= 200 && req.status < 400) {
                //no problem
            }
            else{
                console.log("logout error");
            }
        });
	});
	
});
