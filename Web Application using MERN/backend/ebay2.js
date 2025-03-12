const express = require('express');
const axios = require('axios');
const cors= require('cors');
const app = express();
const PORT = 8080;



async function makeAPICall(url) {
    return await axios.get(url, defaultOptions);
}

app.use(cors());
// app.use(express.static(buildPath));

app.get('/', (req, res) => res.sendFile(buildPath + "/index.html" ));
app.get("/search", (request, response) => {
    urlQuery = `&keyword=${request.query.keyword}&condition=${request.query.condition}&shipping=${request.query.shipping}`;
    if(request.query.distance || request.query.distance === "") {
        urlQuery += `&distance=${request.query.radius}`;
    }
    else {
        urlQuery += `&distance=10`;
    }
    if(request.query.category !== "default") {
        urlQuery += `&segmentId=${EbayCategory_SEGMENT_ID[request.query.category]}`;
    }
    // urlQuery += `&geoPoint=${geohash.encode(parseFloat(request.query.lat), parseFloat(request.query.lng))}`;
    makeAPICall(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50${urlQuery}`)
    .then((trueResponse) => {
        response.status(trueResponse.status);
        response.json({data: utils.processEventSearchWeb(trueResponse.data)});
    })
    .catch((error) => {
        response.status(400);
        response.json({
            data: "ERROR",
            error: error
        });
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=VishalVe-prodsc12-PRD-a0eed1ece-c051b032&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&keywords=iphone&buyerPostalCode=90007&itemFilter(0).name=MaxDistance&itemFilter(0).value=10&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=true&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=true&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecified&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo