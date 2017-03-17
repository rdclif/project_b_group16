
document.addEventListener('DOMContentLoaded',function(){
    
	document.getElementById('log_in').addEventListener('submit',function(event){
		var payload = {email: null, password: null};

        payload.email = document.getElementById('email').value;
        payload.password = document.getElementById('password').value;
        
        console.log("Email is: " + payload.username + ", Password is: " + payload.password);

        var req = new XMLHttpRequest();
        req.open('POST', '/log_in_check', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                //
                var resObj;
                resObj = JSON.parse(req.response);
                
                console.log(req.response);
                console.log("resObj is: " + resObj.redirect);
                
                if (resObj.redirect == 'invalid'){
                    console.log("Invalid log in attempt!");
                }
                else if (typeof resObj.redirect == 'string'){
                    window.location = resObj.redirect;
                }
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault();
	});		
});


		
