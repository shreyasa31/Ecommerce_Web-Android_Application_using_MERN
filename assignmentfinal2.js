document.getElementById("search").addEventListener("click", submit);

function checkRange() {
    var priceInput1 = document.getElementById('price1').value;
    var priceInput2 = document.getElementById('price2').value;
    var price1 = parseFloat(priceInput1); // Remove .value
    var price2 = parseFloat(priceInput2); // Remove .value

    if (price1 < 0 || price2 < 0) { // Change to || to check if either price is negative
        alert("Price Range values cannot be negative!Please try a value greater than or equal to 0.0");
        // document.getElementById('number1').value = ""; // Clear the input field
        // document.getElementById('number2').value = ""; // Clear the input field
        return false;
    }
    else

    if(price2<price1){
        alert("Oops!Lower price limit cannot be greater than upper proce limit!Pleade try again")
        return false;
    }
    return true;
}

// function checkPriceRange() {
//     var priceInput = document.getElementsByClassName("number1");
//     var price = parseFloat(priceInput.value);

//     if (price < 0) {
//         alert("Please enter a positive price value.");
//         priceInput.value = ""; // Clear the input field
//         return false;
//     }
//     return true;
// }

function submit() {
    if (!document.querySelector('form').reportValidity()) {
        return;
    }
    console.log("submit");
    if (checkRange()) {
        var keyword = document.getElementById("keywords").value;
    var price1 = document.getElementById("price1").value;
    var price2 = document.getElementById("price2").value;
    var condition = [];
    if (document.getElementById("new").checked) {
        condition.push("new");
    }
    if (document.getElementById("used").checked) {
        condition.push("used");
    }
    if (document.getElementById("good").checked) {
        condition.push("good");
    }
    if (document.getElementById("very").checked) {
        condition.push("very_good");
    }
    if (document.getElementById("acc").checked) {
        condition.push("acceptable");
    }
    var condition = JSON.stringify(condition);
    var seller=document.getElementById("seller").checked;
    var freeShipping=document.getElementById("free").checked;
    var expeditedShipping=document.getElementById("exp").checked;
    var sortBy = document.getElementById("selection").value;
    // $(".event-search-fail").hide();
    // document.getElementById("event-detail-result").innerHTML = "";
    // document.getElementById("event-search-table-thead").innerHTML = "";
    // document.getElementById("event-search-table-tbody").innerHTML = "";
    $.ajax({
        type:"GET",
        url:`http://127.0.0.1:8080/search/?keyword=${keyword}&minPrice=${price1}&maxPrice=${price2}&condition=${condition}&seller=${seller}&freeShipping=${freeShipping}&expeditedShipping=${expeditedShipping}&sortBy=${sortBy}`,
        async:true,
        dataType: "json",
        success: function(response_data) {
            if(!response_data.data) {
                $(".event-search-fail").show();
            }
            else {
                console.log(data)
                // $('.event-search-table-thead').append(
                //     "<tr>\
                //         <th><div style='min-width: 125px;'>Date</div></th>\
                //         <th><div>Icon</div></th>\
                //         <th class='th-hover th-event'><div>Event</div></th>\
                //         <th class='th-hover th-genre'><div>Genre</div></th>\
                //         <th class='th-hover th-venue'><div>Venue</div></th>\
                //     </tr>"
                // );
                // $.each(response_data, function (_, value) {
                //     value.events.map(event => {
                //         if (event.localDate !== "" || event.localTime !== "" || event.eventID !== "" || event.eventName !== "" || event.segmentGenre[0] !== "" || event.venue[0] !== "") {
                //             var eventIcon = "<td><div style='padding-top: 7px;'>";
                //             if (event.icon.length !== 0 && (event.icon['url'] !== undefined && event.icon['url'] !== "Undefined" && event.icon['url'] !== null && event.icon['url'] !== "")) {
                //                 eventIcon += "<img width='100' height='56' src='";
                //                 eventIcon += event.icon['url'];
                //                 eventIcon += "'></img></div></td>";
                //             }
                //             else {
                //                 eventIcon += "<div style='width: 100px; height: 56px'></div>";
                //             }
                //             var localDateTime = "<td>";
                //             if ((event.localDate === "" && event.localTime === "") || (event.localDate === undefined && event.localTime === undefined) || (event.localDate === "Undefined" && event.localTime === "Undefined")) {
                //                 localDateTime += "<div></div>";
                //             }
                //             else if (event.localDate === "" || event.localDate === undefined || event.localDate === "Undefined") {
                //                 localDateTime += "<div>" + event.localTime + "</div>";
                //             }
                //             else if (event.localTime === "" || event.localTime === undefined || event.localTime === "Undefined") {
                //                 localDateTime += "<div>" + event.localDate + "</div>";
                //             }
                //             else {
                //                 localDateTime += "<div style=margin-bottom:0;>"+event.localDate+"</div><div style=margin-top:0;>"+event.localTime+"</div>";
                //             }
                //             localDateTime += "</td>";
                //             var genre = "<td>";
                //             if (event.segmentGenre[0] === "" || event.segmentGenre[0] === undefined || event.segmentGenre[0] === "Undefined") {
                //                 genre += "<div></div>"
                //             }
                //             else {
                //                 genre += "<div>"+event.segmentGenre[0]+"</div>"
                //             }
                //             genre += "</td>"
                //             var venue = "<td>";
                //             if (event.venue[0] === "" || event.venue[0] === undefined || event.venue[0] === "Undefined") {
                //                 venue += "<div></div>"
                //             }
                //             else {
                //                 venue += "<div>"+event.venue[0]+"</div>"
                //             }
                //             venue += "</td>"
                //             $('.event-search-table-tbody').append(
                //                     "<tr>\
                //                         "+ localDateTime +"\
                //                         "+ eventIcon +"\
                //                         <td><div id='table-event-name'><p id='"+event.eventID+"' onclick='onShowEventDetail(this.id)'>"+event.eventName+"</p></div></td>\
                //                         "+ genre +"\
                //                         "+ venue +"\
                //                     </tr>"
                //                 );
                //             }
                //         }
                //     );
                // });
                // var table = document.getElementById("event-search-table");
                // var tbody = table.querySelector("tbody");
                // var headers = table.querySelectorAll('th');
                // var rows = tbody.querySelectorAll('tr');
                // order = Array.from(headers).map((header) => {return true});
                // [].forEach.call(headers, (header, index) => {
                //     header.addEventListener('click', () => sortTable(index, rows, tbody));
                // });
                // $(".event-search-table").show();
            }
            // $(".event-search-result").show();
        },
        error: function(xhr, status, err) {
            console.log(status);
            console.log(err);
            $(".event-search-fail").show();
        }
    });
    }
}