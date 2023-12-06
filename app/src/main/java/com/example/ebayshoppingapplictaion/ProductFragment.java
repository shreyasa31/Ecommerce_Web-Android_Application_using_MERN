package com.example.ebayshoppingapplictaion;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ProductFragment extends Fragment {
    private static final String ARG_ITEM_ID = "itemId";
    private String itemId;

    private String ShippingType;
    private ViewPager2 imageViewPager;
    private RecyclerView specificationsRecyclerView;

    // Static factory method to create a new instance of the fragment
    public static ProductFragment newInstance(String itemId,String ShippingType) {
        ProductFragment fragment = new ProductFragment();
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
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_product, container, false);
        imageViewPager = view.findViewById(R.id.imageViewPager);
        specificationsRecyclerView = view.findViewById(R.id.specificationsRecyclerView);


        if (itemId != null) {
            fetchEbayItem(itemId, getContext(), this::onItemsFetched, this::onError);
        }
        return view;
    }

    private void fetchEbayItem(String itemID, Context context, Response.Listener<ProductItem> listener, Response.ErrorListener errorListener) {
        String url = "http://10.0.2.2:8080/getItem?ItemID=" + itemID;
        Log.d("ProductFragment", "Fetching item from URL: " + url);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    ProductItem item = parseEbayItem(response);
                    listener.onResponse(item);

                },
                error -> {
                    errorListener.onErrorResponse(error);
                });

        RequestQueue queue = Volley.newRequestQueue(context);
        queue.add(jsonObjectRequest);
    }

    private ProductItem parseEbayItem(JSONObject response) {
        try {
            String id = response.getString("id");
            String title = response.getString("title");
            JSONArray photosJson = response.getJSONArray("photo");
            ArrayList<String> photo = new ArrayList<>();
            for (int i = 0; i < photosJson.length(); i++) {
                photo.add(photosJson.getString(i));
                Log.d("imagesssssssssss","gdhwgjhfw"+photo);
            }
            String price = response.getString("price");
            String brand = response.getString("brand");
            Log.d("imagesssssssssss","gdhwgjhfw"+photo);
            JSONArray specificsJson = response.getJSONArray("itemSpecifics");
            ArrayList<ProductItem.ItemSpecific> itemSpecifics = new ArrayList<>();
            for (int i = 0; i < specificsJson.length(); i++) {
                JSONObject specificJson = specificsJson.getJSONObject(i);
                String value = specificJson.getString("value");
                itemSpecifics.add(new ProductItem.ItemSpecific(value));
                Log.d("itemSpecificsssssssss","gdhwgjhfw"+value);
            }

            return new ProductItem(id, title, photo, price, brand, itemSpecifics);
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }


    private void onItemsFetched(ProductItem item) {
        // Handle fetched item, update UI
        // Set up ViewPager for images
//        Activity activity = getActivity();
//        if (activity != null) {
//            ProgressBar progressBar = activity.findViewById(R.id.progressBar);
//            TextView loadingText = activity.findViewById(R.id.searchProductsText);
//            progressBar.setVisibility(View.GONE);
//            loadingText.setVisibility(View.GONE);
//        }
        Activity activity = getActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                ProgressBar progressBar = activity.findViewById(R.id.progressBar);
                TextView loadingText = activity.findViewById(R.id.searchProductsText);
                if (progressBar != null && loadingText != null) {
                    progressBar.setVisibility(View.GONE);
                    loadingText.setVisibility(View.GONE);
                }
            });
        }
        ImageAdapter imageAdapter = new ImageAdapter(getContext(), item.getPhotos());
        imageViewPager.setAdapter(imageAdapter);

        // Set up RecyclerView for item specifics
        ItemSpecificsAdapter specificsAdapter = new ItemSpecificsAdapter(item.getItemSpecifics());
        specificationsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        specificationsRecyclerView.setAdapter(specificsAdapter);

        // Set text views for title, price, etc.
        TextView titleTextView = getView().findViewById(R.id.productTitleTextView);
        titleTextView.setText(item.getTitle());
        TextView priceTextView = getView().findViewById(R.id.productPriceTextView);
        TextView priceTextView2 = getView().findViewById(R.id.highlight1TextView);
        TextView brandTextView = getView().findViewById(R.id.highlight2TextView); // Make sure this ID exists in your layout
        priceTextView.setText(item.getPrice()+" "+"with"+" "+ShippingType+" "+"shipping");
        brandTextView.setText("Brand"+"\t\t"+item.getBrand());
        priceTextView2.setText("Price"+"\t\t"+item.getPrice());

    }

    private void onError(VolleyError error) {
        // Handle error
        Log.e("ProductFragment", "Error fetching item: " + error.getMessage());
        Toast.makeText(getContext(), "Error fetching data", Toast.LENGTH_SHORT).show();
    }
}
