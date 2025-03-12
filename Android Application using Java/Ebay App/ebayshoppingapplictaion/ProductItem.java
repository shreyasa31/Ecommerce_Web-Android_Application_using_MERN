package com.example.ebayshoppingapplictaion;

import java.util.ArrayList;

public class ProductItem {
    private String id;
    private String title;
    private ArrayList<String> photo;
    private String price;
    private String brand;
    private ArrayList<ItemSpecific> itemSpecifics;

    // Constructor
    public ProductItem(String id, String title, ArrayList<String> photo, String price, String brand, ArrayList<ItemSpecific> itemSpecifics) {
        this.id = id;
        this.title = title;
        this.photo = photo;
        this.price = price;
        this.brand = brand;
        this.itemSpecifics = itemSpecifics;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<String> getPhotos() {
        return photo;
    }

    public String getPrice() {
        return price;
    }

    public String getBrand() {
        return brand;
    }

    public ArrayList<ItemSpecific> getItemSpecifics() {
        return itemSpecifics;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPhotos(ArrayList<String> photo) {
        this.photo = photo;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setItemSpecifics(ArrayList<ItemSpecific> itemSpecifics) {
        this.itemSpecifics = itemSpecifics;
    }

    // ItemSpecific inner class
    public static class ItemSpecific {
//        private String name;
        private String value;

        // Constructor
        public ItemSpecific( String value) {
//            this.name = name;
            this.value = value;
        }

        // Getters
//        public String getName() {
//            return name;
//        }

        public String getValue() {
            return value;
        }

        // Setters
//        public void setName(String name) {
//            this.name = name;
//        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}

