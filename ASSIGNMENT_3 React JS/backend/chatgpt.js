const express = require('express');
const axios = require('axios');
const app = express();

const APP_ID = 'ShreyaSa-dummy-PRD-5932e5ad5-579e0f09'; // Replace with your eBay App ID

app.use(express.json());

app.get('/api/v2.0/findItemsAdvanced', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const condition = req.query.condition;
    const shipping = req.query.shipping;
    const distance = req.query.distance;
    const zipcode = req.query.zipcode;

    // Construct the eBay API URL based on the form parameters
    const url = 'https://svcs.ebay.com/services/search/FindingService/v1?' +
      `OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APP_ID}&RESPONSE-DATA-FORMAT=JSON` +
      `&keywords=${encodeURIComponent(keyword)}&paginationInput.entriesPerPage=50` +
      `&itemFilter(0).name=Condition&itemFilter(0).value=${encodeURIComponent(condition)}` +
      `&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=${shipping === 'free' ? 'true' : 'false'}` +
      `&itemFilter(2).name=MaxDistance&itemFilter(2).value=${distance}` +
      `&buyerPostalCode=${zipcode}`;

    // Make the eBay API request
    const response = await axios.get(url);

    // Return the eBay API response data in JSON format
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
