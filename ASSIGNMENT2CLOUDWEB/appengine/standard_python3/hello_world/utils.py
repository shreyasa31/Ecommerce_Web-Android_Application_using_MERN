def process_search_data(data):
    if not data: return data
    items = []
    paginations = []
    if not data.get("findItemsAdvancedResponse", None): return None
    if len(data["findItemsAdvancedResponse"]) == 0: return None
    for instance in data["findItemsAdvancedResponse"]:
        pagination_dict = {}
        if instance.get("paginationOutput", None):
            pagination_dict["totalEntries"] = instance["paginationOutput"][0]["totalEntries"][0]
            paginations.append(pagination_dict)
        if instance.get("searchResult", None):
            if len(instance["searchResult"]) > 0:
                for j in instance["searchResult"]:
                    if j.get("item", None):
                        for i in j["item"]:
                            item_dict = {}
                            item_dict["itemId"] = i["itemId"][0] if i.get("itemId", None) and len(i["itemId"]) > 0 else None
                            item_dict["title"] = i["title"][0] if i.get("title", None) and len(i["title"]) > 0 else None
                            item_dict["galleryURL"] = i["galleryURL"][0] if i.get("galleryURL", None) and len(i["galleryURL"]) > 0 else None
                            item_dict["viewItemURL"] = i["viewItemURL"][0] if i.get("viewItemURL", None) and len(i["viewItemURL"]) > 0 else None
                            item_dict["categoryName"] = i["primaryCategory"][0]["categoryName"][0] if i.get("primaryCategory", None) and len(i["primaryCategory"]) > 0 and i["primaryCategory"][0].get("categoryName", None) and len(i["primaryCategory"][0]["categoryName"]) > 0 else None
                            item_dict["condition"] = i["condition"][0]["conditionDisplayName"][0] if i.get("condition", None) and len(i["condition"]) > 0 and i["condition"][0].get("conditionDisplayName", None) and len(i["condition"][0]["conditionDisplayName"]) > 0 else None
                            item_dict["topRatedListing"] = i["topRatedListing"][0] if i.get("topRatedListing", None) and len(i["topRatedListing"]) > 0 else None
                            item_price = i["sellingStatus"][0]["convertedCurrentPrice"][0]["__value__"] if i.get("sellingStatus", None) and len(i["sellingStatus"]) > 0 and i["sellingStatus"][0].get("convertedCurrentPrice", None) and len(i["sellingStatus"][0]["convertedCurrentPrice"]) > 0 and i["sellingStatus"][0]["convertedCurrentPrice"][0].get("__value__", None) else None
                            shipping_price = i["shippingInfo"][0]["shippingServiceCost"][0]["__value__"] if i.get("shippingInfo", None) and len(i["shippingInfo"]) > 0 and i["shippingInfo"][0].get("shippingServiceCost", None) and len(i["shippingInfo"][0]["shippingServiceCost"]) > 0 and i["shippingInfo"][0]["shippingServiceCost"][0].get("__value__", None) else None
                            price = f"${str(item_price)}"
                            if shipping_price is not None and float(shipping_price) >= 0.01:
                                price += f" (+ ${str(shipping_price)} shipping)"
                            item_dict["price"] = price
                            items.append(item_dict)
    return {
        "items": items,
        "pagination": paginations
    }


def process_item_detail_data(data):
    if not data: return data
    if not data.get("Item", None): return None
    item = {}
    item["itemId"] = data["Item"]["ItemID"] if data["Item"].get("ItemID", None) else None
    item["photo"] = data["Item"]["PictureURL"][0] if data["Item"].get("PictureURL", None) and len(data["Item"]["PictureURL"]) > 0 else None
    item["title"] = data["Item"]["Title"] if data["Item"].get("Title", None) else None
    item["ebayLink"] = data["Item"]["ViewItemURLForNaturalSearch"] if data["Item"].get("ViewItemURLForNaturalSearch", None) else None
    item["subtitle"] = data["Item"]["Subtitle"] if data["Item"].get("Subtitle", None) else None
    item["price"] = data["Item"]["CurrentPrice"]["Value"] if data["Item"].get("CurrentPrice", None) and data["Item"]["CurrentPrice"].get("Value", None) else None
    item["location"] = data["Item"]["Location"] if data["Item"].get("Location", None) else None
    item["postalCode"] = data["Item"]["PostalCode"] if data["Item"].get("PostalCode", None) else None
    item["seller"] = data["Item"]["Seller"]["UserID"] if data["Item"].get("Seller", None) and data["Item"]["Seller"].get("UserID", None) else None
    return_policy = None
    if data["Item"].get("ReturnPolicy", None):
        if data["Item"]["ReturnPolicy"].get("ReturnsAccepted", None):
            return_policy = data["Item"]["ReturnPolicy"]["ReturnsAccepted"]
        if data["Item"]["ReturnPolicy"].get("ReturnsWithin", None):
            return_policy += " within " + data["Item"]["ReturnPolicy"]["ReturnsWithin"]
    item["returnPolicy"] = return_policy
    item_specifics = []
    if data["Item"].get("ItemSpecifics", None) and data["Item"]["ItemSpecifics"].get("NameValueList", None) and len(data["Item"]["ItemSpecifics"]["NameValueList"]) > 0:
        for i in data["Item"]["ItemSpecifics"]["NameValueList"]:
            item_specifics.append({
                "name": i["Name"],
                "value": i["Value"][0] if i.get("Value", None) and len(i["Value"]) > 0 else None
            })
    item["itemSpecifics"] = item_specifics
    return item