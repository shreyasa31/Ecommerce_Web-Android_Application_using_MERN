package com.example.ebayshoppingapplictaion;

public class Item {
    private String storeName;
    private String storeURL;
    private int feedbackScore;
    private double positiveFeedbackPercent;
    private String feedbackRatingStar;
    private boolean globalShipping;
    private int handlingTime;
    private String refund;
    private String returnsWithin;
    private String shippingCostPaidBy;

    // Constructor
    public Item(String storeName, String storeURL, int feedbackScore, double positiveFeedbackPercent,
                String feedbackRatingStar, boolean globalShipping, int handlingTime, String refund,
                String returnsWithin, String shippingCostPaidBy) {
        this.storeName = storeName;
        this.storeURL = storeURL;
        this.feedbackScore = feedbackScore;
        this.positiveFeedbackPercent = positiveFeedbackPercent;
        this.feedbackRatingStar = feedbackRatingStar;
        this.globalShipping = globalShipping;
        this.handlingTime = handlingTime;
        this.refund = refund;
        this.returnsWithin = returnsWithin;
        this.shippingCostPaidBy = shippingCostPaidBy;
    }

    // Getters and Setters
    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getStoreURL() {
        return storeURL;
    }

    public void setStoreURL(String storeURL) {
        this.storeURL = storeURL;
    }

    public int getFeedbackScore() {
        return feedbackScore;
    }

    public void setFeedbackScore(int feedbackScore) {
        this.feedbackScore = feedbackScore;
    }

    public double getPositiveFeedbackPercent() {
        return positiveFeedbackPercent;
    }

    public void setPositiveFeedbackPercent(double positiveFeedbackPercent) {
        this.positiveFeedbackPercent = positiveFeedbackPercent;
    }

    public String getFeedbackRatingStar() {
        return feedbackRatingStar;
    }

    public void setFeedbackRatingStar(String feedbackRatingStar) {
        this.feedbackRatingStar = feedbackRatingStar;
    }

    public boolean isGlobalShipping() {
        return globalShipping;
    }

    public void setGlobalShipping(boolean globalShipping) {
        this.globalShipping = globalShipping;
    }

    public int getHandlingTime() {
        return handlingTime;
    }

    public void setHandlingTime(int handlingTime) {
        this.handlingTime = handlingTime;
    }

    public String getRefund() {
        return refund;
    }

    public void setRefund(String refund) {
        this.refund = refund;
    }

    public String getReturnsWithin() {
        return returnsWithin;
    }

    public void setReturnsWithin(String returnsWithin) {
        this.returnsWithin = returnsWithin;
    }

    public String getShippingCostPaidBy() {
        return shippingCostPaidBy;
    }

    public void setShippingCostPaidBy(String shippingCostPaidBy) {
        this.shippingCostPaidBy = shippingCostPaidBy;
    }
}
