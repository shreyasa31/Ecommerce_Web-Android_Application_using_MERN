package com.example.ebayshoppingapplictaion;

public class SearchItem {
    private String image;
    private String title;
    private String zipcode;
    private String condition;
    private String price;
    private String shippingType;

    // Constructor
    public SearchItem(String image, String title, String zipcode, String condition, String price, String shippingType) {
        this.image=image;
        this.title = title;
        this.zipcode = zipcode;
        this.condition = condition;
        this.price = price;
        this.shippingType = shippingType;
    }

    // Getters
    public String getImage(){return image;}
    public String getTitle() { return title; }
    public String getZipcode() { return zipcode; }
    public String getCondition() { return condition; }
    public String getPrice() { return price; }
    public String getShippingType() { return shippingType; }
}
