package com.example.ebayshoppingapplictaion;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class SimilarFragment extends Fragment {
    private RecyclerView recyclerView;
    private SimilarItemAdapter adapter;
    private List<SimilarItem> similarItems = new ArrayList<>();

        // Required empty public constructor
        private static final String ARG_ITEM_ID = "itemId";
        private String itemId;

        public static SimilarFragment newInstance(String itemId) {
            SimilarFragment fragment = new SimilarFragment();
            Bundle args = new Bundle();
            args.putString(ARG_ITEM_ID, itemId);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            if (getArguments() != null) {
                itemId = getArguments().getString(ARG_ITEM_ID);
            }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_similar, container, false);
        recyclerView = view.findViewById(R.id.recyclerViewSimilar);
        recyclerView.setLayoutManager(new LinearLayoutManager(view.getContext()));

        // Initialize the adapter with the empty list
        adapter = new SimilarItemAdapter(getContext(), similarItems);
        recyclerView.setAdapter(adapter); // Attach the adapter to RecyclerView

        fetchSimilarItems();

        return view;

    }
    private void fetchSimilarItems() {
        String url = "http://10.0.2.2:8080/getSimilarItems?itemID=" + itemId; // Replace with your actual API URL
        Log.d("SimilarFragmenttttt", "Sendingggggggg SimilarProduct request to URL: " + url);
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.d("SimilarFragment", "Response received");
                        parseItems(response);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("SimilarFragment", "Error: " + error.toString());
            }
        });

        Volley.newRequestQueue(getContext()).add(jsonArrayRequest);
    }

    private void parseItems(JSONArray itemsArray) {
        try {
            Log.d("SimilarFragment", "Parsing items");
            similarItems.clear();

            for (int i = 0; i < itemsArray.length(); i++) {
                JSONObject itemObject = itemsArray.getJSONObject(i);
                String itemId = itemObject.getString("itemId");
                String title = itemObject.getString("title");
                String image = itemObject.getString("image");
                String price = itemObject.getString("price");
                String shippingCost = itemObject.getString("shippingCost");
                String timeLeft = itemObject.getString("timeLeft");
                String viewItemURL = itemObject.getString("viewItemURL");

                SimilarItem item = new SimilarItem(itemId, title, image, price, shippingCost, timeLeft, viewItemURL);
                similarItems.add(item);

                Log.d("SimilarFragment", "Item " + i + ": " + title + ", " + price);
            }

            adapter.notifyDataSetChanged();

        } catch (Exception e) {
            e.printStackTrace();
            Log.e("SimilarFragment", "Error parsing JSON", e);
        }}
}