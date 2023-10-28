
const express = require('express');
var cors = require('cors');
const request = require('request');
const OAuthToken = require('./ebay_oauth_token');
const app = express();

const APP_ID = 'Kavyagy-dummy-PRD-572a069ab-48e391f6';
app.use(cors());

app.get('/api/v2.0/findItemsAdvanced', (req, res) => {
    const keyword = req.query.keyword;
    const appid = 'Kavyagy-dummy-PRD-572a069ab-48e391f6';
    const operation_name = 'findItemsAdvanced';
    const buyerPostalCode = req.query.zipCode;
    const miles = req.query.distance;
    const checkboxDetails = JSON.parse(req.query.checkboxDetails);
    const category = req.query.category;
    //todo check category id IF THIS IS PASSED THEN NONe of them itemvalues array  are getting passed

    let url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=${operation_name}&` +
        `SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appid}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${keyword}&paginationInput.entriesPerPage=50
        &outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo&buyerPostalCode=${buyerPostalCode}&itemFilter(0).name=MaxDistance&itemFilter(0).value=${miles}`;

    let i = 1;

    if (checkboxDetails.new || checkboxDetails.used || checkboxDetails.unspecified) {
        url += `&itemFilter(${i}).name=Condition`;
        let j = 0;

        if (checkboxDetails.new) {
            url += `&itemFilter(${i}).value(${j})=New`;
            j++;
        }

        if (checkboxDetails.used) {
            url += `&itemFilter(${i}).value(${j})=Used`;
            j++;
        }

        if (checkboxDetails.unspecified) {
            url += `&itemFilter(${i}).value(${j})=Unspecified`;
            j++;
        }
        i++;
    }

    if (checkboxDetails.freeshipping) {
        url += `&itemFilter(${i}).name=FreeShippingOnly&itemFilter(${i}).value=true`;
        i++;
    }
    if (checkboxDetails.localpickuponly) {
        url += `&itemFilter(${i}).name=LocalPickupOnly&itemFilter(${i}).value=true`;
        i++;
    }

    if(category === "art"){
        url += `&categoryId=550`;
    }else if(category === "baby"){
        url += `&categoryId=2948`;
    }else if(category === "books"){
        url += `&categoryId=267`;
    }else if(category === "clothing"){
        url += `&categoryId=11450`;
    }else if(category === "computers"){
        url += `&categoryId=58058`;
    }else if(category === "music"){
        url += `&categoryId=26395`;
    }else if(category === "video_games"){
        url += `&categoryId=1249`;
    }

    console.log(url);

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(500).send('Error');
        }
    });
});

app.get('/api/v2.0/singleItem', async (req, res) => {
    const appid = 'Kavyagy-dummy-PRD-572a069ab-48e391f6';
    const client_secret = 'PRD-72a069ab2a78-a6fa-4620-b3c7-89f3';
    const item_id = req.query.itemId;
    const oauth_utility = new OAuthToken(appid, client_secret); // Replace with your actual OAuthToken constructor.
    const application_token = await oauth_utility.getApplicationToken();

    let url = `https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=${appid}&` +
        `siteid=0&version=967&ItemID=${item_id}&IncludeSelector=Description,Details,ItemSpecifics`;

    console.log(url);
    const headers = {
        'X-EBAY-API-IAF-TOKEN': application_token,
    };

    request({url, headers}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(500).send('Error');
        }
    });
});


app.get('/api/v2.0/getPostalCode', (req, res) => {
    const startsWith =  req.query.postalCodeStart;
    let url = `http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${startsWith}&maxRows=5&username=kavya24&country=US`;

    console.log(url);

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(500).send('Error');
        }
    });


});


const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${8080}`);
});