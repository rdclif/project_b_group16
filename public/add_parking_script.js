
function buildSubmittedSpots() {

    var table_parent = document.getElementById("table wrapper");
    var table = document.getElementById('submitted spots');
    table_parent.removeChild(table);

    table = document.createElement("TABLE");
    table.setAttribute("id","submitted spots");
    var headerRow = document.createElement("tr");
    var header;

    //create header row
    header = document.createElement("th");
    header.textContent = "Parking_id";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "Address";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "City";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "State";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "Zip";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "Availability";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "Price";
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    var req = new XMLHttpRequest();
    req.open("GET", "/getSubmittedSpots", true);
    req.addEventListener('load',function() {
        if(req.status >= 200 && req.status < 400) {
            var arr = JSON.parse(req.responseText);

            arr.forEach(function (spot) {
                var row = document.createElement("tr");
                var cell;

                for (var p in spot) {
                    if (p == "availability") {
                        cell = document.createElement("td");
                        if (spot[p] == 1) {
                            cell.textContent = "Yes";
                        } else {
                            cell.textContent = "No";
                        }
                        row.appendChild(cell);
                    }
                    else if (p != "photo" && p != "fk_owner_id") {
                        cell = document.createElement("td");
                        cell.textContent = spot[p];
                        row.appendChild(cell);
                    }
                }
                table.appendChild(row);
            });
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(null);
    table_parent.appendChild(table);
}

document.addEventListener('DOMContentLoaded',function(){
    
    buildSubmittedSpots();
	
	document.getElementById('add_spot').addEventListener('submit',function(event){
		var payload = {address: null, city: null, state:null, zip:null,availability:null, price:null};

        payload.address = document.getElementById('address').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;
        payload.zip = document.getElementById('zip').value;
        payload.availability = document.getElementById('availability').value;
        payload.price = document.getElementById('price').value;
    

        var req = new XMLHttpRequest();
        req.open('POST', '/insert', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                buildSubmittedSpots();
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

		
		
