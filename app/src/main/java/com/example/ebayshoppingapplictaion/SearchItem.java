package com.example.ebayshoppingapplictaion;

public class SearchItem {
    private String image;
    private String title;
    private String zipcode;
    private String condition;
    private String price;
    private String shippingType;
    private String productUrl;
    // Constructor
    public SearchItem(String image, String title, String zipcode,String shippingType, String condition, String price,String productUrl) {
        this.image=image;
        this.title = title;
        this.zipcode = zipcode;
        this.shippingType = shippingType;
        this.condition = condition;
        this.price = price;
        this.productUrl = productUrl;

    }

    // Getters
    public String getImage(){return image;}
    public String getTitle() { return title; }
    public String getZipcode() { return zipcode; }
    public String getShippingType() { return shippingType; }
    public String getCondition() { return condition; }
    public String getPrice() { return price; }
    public String getProductUrl() { return productUrl; }

}
