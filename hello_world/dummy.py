# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask, jsonify
from flask import request
from ebay_oauth_token import OAuthToken
import requests
import sys
from ebay_oauth_token import OAuthToken




# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)



singleItemBaseUrl = "https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=%5BAPPID%5D&siteid=0&version=967&ItemID=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&IncludeSelector=Description,Details,ItemSpecifics"


def ebayfunc():
    client_id = "ShreyaSa-dummy-PRD-5932e5ad5-579e0f09"
    client_secret = "PRD-932e5ad5cb94-f84f-4125-ac8b-c5a2"
# Create an instance of the OAuthUtility class
    oauth_utility = OAuthToken(client_id, client_secret)
# Get the application token
    return oauth_utility.getApplicationToken()

@app.route("/")
def home_page():
    return 'Hello'

# @app.route("/search")
# def searchItem():
#     searchBaseUrl = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&"
#     a = "keywords=iphone&paginationInput.entriesPerPage=10&"
#     b = "sortOrder=BestMatch&itemFilter(0).name=MaxPrice&itemFilter(0).value=25&"
#     c = "itemFilter(0).paramName=Currency&itemFilter(0).paramValue=USD"
#     dummy_url = searchBaseUrl + a + b + c
#     for key, val in request.args.items():
#         searchBaseUrl = searchBaseUrl + key
#     print(dummy_url)
#     headers = {
#       "X-EBAY-API-IAF-TOKEN": ebayfunc()
#     }
#     response = requests.get(searchBaseUrl, headers=headers)
    

#     return response

@app.route("/search")
def searchItem():
    searchBaseUrl = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=ShreyaSa-dummy-PRD-5932e5ad5-579e0f09&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&"
    keyword = request.args.get('keyword', None)
    minPrice = request.args.get('minPrice', None)
    maxPrice = request.args.get('maxPrice', None)
    condition = condition_dict.get(request.args.get('condition', 'new'), None)
    seller = request.args.get('seller', None)
    free_shipping = request.args.get('freeShipping', None)
    expedited_shipping = request.args.get('expeditedShipping', None)
    sort_by = request.args.get('sortBy', 'BestMatch')
    if keyword is not None:
        searchBaseUrl += f"keywords={keyword}&paginationInput.entriesPerPage=10&"
    if minPrice is not None:
        searchBaseUrl += f"itemFilter(0).name=MinPrice&itemFilter(0).value={minPrice}&paramName=Currency&paramValue=USD&"
    if maxPrice is not None:
        searchBaseUrl += f"itemFilter(0).name=MaxPrice&itemFilter(0).value={maxPrice}&paramName=Currency&paramValue=USD&"
    if condition is not None:
        searchBaseUrl += f"itemFilter(0).name=Condition&itemFilter(0).value={condition}&"
    if seller is not None:
        if seller:
            searchBaseUrl += f"itemFilter(0).name=ReturnsAcceptedOnly&itemFilter(0).value={seller}&"
    if free_shipping is not None:
        if free_shipping:
            searchBaseUrl += f"itemFilter(0).name=FreeShippingOnly&itemFilter(0).value={free_shipping}&"
    if expedited_shipping is not None:
        if expedited_shipping:
            searchBaseUrl += f"itemFilter(0).name=ExpeditedShippingType&itemFilter(0).value=Expedited&"
    if sort_by is not None:
        searchBaseUrl += f"sortOrder={sort_by}"
    headers = {
      "X-EBAY-API-IAF-TOKEN": ebayfunc()
    }
    response = requests.get(searchBaseUrl, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data from external API"}), response.status_code


if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
