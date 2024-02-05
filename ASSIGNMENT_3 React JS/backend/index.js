// const cors = require('cors');
// const path = require('path');
// const axios = require('axios');
// const dotenv = require('dotenv');
// const express = require('express');
// const geohash = require('ngeohash');
// const utils = require('./utils');


// dotenv.config();
// const app = express();
// const port = parseInt(process.env.PORT) || 8080;

// const axios = require('axios');
// require('dotenv').config();

// const fetchEbayListings = async () => {
//     try {
//         const endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1';
//         const params = {
//             'OPERATION-NAME': 'findItemsByKeywords',
//             'SERVICE-VERSION': '1.0.0',
//             'SECURITY-APPNAME': process.env.EBAY_API_KEY,
//             'RESPONSE-DATA-FORMAT': 'JSON',
//             'REST-PAYLOAD': true,
//             'keywords': 'Apple iPhone 14',
//             // Add other necessary parameters based on the eBay documentation
//         };

//         const response = await axios.get(endpoint, { params });
//         const items = response.data.findItemsByKeywordsResponse[0].searchResult[0].item;

//         // Displaying the items (you can format the output as needed)
//         items.forEach((item) => {
//             console.log('Title:', item.title[0]);
//             console.log('Price:', item.sellingStatus[0].currentPrice[0].__value__ + ' ' + item.sellingStatus[0].currentPrice[0]['@currencyId']);
//             console.log('------------------');
//         });

//     } catch (error) {
//         console.error('Error fetching eBay listings:', error);
//     }
// };

const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const Auth_Token= require('./ebay_oauth_token');