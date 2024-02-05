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
const { ObjectId } = require('mongodb');
dotenv.config();
connectDB();
//newcommit
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
    // console.log(getItemBaseUrl);
 
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
    const username = 'shreyak31'; 
    const country = 'US';

    const apiUrl = `http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${postalstart}&maxRows=5&username=${username}&country=${country}`;

    console.log(apiUrl);
    //i want only postal code
    
    
//in request call processPostal function
    request(apiUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // res.json(JSON.parse(body));
            let result = [];
            const parsedBody = JSON.parse(body);
            if (parsedBody.postalCodes) {
                result = parsedBody.postalCodes.map(item => item.postalCode);
            }
            res.json(result);
        } else {
            res.status(500).send('Error');
        }
    });

    // request(apiUrl, (error, response, body) => {
    //     if (!error && response.statusCode === 200) {
    //         res.json(JSON.parse(body));
    //     } else {
    //         res.status(500).send('Error');
    //     }
    // });
});

app.get("/googlesearch", async (req, res) => {
    const productTitle = req.query.q; // The search expression
    if (!productTitle) {
      return res.status(400).json({ error: 'Search expression (q) is required.' });
    }
  
    const cx = 'b2bd2d95401f24d5a'; // The custom search engine ID
    const key = 'AIzaSyDoqE_GEhIWoCZ4I7ZUCPTSawyNO4mbIJE'; // Your application's API key
    const imgSize = req.query.imgSize || 'large'; // Image size (optional parameter, defaults to 'large')
    const num = req.query.num || 10; // Number of search results to return (optional parameter, defaults to 10)
    const searchType = 'image'; // Specifies the search type
  
    const googleSearchURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(productTitle)}&cx=${cx}&imgSize=${imgSize}&num=${num}&searchType=${searchType}&key=${key}`;

   

    request(googleSearchURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let result = [];
            const parsedBody = JSON.parse(body);
            if (parsedBody.items) {
                result = parsedBody.items.map(item => item.link);
            }
            res.json(result);
            

            // res.json(JSON.parse(body));
        } else {
            res.status(500).send('Error');
        }
    });


    // request({url:getItemBaseUrl, headers}, (error, response, body) => {
        
    //     if (!error && response.statusCode === 200) {
    //         // res.json(JSON.parse(body));
    //         const parsedBody = JSON.parse(body);
    //     const processedItem = utils.processItemDetailData(parsedBody);
    //     res.json(processedItem);
    //     } else {

    //         res.status(500).send('Error');
    //     }
    // });



   
    // try {
    // const googleResponse = await makeAPICall(googleSearchURL);
    // console.log(googleResponse)
    //   res.json(googleResponse);
    // } catch (error) {
    //   res.status(500).json({
    //     message: 'Error occurred while fetching photos from Google Custom Search',
    //     error: error.message
    //   });
    // }
  });


//   app.get('/getSimilarItems', async (req, res) => {
//     const itemID = req.query.itemID || '335007021375';
  
//     const merchandisingApiUrl = 'https://svcs.ebay.com/MerchandisingService';
//     const params = {
//       'OPERATION-NAME': 'getSimilarItems',
//       'SERVICE-NAME': 'MerchandisingService',
//       'SERVICE-VERSION': '1.1.0',
//       'CONSUMER-ID': 'ShreyaSa-dummy-PRD-5932e5ad5-579e0f09',
//       'RESPONSE-DATA-FORMAT': 'JSON',
//       'REST-PAYLOAD': '',
//       'itemId': itemID,
//       'maxResults': 20
//     };
//     console.log(merchandisingApiUrl)
//     try {
//       const response = await axios.get(merchandisingApiUrl, {
//         params: params,
//         headers: {
//           "X-EBAY-API-IAF-TOKEN": await ebayfunc()
//         }
//       });
//       // If utils.processItemDetailData is a function you have to process the data, use it
//       // Otherwise, just return the response data
//       const processedItem = utils.processItemDetailData ? utils.processItemDetailData(response.data) : response.data;
//       res.json(processedItem);
//     } catch (error) {
//       console.error('Error fetching data from eBay Merchandising API:', error);
//       res.status(500).send('Error fetching data');
//     }
//   });
  

app.get('/getSimilarItems', async (req, res) => {
    const itemID = req.query.itemID || '';

    const merchandisingApiUrl = `https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=${itemID}&maxResults=20`;

    // console.log(merchandisingApiUrl);

    request(merchandisingApiUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // processSimilarData fucntion call this here
            let processedBody;
            if (utils.processSimilarData) {
                processedBody = utils.processSimilarData(JSON.parse(body));
            } else {
                processedBody = JSON.parse(body);
            }
            res.json(processedBody);
        } else {
            res.status(500).send('Error');
        }
    });
    
    
});




app.get('/addToWishlist', async (req, res) => {
    // console.log("backend wl");
    // console.log(req.query.ItemID);
    // console.log(req.query.image);
    // console.log(req.query.title);
    // console.log(req.query.price);
    // console.log(req.query.shipping);
    // console.log(req.query.shippingCost);
    // console.log(req.query.shippingLocation);
    // console.log(req.query.handlingTime);
    // console.log(req.query.expeditedShipping);
    // console.log(req.query.oneDayShipping);
    // console.log(req.query.returnsAccepted);

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
                shipping: req.query.shipping,
                shippingCost:req.query.shippingCost,
                shippingLocation:req.query.shippingLocation,
                handlingTime:req.query.handlingTime,
                expeditedShipping:req.query.expeditedShipping,
                oneDayShipping:req.query.oneDayShipping,
                returnsAccepted:req.query.returnsAccepted


            }]
        });
        const result = await wishlistAdd.save();
        // console.log(result)    
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
            // itemDict.title=item.items[0].title;
            itemDict.title=item.items[0].title;
         
            itemDict.price=item.items[0].price;
            itemDict.shipping=item.items[0].shipping;
            // itemDict.shippingCost=item.items[0].shippingCost;
            // itemDict.shippingLocation=item.items[0].shippingLocation;
            // itemDict.handlingTime=item.items[0].handlingTime;
            // itemDict.expeditedShipping=item.items[0].expeditedShipping;
            // itemDict.oneDayShipping=item.items[0].oneDayShipping;
            // itemDict.returnsAccepted=item.items[0].returnsAccepted;
            // itemDict.favourites={
            //     icon: "cart_icon"

            // }
            response.push(itemDict);
        })
        res.json(response);

        


    }
       catch(e){
        console.error(e);
        res.status(500).send('An error occurred while fetching the wishlist');
    }
       
        
});

app.delete('/deleteWishlist', async (req, res) => {

    const itemID = req.query.itemID || '';
    try {
        const wishlist = await Wishlist.findOneAndDelete({ 'items.productId': itemID });;
        res.json(wishlist);
    } catch(e) {
        console.error(e);
        res.status(500).send('An error occurred while deleting the wishlist');
    }
}

);
// app.get('/getShipping', async (req, res) => {
//     const itemID = req.query.itemID || '';

//         const wishlistItems = await Wishlist.find({ 'items.productId': itemID });
//         console.log(wishlistItems);
//     try {
        
//          //here get shiippingcost location handling time and others

        
//         // var response=[];
//         // wishlist.forEach((item)=>{
//         //     let itemDict={};
//         //     itemDict.productId=item.items[0].productId;
//         //     itemDict.shippingCost=item.items[0].shippingCost;
//         //     itemDict.shippingLocation=item.items[0].shippingLocation;
//         //     itemDict.handlingTime=item.items[0].handlingTime;
//         //     itemDict.expeditedShipping=item.items[0].expeditedShipping;
//         //     itemDict.oneDayShipping=item.items[0].oneDayShipping;
//         //     itemDict.returnsAccepted=item.items[0].returnsAccepted;
//         //     response.push(itemDict);
//         // })
//         var response = [];
//         wishlistItems.forEach((wishlistItem) => {
//             wishlistItem.items.forEach((item) => {
//                 // Check if the current item matches the item ID we're looking for
//                 if (item.productId.toString() === itemId) {
//                     let itemDict = {
//                         productId: item.productId,
//                         shippingCost: item.shippingCost,
//                         shippingLocation: item.shippingLocation,
//                         handlingTime: item.handlingTime,
//                         expeditedShipping: item.expeditedShipping,
//                         oneDayShipping: item.oneDayShipping,
//                         returnsAccepted: item.returnsAccepted
//                     };
//                     response.push(itemDict);
//                 }
//             });
        //  });

        


//     }
//        catch(e){
//         console.error(e);
//         res.status(500).send('An error occurred while fetching the shipping');
//     }
       
        
// });
// app.get('/getShipping/:itemId', async (req, res) => {
//     try {
//         const itemId = req.params.itemId;
//         // Assuming `wishlistItem` is your model, the correct collection name should be used here
//         const queryItemId = ObjectId.isValid(itemId) ? new ObjectId(itemId) : itemId;
//         const wishlistItem = await Wishlist.findOne({ 'items.productId': queryItemId });

//         // If the wishlist with the given itemId is not found, send an appropriate response
//         if (!wishlistItem) {
//             return res.status(404).send('Item not found');
//         }

//         // Find the item in the items array
//         const item = wishlistItem.items.find(item => item.productId === itemId);

//         // If the item does not exist in the items array, send an appropriate response
//         if (!item) {
//             return res.status(404).send('Product not found in the wishlist items');
//         }

//         // Prepare the response object with the shipping details
//         const response = {
//             productId: item.productId,
//             shippingCost: item.shippingCost,
//             shippingLocation: item.shippingLocation,
//             handlingTime: item.handlingTime,
//             expeditedShipping: item.expeditedShipping,
//             oneDayShipping: item.oneDayShipping,
//             returnsAccepted: item.returnsAccepted
//         };

//         // Send the shipping details response
//         res.json(response);

//     } catch (e) {
//         console.error(e);
//         res.status(500).send('An error occurred while fetching the shipping details');
//     }
// });



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
// app.listen(port, (error) => {
//     if (!error)
//         console.log("App running successfully running on port " + port)
//     else
//         console.log("Cannot start the server due to an unexpected error: " + error);
//     }
// );