package com.example.ebayshoppingapplictaion;

public class WishlistItem {
    private String image;
    private String title;
    private String location;
    private String condition;
    private String price;
    private String shipping;
    private String productUrl;
    private String productId;
    private boolean isInWishlist;
    // Constructor
    public WishlistItem(String image, String title, String location,String shipping, String condition, String price,String productId) {
        this.image=image;
        this.title = title;
        this.location = location;
        this.shipping = shipping;
        this.condition = condition;
        this.price = price;
//        this.productUrl = productUrl;
        this.productId=productId;

    }

    // Getters
    public String getImage(){return image;}
    public String getTitle() { return title; }
    public String getLocation() { return location; }
    public String getShipping() { return shipping; }
    public String getCondition() { return condition; }
    public String getPrice() { return price; }

//    public String getProductUrl() { return productUrl; }
    public String getProductUrl(){return productId;}
    public boolean isInWishlist() {
        return isInWishlist;
    }

    public void setInWishlist(boolean inWishlist) {
        isInWishlist = inWishlist;
    }

}
