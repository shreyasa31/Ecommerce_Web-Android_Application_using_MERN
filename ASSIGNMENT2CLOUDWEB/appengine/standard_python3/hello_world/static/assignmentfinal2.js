document.getElementById("search").addEventListener("click", submit);
// document.getElementById("clear").addEventListener("click", clear);
document.getElementById("clear").addEventListener("click", function(event){
    clear(event);
});

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
function clear(event){
    event.preventDefault();
    
    document.getElementById("search-result-list").innerHTML = "";
    document.getElementById("search-result-list-more").innerHTML = "";
    console.log(document.getElementById("search-result-list-more-toggle"))
    if (document.getElementById("search-result-list-more-toggle") !== null) {
        document.getElementById("search-result-list-more-toggle").remove();
    }
    document.getElementById("search-result-detail").innerHTML = "";
    document.getElementById("keywords").value = "";
    // document.getElementById("keywords").blur();
    document.getElementById("price1").value = "";
    document.getElementById("price2").value = "";
    document.getElementById("new").checked = false;
    document.getElementById("used").checked = false;
    document.getElementById("good").checked = false;
    document.getElementById("very").checked = false;
    document.getElementById("acc").checked = false;
    document.getElementById("seller").checked = false;
    document.getElementById("free").checked = false;
    document.getElementById("exp").checked = false;
    document.getElementById("selection").value = "BestMatch";
}

function showMore() {
    if (document.getElementById("search-result-list-more").style.display === "none") {
        document.getElementById("search-result-list-more").style.display = "block";
        document.getElementById("show-more-button").innerHTML = "Show Less";
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
    else {
        document.getElementById("search-result-list-more").style.display = "none";
        document.getElementById("show-more-button").innerHTML = "Show More";
    }
}

function submit() {
    if (!document.querySelector('form').reportValidity()) {
        return;
    }
    if (checkRange()) {
    document.getElementById("search-result-list").innerHTML = "";
    document.getElementById("search-result-list-more").innerHTML = "";
    console.log(document.getElementById("search-result-list-more-toggle"))
    if (document.getElementById("search-result-list-more-toggle") !== null) {
        document.getElementById("search-result-list-more-toggle").remove();
    }

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

    // Assuming you have fetched search results in 'searchResults' (an array of objects)

/// Assuming you have fetched search results in 'searchResults' (an array of objects)

// Function to create and populate cards
// function createSearchResultCards(data) {
//     const searchResultContainer = document.getElementById("search-result");

//     // Clear previous search results
//     searchResultContainer.innerHTML = "";

//     data.forEach((result) => {
//         const card = document.createElement("div");
//         card.classList.add("card");
//         card.innerHTML = `
//             <h2>${result.title}</h2>
//             <p>${result.description}</p>
//             <!-- Add more elements here based on your data -->
//         `;
//         searchResultContainer.appendChild(card);
//     });

//     // Check if there are no search results and display a message if needed
//     if (data.length === 0) {
//         const searchFailDiv = document.getElementById("search-fail");
//         searchFailDiv.innerHTML = "<p>No Results found</p>";
//     } else {
//         const searchFailDiv = document.getElementById("search-fail");
//         searchFailDiv.innerHTML = ""; // Clear any previous "No Results found" message
//     }
// }

// Call the function to create search result cards with your data
// Example usage:
// createSearchResultCards(searchResults);


    $.ajax({
        type:"GET",
        url:`/search?keyword=${keyword}&minPrice=${price1}&maxPrice=${price2}&condition=${condition}&seller=${seller}&freeShipping=${freeShipping}&expeditedShipping=${expeditedShipping}&sortBy=${sortBy}`,
        async:true,
        dataType: "json",
        success: function(response_data) {
            console.log(response_data);
            document.getElementById("search-result-list-more").style.display = "none";

            if (response_data["items"].length === 0) {
                $(".search-result-list").append(
                    `<div class="search-result-not-found">
                        <h3>No Results found</h3>
                    </div>`
                )
            }
            else {
                pageCount = "0";
            if (response_data["pagination"] !== undefined) {
                if (response_data["pagination"].length > 0) {
                    if (response_data["pagination"][0]["totalEntries"] !== undefined) {
                        pageCount = response_data["pagination"][0]["totalEntries"];
                    }
                }
            }
            $(".search-result-list").append(
                `<div class="search-result-page-count">
                    <h3>${pageCount} Results found for <i> ${keyword}</i></h3>
                </div><hr>`
            )


            response_data["items"].forEach(function(item, index) {
                var title = "";
                if (item["title"] !== undefined && item["title"] !== null) {
                    title = `<strong id="titlecard">${item["title"]}</strong>`
                }
                var categoryName = "";
                if (item["categoryName"] !== undefined && item["categoryName"] !== null) {
                    categoryName = `<p id="categorycss">Category: <i>${item["categoryName"]}</i></p>`
                } 
                var viewItemURL = ""; 
                if (item["viewItemURL"] !== undefined && item["viewItemURL"] !== null) {
                    viewItemURL = `<a id="urlcss" href="${item["viewItemURL"]}" target="_blank" onclick='aClick(event)'><img src="/static/redirect.png" width="20px" height="20px" alt="error"></a>`
                }
                var condition = "";
                if (item["condition"] !== undefined && item["condition"] !== null) {
                    condition = `<p>Condition: ${item["condition"]}`
                }
                var topRatedListing = "false";
                if (item["topRatedListing"] !== undefined && item["topRatedListing"] !== null) {
                    topRatedListing = item["topRatedListing"]
                }
                if (topRatedListing === "true") {
                    condition += `<img src="/static/topRatedImage.png" width="20px" height="20px" alt="error"></p>`
                }
                else {
                    condition += "</p>"
                }
                var price = "";
                if (item["price"] !== undefined && item["price"] !== null) {
                    price = `<p><strong>Price: ${item["price"]}</strong></p>`
                } 
                var img = "";
                if (item["price"] !== undefined && item["img"] !== null) {
                    img = `<img  src="${item["galleryURL"]}" alt="image">`
                }
                else {
                    img = `<img src="/static/ebay_default.jpg" alt="image" height=75px wdth=100px>`
                }
                //
                if (index >=3 ) {
                    $(".search-result-list-more").append(
                        `<div>
                            <div class="search-result-item" id="${item["itemId"]}" onclick='onItemClick(this.id)'>
                                <div class="search-result-item-image">
                                    ${img}
                                </div>
                                <div class="search-result-item-info">
                                    <div class="search-result-item-info-title">
                                        ${title}
                                    </div>
                                    <div class="search-result-item-info-category">
                                        ${categoryName}
                                        ${viewItemURL}
                                    </div>
                                    <div class="search-result-item-info-condition">
                                        ${condition}
                                    </div>
                                    <div class="search-result-item-info-price">
                                        ${price}
                                    </div>
                                </div>
                            </div>
                        </div>`
                    )
                }
                else {
                $(".search-result-list").append(
                    `<div>
                        <div class="search-result-item" id="${item["itemId"]}" onclick='onItemClick(this.id)'>
                            <div class="search-result-item-image">
                                ${img}
                            </div>
                            <div class="search-result-item-info">
                                <div class="search-result-item-info-title">
                                    ${title}
                                </div>
                                <div class="search-result-item-info-category">
                                    ${categoryName}
                                    ${viewItemURL}
                                </div>
                                <div class="search-result-item-info-condition">
                                    ${condition}
                                </div>
                                <div class="search-result-item-info-price">
                                    ${price}
                                </div>
                            </div>
                        </div>
                    </div>`
                )}
            });

            $('.search-result-body').append(
                `<div class="search-result-list-more-toggle" id="search-result-list-more-toggle">
                    <button id="show-more-button" onclick='showMore()'>Show More</button>
                </div>`
            )
            }

            
            // createSearchResultCards(response_data);
            // if(!response_data.data) {
            //     $(".event-search-fail").show();
            // }
            // else {
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
            // }
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

function backToResult() {
    document.getElementById("search-result-body").style.display = "block";
    document.getElementById("search-result-list-more").style.display = "none";
    document.getElementById("show-more-button").innerHTML = "Show More";
    document.getElementById("search-result-detail").innerHTML = "";
}

function aClick(event) {
    event.stopPropagation();
}

function onItemClick(id) {
    $.ajax({
        type: "GET",
        url: "/getItem?ItemID=" + id,
        async: true,
        dataType: "json",
        success: function(response_data) {
            console.log(response_data)
            document.getElementById("search-result-body").style.display = "none";
            var img = "";
            if (response_data["photo"] !== undefined && response_data["photo"] !== null) {
                img = `
                <tr>
                <td><strong>Photo</strong></td>
                <td><img src="${response_data["photo"]}" alt="image"  height=200px ></td>
                </tr>
                `
            }
            var ebayLink = "";
            if (response_data["ebayLink"] !== undefined && response_data["ebayLink"] !== null) {
                ebayLink = `
                <tr>
                        <td><strong>eBay Link</strong></td>
                        <td><a href="${response_data["ebayLink"]}">ebay Product Link</a></td>
                    </tr>
                `
            }
            var title = "";
            if (response_data["title"] !== undefined && response_data["title"] !== null) {
                title = `
                <tr>
                        <td><strong id="titlecard">Title</strong></td>
                        <td>${response_data["title"]}</td>
                    </tr>
                `
            }
            var price = "";
            if (response_data["price"] !== undefined && response_data["price"] !== null) {
                price = `
                <tr>
                        <td><strong>Price</strong></td>
                        <td>${response_data["price"]}</td>
                    </tr>
                `
            }
            var location = "";
            var locationHtml = "";
            if (response_data["location"] !== undefined && response_data["location"] !== null) {
                location = `${response_data["location"]}`
            }
            if (response_data["postalCode"] !== undefined && response_data["postalCode"] !== null) {
                location = location + `, ${response_data["postalCode"]}`
            }
            if (location !== "") {
                locationHtml = `
                <tr>
                        <td><strong>Location</strong></td>
                        <td>${location}</td>
                </tr>
                `
            }
            var seller = "";
            if (response_data["seller"] !== undefined && response_data["seller"] !== null) {
                seller = `
                <tr>
                        <td><strong>Seller</strong></td>
                        <td>${response_data["seller"]}</td>
                    </tr>
                `
            }
            var returnPolicy = "";
            if (response_data["returnPolicy"] !== undefined && response_data["returnPolicy"] !== null) {
                returnPolicy = `
                <tr>
                        <td><strong>Return Policy(US)</strong></td>
                        <td>${response_data["returnPolicy"]}</td>
                    </tr>
                `
            }

            var itemSpecifics = "";
            if (response_data["itemSpecifics"] !== undefined && response_data["itemSpecifics"] !== null) {
                response_data["itemSpecifics"].forEach(function(item, index) {
                    itemSpecifics += `<tr>
                                        <td><strong>${item["name"]}</strong></td>
                                        <td>${item["value"]}</td>
                                    </tr>`
                });
            }
            $(".search-result-detail").append(
                `
                <div><h1 id="ItemDetails">Item Details</h1></div>
                <div id="searchbutton">
                <button id="backToSearchResults" onclick='backToResult()'>Back to search results</button>
                <table class="item-detail-table"></div>
                <div>
                    ${img}
                    ${ebayLink}
                    ${title}
                    ${price}
                    ${locationHtml}
                    ${seller}
                    ${returnPolicy}
                    ${itemSpecifics}
                    </table>
                </div>`
            )
        },
        error: function(xhr, status, err) {
            console.log(status);
            console.log(err);
            $(".event-search-fail").show();
        }
    })
}