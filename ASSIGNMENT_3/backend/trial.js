const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());  // Enable CORS for all routes

const singleItemBaseUrl = "https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=%5BAPPID%5D&siteid=0&version=967&ItemID=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&IncludeSelector=Description,Details,ItemSpecifics";

const condition_dict = {
    "new": 1000,
    "used": 3000,
    "Unspecified":null
};

function ebayfunc() {
    const client_id = "ShreyaSa-dummy-PRD-5932e5ad5-579e0f09";
    const client_secret = "PRD-932e5ad5cb94-f84f-4125-ac8b-c5a2";
    // Note: You'd need to implement the OAuthToken method in Node.js to get the application token.
    // For the purpose of this example, I'm assuming the token is returned directly.
    return "YOUR_TOKEN";
}

app.get('/search', async (req, res) => {
    
    const { keyword, condition} = req.query;
    // const conditions = condition ? JSON.parse(condition) : [];
    // let filter_ctr = 0;

    if (keyword) {
        urlQuery = `&keywords=${keyword}`;
    }
   
    // if (conditions.length > 0) {
    //     searchBaseUrl += `itemFilter(${filter_ctr}).name=Condition&`;
    //     conditions.forEach((condition, idx) => {
    //         searchBaseUrl += `itemFilter(${filter_ctr}).value(${idx})=${condition_dict[condition]}&`;
    //     });
    //     filter_ctr++;
    // }
    
    const headers = {
        "X-EBAY-API-IAF-TOKEN": ebayfunc()
    };

    makeAPICall(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=1${urlQuery}`)
    .then((trueResponse) => {
        // response.json({data: trueResponse});
        console.log(trueResponse);
        response.status(200);
        response.json({ message: trueResponse.data }); //utils.processEventSearchWeb(trueResponse.data)});
    })
    .catch((error) => {
        response.status(400);
        response.json({
            data: "ERROR",
            error: error
        });
    })
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
