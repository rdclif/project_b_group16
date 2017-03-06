document.addEventListener('DOMContentLoaded',function(){
	
	document.getElementById('add_spot').addEventListener('submit',function(event){
		event.preventDefault();
		
		console.log("made it this far");
		
	    var form = document.getElementById('add_form');
	    var formData = new formData(form);
		
		var newReq = new XMLHttpRequest();
		newReq.setRequestHeader('Content-Type', 'application/json');
		newReq.open('POST', '/app.js', true);
		newReq.send(formData);
	});		
});


//put this back in later
//Validate Price http://stackoverflow.com/questions/2227370/currency-validation
/*window.validate = function(value) {
    //var value= $("#field1").val();
    var regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    if (regex.test(value))
    {
        //Input is valid, check the number of decimal places
        var twoDecimalPlaces = /\.\d{2}$/g;
        var oneDecimalPlace = /\.\d{1}$/g;
        var noDecimalPlacesWithDecimal = /\.\d{0}$/g;
        
        if(value.match(twoDecimalPlaces ))
        {
            //all good, return as is
            return value;
            console.log("Value is: " + value);    
        }
        if(value.match(noDecimalPlacesWithDecimal))
        {
            //add two decimal places
            return value+'00';
            console.log("two decimal: " + value); 
        }
        if(value.match(oneDecimalPlace ))
        {
            //ad one decimal place
            return value+'0';
            console.log("one decimal: " + value); 
        }
        //else there is no decimal places and no decimal
        return value+".00";
        console.log("no decimal: " + value); 
    }
    return null;
};
*/

		
		
