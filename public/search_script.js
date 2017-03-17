function buildSearchResults(arr) {
    var table_parent = document.getElementById("table wrapper");
    var table = document.getElementById('search table');
    table_parent.removeChild(table);

    table = document.createElement("TABLE");
    table.setAttribute("id","search table");
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
    header = document.createElement("th");
    header.textContent = "Photo";
    headerRow.appendChild(header);
    header = document.createElement("th");
    header.textContent = "Reserve";
    headerRow.appendChild(header);
    table.appendChild(headerRow);

    var cell;
    var reserve_button;
    var button_on_off;
    var ID;

    arr.forEach(function (spot) {
        var row = document.createElement("tr");

        for (var p in spot) {
            if(p == "parking_id") {
                ID = spot[p];
            }
            if (p == "availability") {
                cell = document.createElement("td");
                if (spot[p] == 1) {
                    cell.textContent = "Yes";
                    button_on_off = "on";
                } else {
                    cell.textContent = "No";
                    button_on_off = "off";
                }
                row.appendChild(cell);
            }
            else if( p!= "fk_owner_id"){
                if(p == "photo"){
                    cell = document.createElement("td");
                    cell.textContent = "img";
                }
                else{
                    cell = document.createElement("td");
                    cell.textContent = spot[p];
                }

                row.appendChild(cell);
            }
            else{
                reserve_button = document.createElement("td");
                reserve_button = document.createElement("input");
                if(button_on_off == "on") {
                    reserve_button.setAttribute("value", "Reserve");
                    reserve_button.disabled = false;
                }
                else if(button_on_off == "off") {
                    reserve_button.setAttribute("value", "Reserved!!!");
                    reserve_button.disabled = true;
                }

                reserve_button.setAttribute("type","button");
                reserve_button.setAttribute('name', ID);
                reserve_button.setAttribute("method", "post");
                reserve_button.setAttribute('onclick', "doSomething(this);");
                row.appendChild(reserve_button);
            }
        }

        table.appendChild(row);
    });
    table_parent.appendChild(table);
}

function doSomething(object) {
//    var parkingID = object.getAttribute('name');
    object.setAttribute('value', 'Reserved');
    object.disabled = true;

    var payload = {parking_id: null, availability: null};
    payload.parking_id = object.getAttribute('name');

    //   alert("parking id is: " + parkingID);


    var req = new XMLHttpRequest();
    req.open('POST', '/update_avail', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){

        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(JSON.stringify(payload));
    event.preventDefault();
}

document.addEventListener('DOMContentLoaded',function(){

    /*user_id defaults to 1 */
    document.getElementById('search_parking').addEventListener('submit',function(event){
        var payload = {zip: null, city: null, state:null, user_id: null};

        payload.zip = document.getElementById('zip').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;
        payload.user_id = 1;

        var req = new XMLHttpRequest();
        req.open('POST', '/search', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var arr = JSON.parse(req.responseText);
                buildSearchResults(arr);

            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault();
    });
});