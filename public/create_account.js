
document.addEventListener('DOMContentLoaded',function(){
    
	document.getElementById('create_account').addEventListener('submit',function(event){
		var payload = {first_name: null, last_name: null, email: null, password: null};

        payload.first_name = document.getElementById('first_name').value;
        payload.last_name = document.getElementById('last_name').value;
        payload.user_id = document.getElementById('user_id').value;
        payload.email = document.getElementById('email').value;
        payload.password = document.getElementById('password').value;

        var req = new XMLHttpRequest();
        req.open('POST', '/create_account_check', true);
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


		
