package com.example.ebayshoppingapplictaion;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;


public class ShippingFragment extends Fragment {


    // Static factory method to create a new instance of the fragment
    private static final String ARG_ITEM_ID = "itemId";
    private String itemId;

    private TextView storename,feedbackscore,popularity,feedbackstar,shippingcost,globalshipping,handlingtime,policy,returnswithin,refundmode,shippedby;

    // Static factory method to create a new instance of the fragment
    public static ShippingFragment newInstance(String itemId) {
        ShippingFragment fragment = new ShippingFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ITEM_ID, itemId);
        fragment.setArguments(args);
        return fragment;
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            itemId = getArguments().getString(ARG_ITEM_ID);

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

                    Item item = new Item(storeName, storeURL, feedbackScore, positiveFeedbackPercent, feedbackRatingStar, globalShipping, handlingTime, refund, returnsWithin, shippingCostPaidBy);
                    updateUI(item);

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
        storename.setText(item.getStoreName());
        feedbackscore.setText(String.valueOf(item.getFeedbackScore()));
        popularity.setText(String.format("%.1f%%", item.getPositiveFeedbackPercent()));
        feedbackstar.setText(item.getFeedbackRatingStar());
        globalshipping.setText(item.isGlobalShipping() ? "Yes" : "No");
        handlingtime.setText(item.getHandlingTime() + " days");
        policy.setText(item.getRefund());
        returnswithin.setText(item.getReturnsWithin());
        refundmode.setText(item.getRefund());
        shippedby.setText(item.getShippingCostPaidBy());

        if (getActivity() != null) {
            Intent intent = getActivity().getIntent();
            String shippingCostValue = intent.getStringExtra("shippingCost");
            shippingcost.setText(shippingCostValue != null ? shippingCostValue : "Not Available");
        }

        storename.setOnClickListener(v -> {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(item.getStoreURL()));
            startActivity(browserIntent);
        });
    }


}