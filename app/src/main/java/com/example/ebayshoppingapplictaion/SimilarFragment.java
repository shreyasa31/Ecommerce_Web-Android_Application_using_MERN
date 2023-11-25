package com.example.ebayshoppingapplictaion;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

//
public class SimilarFragment extends Fragment {
//    private RecyclerView recyclerView;
//    private SimilarItemAdapter adapter;
//    private List<SimilarItem> similarItems = new ArrayList<>();
//
//        // Required empty public constructor
//        private static final String ARG_ITEM_ID = "itemId";
//        private String itemId;
//
//        public static SimilarFragment newInstance(String itemId) {
//            SimilarFragment fragment = new SimilarFragment();
//            Bundle args = new Bundle();
//            args.putString(ARG_ITEM_ID, itemId);
//            fragment.setArguments(args);
//            return fragment;
//        }
//
//        @Override
//        public void onCreate(Bundle savedInstanceState) {
//            super.onCreate(savedInstanceState);
//
//            if (getArguments() != null) {
//                itemId = getArguments().getString(ARG_ITEM_ID);
//            }
//    }
//
//    @Override
//    public View onCreateView(LayoutInflater inflater, ViewGroup container,
//                             Bundle savedInstanceState) {
//        // Inflate the layout for this fragment
//        View view = inflater.inflate(R.layout.fragment_similar, container, false);
//        recyclerView = view.findViewById(R.id.recyclerViewSimilar); // Ensure you have a RecyclerView with this ID in your layout
//        recyclerView.setLayoutManager(new LinearLayoutManager(view.getContext()));
//
//        fetchSimilarItems();
//
//        return view;
//
//    }
//    private void fetchSimilarItems() {
//        String url = "http://10.0.2.2:8080/getSimilarItems?itemID=" + itemId; // Replace with your actual API URL
//
//        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
//                new Response.Listener<JSONObject>() {
//                    @Override
//                    public void onResponse(JSONObject response) {
//                        parseItems(response);
//                    }
//                }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                // Handle error
//            }
//        });
//
//        Volley.newRequestQueue(getContext()).add(jsonObjectRequest);
//    }
//
//    private void parseItems(JSONObject response) {
//        try {
//            JSONArray itemsArray = response.getJSONArray("items"); // Adjust according to your JSON structure
//            for (int i = 0; i < itemsArray.length(); i++) {
//                JSONObject itemObject = itemsArray.getJSONObject(i);
//
//                SimilarItem item = new SimilarItem(
//                        itemObject.getString("itemId"),
//                        itemObject.getString("title"),
//                        itemObject.getString("image"),
//                        itemObject.getString("price"),
//                        itemObject.getString("shippingCost"),
//                        itemObject.getString("timeLeft"),
//                        itemObject.getString("viewItemURL") // Add more fields as needed
//                );
//
//                similarItems.add(item);
//            }
//
//            adapter = new SimilarItemAdapter(getContext(), similarItems);
//            recyclerView.setAdapter(adapter);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            // Handle exception
//        }
//    }
}