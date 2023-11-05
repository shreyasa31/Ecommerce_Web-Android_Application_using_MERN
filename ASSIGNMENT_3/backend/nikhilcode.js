const cors = require('cors');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const request = require('request');
const express = require('express');
// const geohash = require('ngeohash');
const utils = require('./utils');
const OAuthToken=require('./ebay_oauth_token')
const connectDB=require('./database/dbConnect')
const Wishlist=require('./models/wishlistModel')
dotenv.config();
connectDB();
const app = express();
const port = parseInt(process.env.PORT) || 8080;
// const buildPath = path.join(__dirname, "./build");
// const buildPath = path.join(__dirname, "../ticket_master_frontend/build");
const defaultOptions = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EBAY_API_ID}`
    }
};



const categoryId={
  "Art":550,
  "Baby":2948,
  "Books":267,
  "Clothing":11450,
  "Computers":58058,
  "Health&Beauty":26395,
  "Music":26395,
  "VideoGames":1249

}


const condition_dict={
    "New":1000,
    "Used":3000,
    "Unspecified":0
  
  }
  


async function makeAPICall(url) {
    return await axios.get(url, defaultOptions);
}

app.use(cors());
// app.use(express.static(buildPath));

// app.get('/', (req, res) => res.sendFile(buildPath + "/index.html" ));

async function ebayfunc() {
    const appid ='ShreyaSa-dummy-PRD-5932e5ad5-579e0f09';
    const client_secret ='PRD-932e5ad5cb94-f84f-4125-ac8b-c5a2';
    const oauth_utility = new OAuthToken(appid, client_secret); 
    return await oauth_utility.getApplicationToken();
}

app.get("/search", (request, response) => {
    // console.log(request.query);
    const keyword = request.query.keyword;
    if (!keyword) {
        return response.status(400).json({ error: 'Keyword is required.' });
    }
    urlQuery = `&keywords=${keyword}`;
     //keyword
    if(request.query.category && request.query.category !== "All Categories") {  
       urlQuery += `&categoryId=${categoryId[request.query.category]}`//category
   }
  

   
    
urlQuery +=`&buyerPostalCode=${request.query.buyerPostalCode|| ''}` //postalcode

let defaultdistance=10;
if(request.query.distance || request.query.distance === "") { //distance
            urlQuery += `&itemFilter(0).name=MaxDistance&itemFilter(0).value=${request.query.distance}`;
        }
        else {
            urlQuery += `&itemFilter(0).name=MaxDistance&itemFilter(0).value=${defaultdistance}`;
        }

    
let i=1;
if (request.query.condition && request.query.condition !== " ") { //condition
    urlQuery += `&itemFilter(${i}).name=Condition`;
    let conditions = request.query.condition.split(',');  // Splitting the condition parameter
    let j = 0;

    conditions.forEach(condition => {
        if (["New", "Used"].includes(condition)) { //here unspecified is not passed
            urlQuery += `&itemFilter(${i}).value(${j})=${condition_dict[condition]}`;
            j++;
        }
    });

    i++;
}

//shipping
if (request.query.freeshipping) {
    urlQuery += `&itemFilter(${i}).name=FreeShippingOnly&itemFilter(${i}).value=true`;
    i++;
}
if (request.query.localpickuponly) {
    urlQuery += `&itemFilter(${i}).name=LocalPickupOnly&itemFilter(${i}).value=true`;
    i++;
}




    
  
    // urlQuery += `&geoPoint=${geohash.encode(parseFloat(request.query.lat), parseFloat(request.query.lng))}`;
    makeAPICall(`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=50${urlQuery}&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo`)
    .then((trueResponse) => {
        // response.json({data: trueResponse});
        console.log(trueResponse);
        response.status(200);
        // response.json({ message: trueResponse.data }); //utils.processEventSearchWeb(trueResponse.data)});
         response.json({ message:  utils.processSearchData(trueResponse.data)});
    })
    .catch((error) => {
        response.status(400);
        response.json({
            data: "ERROR",
            error: error
        });
    })
});
// const token = ebayfunc();
// console.log('Fetched Token:', token);
// console.log("***********************************************")
app.get('/getItem', async (req, res) => {
    
    console.log("i am here");
    let getItemBaseUrl = "https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&siteid=0&version=967&IncludeSelector=Description,Details,ItemSpecifics";
    const itemID = req.query.ItemID || "335007021375";
    if (itemID) {
        getItemBaseUrl += `&ItemID=${itemID}`;
    }
    console.log(getItemBaseUrl);
 
    const headers = {
       
        "X-EBAY-API-IAF-TOKEN": await ebayfunc()
    };



    request({url:getItemBaseUrl, headers}, (error, response, body) => {
        
        if (!error && response.statusCode === 200) {
            // res.json(JSON.parse(body));
            const parsedBody = JSON.parse(body);
        const processedItem = utils.processItemDetailData(parsedBody);
        res.json(processedItem);
        } else {
            res.status(500).send('Error');
        }
    });
});



app.get('/getPostalCode', (req, res) => {
    const postalstart = req.query.postalstart;
    const username = 'shreya31'; 
    const country = 'US';

    const apiUrl = `http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${postalstart}&maxRows=5&username=${username}&country=${country}`;

    console.log(apiUrl);

    request(apiUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(500).send('Error');
        }
    });
});

app.get('/addToWishlist', async (req, res) => {
    console.log("backend wl");
    console.log(req.query.ItemID);
    console.log(req.query.image);
    console.log(req.query.title);
    console.log(req.query.price);
    console.log(req.query.shipping);
    try { 
    const itemExists = await Wishlist.findOne({
        'items.productId': req.query.ItemID // Assuming ItemID is unique for each product
    });
    
    if (itemExists) {
        // The item already exists in the wishlist, handle accordingly
        console.log('Item already in wishlist.'); // 409 Conflict
    } else{
        const wishlistAdd = new Wishlist({
            items: [{
                productId: req.query.ItemID,
                image: req.query.image,
                title: req.query.title,
                price: req.query.price,
                shipping: req.query.shipping
            }]
        });
        const result = await wishlistAdd.save();
        console.log(result)    
        // const wishlist = await Wishlist.find();
        // res.json(wishlist);
        }
    }
    catch (e) {
        console.log(e);
    }
});

app.get('/getWishlist', async (req, res) => {
    try {
        // Assuming you want to fetch the wishlist for a specific user,
        // you might pass a userId as a query parameter or extract it from a session or token.
        // For example: const userId = req.query.userId;
        // Here, I am fetching all wishlists for simplicity.
        const wishlist = await Wishlist.find();
        //write a code  to fetch image title price shipping from mongodb
        let response=[];
        wishlist.forEach((item)=>{
            let itemDict={};
            itemDict.productId=item.items[0].productId;
            itemDict.image=item.items[0].image;
            itemDict.title=item.items[0].title;
            itemDict.price=item.items[0].price;
            itemDict.shipping=item.items[0].shipping;
            response.push(itemDict);
        })
        res.json(response);

        


    }
       catch(e){
        console.error(e);
        res.status(500).send('An error occurred while fetching the wishlist');
    }
       
        
});



app.listen(port, (error) => {
    if (!error)
        console.log("App running successfully running on port " + port)
    else
        console.log("Cannot start the server due to an unexpected error: " + error);
    }
);