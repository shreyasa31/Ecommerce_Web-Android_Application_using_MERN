package com.example.ebayshoppingapplictaion;

import android.app.Activity;
import android.content.Intent;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;


public class ShippingFragment extends Fragment {


    // Static factory method to create a new instance of the fragment
    private static final String ARG_ITEM_ID = "itemId";
    private String itemId;
    private String ShippingType;

    private TextView storename,feedbackscore,popularity,shippingcost,globalshipping,handlingtime,policy,returnswithin,refundmode,shippedby;
    private ImageView feedbackstar;

    // Static factory method to create a new instance of the fragment
    public static ShippingFragment newInstance(String itemId,String ShippingType) {
        ShippingFragment fragment = new ShippingFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ITEM_ID, itemId);
        args.putString("ARG_SHIPPING_TYPE", ShippingType);
        fragment.setArguments(args);
        return fragment;
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            itemId = getArguments().getString(ARG_ITEM_ID);
            ShippingType = getArguments().getString("ARG_SHIPPING_TYPE");
        }
    }
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // ... existing code ...
        View view = inflater.inflate(R.layout.fragment_shipping, container, false);
        storename=view.findViewById(R.id.storeName);
        feedbackscore=view.findViewById(R.id.feedbackscore);
        popularity=view.findViewById(R.id.popularity);
        feedbackstar=view.findViewById(R.id.feedbackstar);
        shippingcost=view.findViewById(R.id.shippingcost);
        globalshipping=view.findViewById(R.id.globalshipping);
        handlingtime=view.findViewById(R.id.handlingtime);
        policy=view.findViewById(R.id.policy);
        returnswithin=view.findViewById(R.id.returnswithin);
        refundmode=view.findViewById(R.id.refund);
        shippedby=view.findViewById(R.id.shippedby);
        parseAndDisplayData();
        return view;
        // ... existing code ...
    }
    //    private void parseAndDisplayData() {
//        String url = "http://10.0.2.2:8080/getItem?ItemID=" + itemId;
//        Log.d("LETSSSSSS","SEEEE"+url);
//        // Request a string response from the provided URL.
//        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
//                response -> {
//                    try {
//                        // Parse the response and update UI
//                        JSONObject jsonObject = new JSONObject(response);
//
//                        final String storeURL = jsonObject.getString("storeURL");
//                        storename.setText(jsonObject.getString("storeName"));
//                        feedbackscore.setText(String.valueOf(jsonObject.getInt("feedbackScore")));
//                        popularity.setText(String.format("%.1f%%", jsonObject.getDouble("PositiveFeedbackPercent")));
//                        feedbackstar.setText(jsonObject.getString("feedbackRatingStar"));
//                        globalshipping.setText(jsonObject.getBoolean("GlobalShipping") ? "Yes" : "No");
//                        handlingtime.setText(jsonObject.getInt("HandlingTime") + " days");
//                        policy.setText(jsonObject.getString("Refund"));
//                        returnswithin.setText(jsonObject.getString("returnsWithin"));
//                        refundmode.setText(jsonObject.getString("Refund"));
//                        shippedby.setText(jsonObject.getString("ShippingCostPaidBy"));
//                        if (getActivity() != null) {
//                            Intent intent = getActivity().getIntent();
//                            String shippingCostValue = intent.getStringExtra("shippingCost");
//                            // Use the shippingCost value as needed
//                            shippingcost.setText(shippingCostValue != null ? shippingCostValue : "Not Available");
//                        }
//
//
//                        // Make store name clickable
//                        storename.setOnClickListener(v -> {
//                            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(storeURL));
//                            startActivity(browserIntent);
//                        });
//
//                    } catch (JSONException e) {
//                        e.printStackTrace();
//                    }
//                },
//                error -> {
//                    // Handle error
//                    Log.e("Volley", "Error: " + error.toString());
//                });
//
//        // Add the request to the RequestQueue.
//        RequestQueue queue = Volley.newRequestQueue(requireContext());
//        queue.add(stringRequest);
//    }
    private void parseAndDisplayData() {
        String url = "http://10.0.2.2:8080/getItem?ItemID=" + itemId;
        Log.d("LETSSSSSS","SEEEE"+url);
//    StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
//            response -> {
//                try {
//                    JSONObject jsonObject = new JSONObject(response);
//                    Item item = new Item(
//                            jsonObject.getString("storeName"),
//                            jsonObject.getString("storeURL"),
//                            jsonObject.getInt("feedbackScore"),
//                            jsonObject.getDouble("PositiveFeedbackPercent"),
//                            jsonObject.getString("feedbackRatingStar"),
//                            jsonObject.getBoolean("GlobalShipping"),
//                            jsonObject.getInt("HandlingTime"),
//                            jsonObject.getString("Refund"),
//                            jsonObject.getString("returnsWithin"),
//                            jsonObject.getString("ShippingCostPaidBy")
//                    );
//
//                    updateUI(item);
//
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//            },
//            error -> Log.e("Volley", "Error: " + error.toString())
//    );
//
//    RequestQueue queue = Volley.newRequestQueue(requireContext());
//    queue.add(stringRequest);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                response -> {
                    try {
                        JSONObject jsonObject = new JSONObject(response);

                        // Use optString to avoid JSONException if the key is missing
                        String storeName = jsonObject.optString("storeName", "N/A");
                        String storeURL = jsonObject.optString("storeURL", "N/A");
                        int feedbackScore = jsonObject.optInt("feedbackScore", 0);
                        double positiveFeedbackPercent = jsonObject.optDouble("PositiveFeedbackPercent", 0.0);
                        String feedbackRatingStar = jsonObject.optString("feedbackRatingStar", "N/A");
                        boolean globalShipping = jsonObject.optBoolean("GlobalShipping", false);
                        int handlingTime = jsonObject.optInt("HandlingTime", 0);
                        String refund = jsonObject.optString("Refund", "N/A");
                        String returnsWithin = jsonObject.optString("returnsWithin", "N/A");
                        String shippingCostPaidBy = jsonObject.optString("ShippingCostPaidBy", "N/A");
                        String returnsAccepted=jsonObject.optString("returnsAccepted","N/A");
                        Item item = new Item(storeName, storeURL, feedbackScore, positiveFeedbackPercent, feedbackRatingStar, globalShipping, handlingTime, refund, returnsWithin, shippingCostPaidBy,returnsAccepted);
                        updateUI(item);
//                        Activity activity = getActivity();
//                        if (activity != null) {
//                            ProgressBar progressBar = activity.findViewById(R.id.progressBar);
//                            TextView loadingText = activity.findViewById(R.id.searchProductsText);
//                            progressBar.setVisibility(View.GONE);
//                            loadingText.setVisibility(View.GONE);
//                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                },
                error -> Log.e("Volley", "Error: " + error.toString())
        );

        RequestQueue queue = Volley.newRequestQueue(requireContext());
        queue.add(stringRequest);
    }
    private void updateUI(Item item) {
        ProgressBar feedbackProgress = getView().findViewById(R.id.feedbackProgress);
        // Calculate the progress from the PositiveFeedbackPercent
        int progressValue = (int) Math.round(item.getPositiveFeedbackPercent());
        feedbackProgress.setProgress(progressValue);
        // Set the percentage text
        popularity.setText(String.format(Locale.getDefault(), "%.1f%%", item.getPositiveFeedbackPercent()));
//        storename.setText(item.getStoreName());

        String storeNameText = item.getStoreName();
        SpannableString content = new SpannableString(storeNameText);
        content.setSpan(new UnderlineSpan(), 0, storeNameText.length(), 0);
        storename.setText(content);

        feedbackscore.setText(String.valueOf(item.getFeedbackScore()));
        popularity.setText(String.format(Locale.getDefault(),"%.1f%%", item.getPositiveFeedbackPercent()));
        setFeedbackStarColor(feedbackstar, item.getFeedbackRatingStar());
        globalshipping.setText(item.isGlobalShipping() ? "Yes" : "No");
        handlingtime.setText(item.getHandlingTime() + " ");
        policy.setText(item.getReturnsAccepted());
        returnswithin.setText(item.getReturnsWithin());
        refundmode.setText(item.getRefund());
        shippedby.setText(item.getShippingCostPaidBy());
        shippingcost.setText(ShippingType);
//        if (getActivity() != null) {
//            Intent intent = getActivity().getIntent();
//            String shippingCostValue = intent.getStringExtra("shippingCost");
//            shippingcost.setText(shippingCostValue != null ? shippingCostValue : "Not Available");
//        }

        storename.setOnClickListener(v -> {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(item.getStoreURL()));
            startActivity(browserIntent);
        });
    }
    private void setFeedbackStarColor(ImageView feedbackstar, String feedbackRatingStar) {
        int starColor;
        switch (feedbackRatingStar) {
            case "YellowShooting":
                starColor = getResources().getColor(R.color.yellow_shooting_star); // Define this color in colors.xml
                break;
            case "Yellow":
                starColor = getResources().getColor(R.color.yellow_star); // Define this color in colors.xml
                break;
            case "Green":
                starColor = getResources().getColor(R.color.green_star); // Define this color in colors.xml
                break;
            case "GreenShooting":
                starColor = getResources().getColor(R.color.green_shooting_star); // Define this color in colors.xml
                break;
            case "Turquoise":
                starColor = getResources().getColor(R.color.turquoise_star); // Define this color in colors.xml
                break;
            case "TurquoiseShooting":
                starColor = getResources().getColor(R.color.turquoise_shooting_star); // Define this color in colors.xml
                break;
            case "Purple":
                starColor = getResources().getColor(R.color.purple_star); // Define this color in colors.xml
                break;
            case "PurpleShooting":
                starColor = getResources().getColor(R.color.purple_shooting_star); // Define this color in colors.xml
                break;
            case "SilverShooting":
                starColor = getResources().getColor(R.color.silver_shooting_star); // Define this color in colors.xml
                break;
            case "Red":
                starColor = getResources().getColor(R.color.red_star); // Define this color in colors.xml
                break;
            case "RedShooting":
                starColor = getResources().getColor(R.color.red_shooting_star); // Define this color in colors.xml
                break;
            // Add other cases for different colors based on your needs
            default:
                starColor = getResources().getColor(R.color.default_star_color); // Fallback color
                break;
        }
        feedbackstar.setColorFilter(starColor, PorterDuff.Mode.SRC_IN);
        feedbackstar.setVisibility(View.VISIBLE);
    }

}
