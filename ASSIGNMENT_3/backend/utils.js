// 
module.exports = {
    processSearchData: function(data) {
        if (!data) return data;
        let items = [];
        let index = 1; // Initialize counter for index

        if (!data.findItemsAdvancedResponse || data.findItemsAdvancedResponse.length === 0) {
            return null;
        }

        for (let instance of data.findItemsAdvancedResponse) {
            if (instance.searchResult && instance.searchResult.length > 0) {
                for (let j of instance.searchResult) {
                    if (j.item) {
                        for (let i of j.item) {
                            let itemDict = {};

                            itemDict.index = index++;  // Add index to each item and increment
                            itemDict.itemId = i.itemId && i.itemId.length > 0 ? i.itemId[0] : null;
                            itemDict.title = i.title && i.title.length > 0 ? i.title[0] : null;
                            itemDict.image = i.galleryURL && i.galleryURL.length > 0 ? i.galleryURL[0] : null;  // Image
                            itemDict.zipcode = i.postalCode && i.postalCode.length > 0 ? i.postalCode[0] : null; // Zipcode
                            let itemPrice = i.sellingStatus && i.sellingStatus.length > 0 && i.sellingStatus[0].convertedCurrentPrice && i.sellingStatus[0].convertedCurrentPrice.length > 0 ? i.sellingStatus[0].convertedCurrentPrice[0]["__value__"] : null;
                            // let shippingPrice = i.shippingInfo && i.shippingInfo.length > 0 && i.shippingInfo[0].shippingServiceCost && i.shippingInfo[0].shippingServiceCost.length > 0 ? i.shippingInfo[0].shippingServiceCost[0]["__value__"] : null;
                            if (i.shippingInfo && i.shippingInfo.length > 0 && i.shippingInfo[0].shippingType) {
                                if (i.shippingInfo[0].shippingType.includes("Free")) {
                                    itemDict.shippingType = "Free Shipping";
                                } else if (i.shippingInfo[0].shippingType.includes("Pickup")) {
                                    itemDict.shippingType = "Local Pickup";
                                } else {
                                    // handle other types or set to a default value if needed
                                    itemDict.shippingType = "Unknown";
                                }
                            }
                            itemDict.price = `$${itemPrice}`;
                            // if (shippingPrice !== null && parseFloat(shippingPrice) >= 0.01) {
                            //     itemDict.price += ` (+ $${shippingPrice} for shipping)`;
                            // }
                            itemDict.wishlist = {
                                // added: false, // Placeholder; this should be determined from the user's actual wishlist
                                // icon: "🖤"    // Using a heart emoji as a placeholder for the wishlist icon; replace with the actual icon in your frontend

                                icon: "cart_icon"

                            
                            };
                            items.push(itemDict);
                        }
                    }
                }
            }
        }

        return {
            items: items
        };
    }
}
