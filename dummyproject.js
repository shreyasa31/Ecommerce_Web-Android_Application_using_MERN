document.getElementById("submit").addEventListener("click", onSubmit);
document.getElementById("clear").addEventListener("click", onClear);
document.getElementById("auto-location").addEventListener("click", onCheckAutoLocation);
// document.getElementById("keyword").addEventListener("click", onKeywordTextFieldClick);
// document.getElementById("location").addEventListener("click", onLocationTextFieldClick);

const tooltipTraingleHeadHeight = 10; 
var order = null;

window.onload = () => {onCheckAutoLocation();}

function onKeywordTextFieldClick() {
    if (document.getElementById("keyword-tooltip")) {
        $("#keyword-tooltip").fadeOut(200, function(){$("#keyword-tooltip").remove();});
        $("#keyword-tooltip-triangle-head").fadeOut(200, function(){$("#keyword-tooltip-triangle-head").remove();});
    }
}

function onLocationTextFieldClick() {
    if (document.getElementById("location-tooltip")) {
        $("#location-tooltip").fadeOut(200, function(){$("#location-tooltip").remove();});
        $("#location-tooltip-triangle-head").fadeOut(200, function(){$("#location-tooltip-triangle-head").remove();});
    }
}

function showTooltip(element, message) {
    const tooltip = document.createElement("div");
    tooltip.id = `${element.id}-tooltip`;
    tooltip.innerHTML = `<div style="background-color: orange; color: white; width: 1rem; display: inline-block; text-align: center; font-size: 15px; font-weight: bolder; padding: .25rem; margin-right: 0.5rem;">&#33;</div> ${message}`;
    tooltip.style.backgroundColor = "white";
    tooltip.style.color = "black";
    tooltip.style.padding = "10px";
    tooltip.style.position = "absolute";
    tooltip.style.borderRadius = ".25rem";
    tooltip.style.left = `${30 + element.offsetLeft + element.offsetWidth}px`;
    tooltip.style.top = `${30+element.offsetTop+element.offsetHeight+tooltipTraingleHeadHeight}px`;
    const triangle = document.createElement("div");
    triangle.id = `${element.id}-tooltip-triangle-head`;
    triangle.style.width = "0";
    triangle.style.height = "0";
    triangle.style.borderLeft = `${tooltipTraingleHeadHeight}px solid transparent`;
    triangle.style.borderRight = `${tooltipTraingleHeadHeight}px solid transparent`;
    triangle.style.borderBottom = `${tooltipTraingleHeadHeight}px solid white`;
    triangle.style.position = "absolute";
    triangle.style.top = `${30+element.offsetTop+element.offsetHeight}px`;
    triangle.style.left = `${30 + element.offsetLeft + element.offsetWidth + 10}px`;
    document.body.appendChild(tooltip);
    document.body.appendChild(triangle);
}

function sortTable(index, rows, tbody) {
    if ([2, 3, 4].includes(index)) {
        const rowCopies = Array.from(rows);
        const isAscending = order[index] ? 1 : -1
        rowCopies.sort((a, b) => {
            var itemA = null;
            var itemB = null;
            if (index === 2) {
                itemA = a.querySelectorAll('td')[index].querySelector('p').innerHTML;
                itemB = b.querySelectorAll('td')[index].querySelector('p').innerHTML;
            }
            else {
                itemA = a.querySelectorAll('td')[index].innerHTML;
                itemB = b.querySelectorAll('td')[index].innerHTML;
            }
            if (itemA > itemB) {return 1*isAscending;}
            else if (itemA < itemB) {return -1*isAscending;}
            else {return 0;}
        });
        [].forEach.call(rows, (row) => {
            tbody.removeChild(row);
        });
        rowCopies.forEach((row) => {
            tbody.appendChild(row);
        });
        order[index] = !order[index];
    }
}

function submit(latitude="", longitude="") {
    var keyword = document.getElementById("keyword").value;
    if (document.getElementById("distance").value === '' || document.getElementById("distance").value.match(/[a-zA-Z]/i)) {
        var distance = 10;
    }
    else {
        var distance = document.getElementById("distance").value;
    }
    var category = document.getElementById("category").value;
    $(".event-search-fail").hide();
    document.getElementById("event-detail-result").innerHTML = "";
    document.getElementById("event-search-table-thead").innerHTML = "";
    document.getElementById("event-search-table-tbody").innerHTML = "";
    $.ajax({
        type:"GET",
        url:`/event-search/?keyword=${keyword}&distance=${distance}&category=${category}&latitude=${latitude}&longitude=${longitude}`,
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

function onSubmit() {
    if (!document.querySelector('form').reportValidity()) {
        return;
    }
    // Uncomment these lines if you want to use custom tooltip.
    // onKeywordTextFieldClick();
    // onLocationTextFieldClick();
    // if(document.querySelector("#keyword").value === "") {showTooltip(document.querySelector("#keyword"), "Please fill out this field."); return;}
    // if(document.querySelector("#location").value === "" && !document.getElementById("auto-location").checked) {showTooltip(document.querySelector("#location"), "Please fill out this field."); return;}
    if(document.querySelector("#keyword").value === "") {return;}
    if(document.querySelector("#location").value === "" && !document.getElementById("auto-location").checked) {return;}
    if(document.getElementById("auto-location").checked) {
        $.ajax({
            type: "GET",
            url: "https://ipinfo.io/?token=2e0db6b77f6330",
            dataType: "json",
            success: function(response_data) {
                submit(response_data.loc.split(",")[0], response_data.loc.split(",")[1]);
            },
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }
        });
    }
    else {
        $.ajax({
            type: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?address="+document.getElementById("location").value+"&key=AIzaSyD3ObqjWJdtVe0zoyzqnOZzsqXNTGZMyyE",
            dataType: "json",
            success: function(response_data) {
                if (response_data.results.length === 0) {
                    submit();
                }
                else {
                    submit(response_data.results[0].geometry.location.lat, response_data.results[0].geometry.location.lng);
                }
            },
            error: function(xhr, status, err) {
                console.log(status);
                console.log(err);
            }
        });
    }
    
}

function onClear() {
    document.getElementById("keyword").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("category").value = "default";
    document.getElementById("location").value = "";
    document.getElementById("auto-location").checked = false;
    document.getElementById("location").style.display = "block";
    document.getElementById("location").setAttribute("required", "");
    document.getElementById("event-search-table-thead").innerHTML = "";
    document.getElementById("event-search-table-tbody").innerHTML = "";
    document.getElementById("event-detail-result").innerHTML = "";
    document.getElementById("event-search-result").style.display = "none";
    order = null;
}

function onCheckAutoLocation() {
    if(document.getElementById("auto-location").checked) {
        document.getElementById("location").removeAttribute("required");
        document.getElementById("location").style.display = "none";
        onLocationTextFieldClick();
    }
    else {
        document.getElementById("location").style.display = "block";
        document.getElementById("location").setAttribute("required", "");
    }
}

function onShowEventDetail(id) {
    $.ajax({
        type:"GET",
        url:"/event-detail/?event-id="+id,
        async:true,
        dataType: "json",
        success: function(response_data) {
            document.getElementById("event-detail-result").innerHTML = "";
            var eventDetailCol = "<div>";
            if (response_data.data.localDate) {
                if ((response_data.data.localDate === "" && response_data.data.localTime === "") || (response_data.data.localDate === undefined && response_data.data.localTime === undefined) || (response_data.data.localDate === "Undefined" && response_data.data.localTime === "Undefined")) {
                    localDateTime = "";
                }
                else if (response_data.data.localDate === "" || response_data.data.localDate === undefined || response_data.data.localDate === "Undefined") {
                    localDateTime = response_data.data.localTime;
                }
                else if (response_data.data.localTime === "" || response_data.data.localTime === undefined || response_data.data.localTime === "Undefined") {
                    localDateTime = response_data.data.localDate;
                }
                else {
                    localDateTime = response_data.data.localDate + " " + response_data.data.localTime;
                }
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Date</h2>\
                    <p>"+ localDateTime +"</p>\
                </div>";
            }
            if (response_data.data.artistTeam.length !== 0) {
                var artistTeamBody = "<p class='event-result-card-body-artist-team'>";
                for (var i = 0; i < response_data.data.artistTeam.length; i++) {
                    if (response_data.data.artistTeam[i]["url"] !== "") {
                        artistTeamBody += "<a class='event-result-card-body-artist-team-a' href='"+ response_data.data.artistTeam[i]["url"] +"' target=_blank>"+ response_data.data.artistTeam[i]["name"] +"</a>"
                    }
                    else {
                        artistTeamBody += "<a class='event-result-card-body-artist-team-a event-result-card-body-artist-team-a-no-hover'>"+ response_data.data.artistTeam[i]["name"] +"</a>"
                    }
                    if (i !== response_data.data.artistTeam.length-1) {
                        artistTeamBody += " | "
                    }
                }
                artistTeamBody += "</p>"
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Artist/Team</h2>\
                    <p>"+artistTeamBody+"</p>\
                </div>";
            }
            if (response_data.data.venue && (response_data.data.venue[0] !== "Undefined" && response_data.data.venue[0] !== undefined && response_data.data.venue[0] !== "")) {
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Venue</h2>\
                    <p>"+response_data.data.venue[0]+"</p>\
                </div>";
            }
            if (response_data.data.genre && (response_data.data.genre[0] !== "Undefined" && response_data.data.genre[0] !== undefined && response_data.data.genre[0] !== "")) {
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Genres</h2>\
                    <p>"+response_data.data.genre[0]+"</p>\
                </div>";
            }
            if (response_data.data.priceRanges && (response_data.data.priceRanges[0] !== "Undefined" && response_data.data.priceRanges[0] !== undefined && response_data.data.priceRanges[0] !== "")) {
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Price Ranges</h2>\
                    <p>"+response_data.data.priceRanges[0]+"</p>\
                </div>";
            }
            if (response_data.data.ticketStatus && (response_data.data.ticketStatus["code"] !== "Undefined")) {
                eventDetailCol += "<div class='event-result-card-body-point'>\
                    <h2>Ticket Status</h2>\
                    <div style='background-color: "+ response_data.data.ticketStatus["color"] +"; width: fit-content; padding: 0.25rem; border-radius: 0.25rem;'>\
                        <p>"+response_data.data.ticketStatus["code"]+"</p>\
                    </div>\
                </div>";
            }
            if (response_data.data.byTicketAt && (response_data.data.byTicketAt !== undefined && response_data.data.byTicketAt !== "Undefined")) {
                eventDetailCol += "<div class='event-result-card-body-point event-result-card-body-point-by-ticket'>\
                    <h2>By Ticket At:</h2>\
                    <a href='"+response_data.data.byTicketAt+"' target='_blank'>Ticketmaster</a>\
                </div>";
            }
            eventDetailCol += "</div>";
            var eventDetailSeatmapCol = "<div>"
            if (response_data.data.seatmap) {
                eventDetailSeatmapCol += "<div class='event-detail-seatmap-img'>\
                    <img src='"+response_data.data.seatmap+"'>\
                </div>";
            }
            else {
                eventDetailSeatmapCol += "<div>\
                </div>";
            }
            eventDetailSeatmapCol += "</div>";
            $('.event-detail-result').append(
                "<div class='event-result-card'>\
                    <h1>"+response_data.data.eventName+"</h1>\
                    <div class='event-result-card-body'>\
                        "+eventDetailCol+"\
                        "+eventDetailSeatmapCol+"\
                    </div>\
                </div>\
                <div id='show-venue-detail' class='show-venue-detail'>\
                    <p class='venue-raw-heading'>Show Venue Details</p>\
                    <div id='or-symbol-div' class='or-symbol-div'>\
                        <div class='v-div' onclick='onShowVenueDetail(\""+response_data.data.venue[0]+"\")'></div>\
                    </div>\
                </div>"
            );
            $(".event-detail-result").show();
            document.getElementById("event-detail-result").scrollIntoView({behavior: 'smooth'});
        },
        error: function(xhr, status, err) {
            console.log(status);
            console.log(err);
        }
    });
}

function onShowVenueDetail(keyword) {
    $.ajax({
        type:"GET",
        url:"/venue-detail/?keyword="+keyword,
        async:true,
        dataType: "json", 
        success: function(response_data) {
            document.getElementById("show-venue-detail").innerHTML = "";
            var image = null;
            if (response_data.data.image.length !== 0) {
                if (response_data.data.image[0] && response_data.data.image[0] !== "Undefined" && response_data.data.image[0] !== undefined && response_data.data.image[0] !== "") {
                    image = response_data.data.image[0];
                }
            }
            if (image) {
                image = "<div style='padding-bottom: 1.5rem;'><img width='150' height='75' src='"+image+"'></img></div>";
            }
            else {
                image = "<div></div>";
            }
            var venue = null;
            if (response_data.data.venue) {
                if (response_data.data.venue[0] !== undefined && response_data.data.venue[0] !== "Undefined" && response_data.data.venue[0] !== "") {
                    venue = response_data.data.venue[0];
                }
                else {
                    venue = "";
                }
            }
            else {
                venue = "";
            }
            var address = null;
            if (response_data.data.address) {
                if (response_data.data.address[0] !== undefined && response_data.data.address[0] !== "Undefined" && response_data.data.address[0] !== "") {
                    address = response_data.data.address[0];
                }
                else {
                    address = "";
                }
            }
            else {
                address = "";
            }
            var city = null;
            if (response_data.data.city) {
                if (response_data.data.city[0] !== undefined && response_data.data.city[0] !== "Undefined" && response_data.data.city[0] !== "") {
                    city = response_data.data.city[0];
                }
                else {
                    city = "";
                }
            }
            else {
                city = "";
            }
            var state = null;
            if (response_data.data.state) {
                if (response_data.data.state[0] !== undefined && response_data.data.state[0] !== "Undefined" && response_data.data.state[0] !== "") {
                    state = response_data.data.state[0];
                }
                else {
                    state = "";
                }
            }
            else {
                state = "";
            }
            var postalCode = null;
            if (response_data.data.postalCode) {
                if (response_data.data.postalCode[0] !== undefined && response_data.data.postalCode[0] !== "Undefined" && response_data.data.postalCode[0] !== "") {
                    postalCode = response_data.data.postalCode[0];
                }
                else {
                    postalCode = "";
                }
            }
            else {
                postalCode = "";
            }
            var upcomingEvents = null;
            var upcomingEventsHTML = null;
            if (response_data.data.upcomingEvents) {
                if (response_data.data.upcomingEvents[0] !== undefined && response_data.data.upcomingEvents[0] !== "Undefined" && response_data.data.upcomingEvents[0] !== "") {
                    upcomingEvents = response_data.data.upcomingEvents[0];
                    upcomingEventsHTML = "<a href='"+upcomingEvents+"' class='more-detail-a' target='_blank'>More events at this venue</a>"
                }
                else {
                    upcomingEventsHTML = "<a href='javascript: void(0)' class='more-detail-a' target='_blank'>More events at this venue</a>"
                }
            }
            else {
                upcomingEventsHTML = "<p class='more-detail-a' style='color: #3597a7; margin:0'>More events at this venue</p>"
            }
            $('.show-venue-detail').append(
                "<div class='show-venue-detail-body'>\
                    <div class='show-venue-detail-inner-body'>\
                        <h1><div class='show-venue-detail-inner-body-header'>"+venue+"</div></h1>\
                        "+ image +"\
                        <div class='show-venue-detail-body-col'>\
                            <div class='show-venue-detail-body-col-left'>\
                                <div class='show-venue-detail-body-col-left-col'>\
                                    <div class='show-venue-detail-body-col-left-col-left'>\
                                        <p>Address: </p>\
                                    </div>\
                                    <div class='show-venue-detail-body-col-left-col-right'>\
                                        <p>"+address+"</p><p>"+city+", "+state+"</p><p>"+postalCode+"</p>\
                                    </div>\
                                </div>\
                                <div class='show-venue-detail-body-full-span'>\
                                    <p class='show-venue-detail-body-google-maps-p' id='show-venue-detail-body-google-maps-p' onclick='openGoogleMaps(\""+venue+"\", \""+address+"\", \""+city+"\", \""+state+"\", \""+postalCode+"\")'>Open in Google maps</p>\
                                </div>\
                            </div>\
                            <div class='show-venue-detail-body-col-right'>\
                                "+ upcomingEventsHTML +"\
                            </div>\
                        </div>\
                    </div>\
                </div>"
            );
            document.getElementById("show-venue-detail").scrollIntoView({behavior: 'smooth'});
        },
        error: function(xhr, status, err) {
            console.log(status);
            console.log(err);
        }
    });
}

function openGoogleMaps(venue, address, city, state, zipCode) {
    var query = `${venue}, ${address}, ${city}, ${state}, ${zipCode}`;
    var url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.replace(/\s/g, '+'))}`;
    window.open(url);
}