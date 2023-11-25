package com.example.ebayshoppingapplictaion;

public class SimilarItem {
    private String itemId;
    private String title;
    private String image;
    private String price;
    private String shippingCost;
    private String timeLeft;
    private String viewItemURL;
    // Other fields...

    // Updated constructor
    public SimilarItem(String itemId, String title, String image, String price, String shippingCost, String timeLeft, String viewItemURL /* other parameters */) {
        this.itemId = itemId;
        this.title = title;
        this.image = image;
        this.price = price;
        this.shippingCost = shippingCost;
        this.timeLeft = timeLeft;
        this.viewItemURL = viewItemURL;
        // Set other fields...
    }

    // Getters
    public String getItemId() { return itemId; }
    public String getTitle() { return title; }
    public String getImage() { return image; }
    public String getPrice() { return price; }
    public String getShippingCost() { return shippingCost; }
    public String getTimeLeft() { return timeLeft; }
    public String getViewItemURL() { return viewItemURL; }
    // Other getters...
}
