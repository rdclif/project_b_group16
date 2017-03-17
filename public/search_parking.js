
document.addEventListener('DOMContentLoaded',function(){
    
	document.getElementById('search_parking').addEventListener('submit',function(event){
		var payload = {zip_code: null, city: null, state: null};

        payload.zip_code = document.getElementById('zip').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;


        var req = new XMLHttpRequest();
        req.open('POST', '/search', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                //
                var resObj;
                resObj = JSON.parse(req.response);
                
                console.log(req.response);
                console.log("resObj is: " + resObj.redirect);
                

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


		
