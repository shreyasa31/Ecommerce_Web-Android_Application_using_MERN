package com.example.ebayshoppingapplictaion;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class WishlistFragment extends Fragment implements WishlistAdapter.OnItemClickListener {

    private RecyclerView recyclerView;
    private ProgressBar progressBar;
    private TextView noResultsTextView;
    private TextView searchProductsText;
    private WishlistAdapter adapter;
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_wishlist, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
        progressBar = view.findViewById(R.id.progressBar);
        searchProductsText = view.findViewById(R.id.searchProductsText);
        noResultsTextView=view.findViewById(R.id.noResultsTextView);
        // Initially, show the progress bar and hide the text view
        progressBar.setVisibility(View.VISIBLE);
        searchProductsText.setVisibility(View.VISIBLE);
        setupRecyclerView(); // Initialize the RecyclerView and adapter here
        fetchWishlistItems(); // Then fetch the wishlist items
        return view;
    }

    private void fetchWishlistItems() {
        String url = "http://10.0.2.2:8080/getWishlist";
        Log.d("wishlistgetapi", "apiiiiiiiii" + url);
        progressBar.setVisibility(View.VISIBLE); // Show the progress bar when fetching begins
        searchProductsText.setVisibility(View.VISIBLE);
        StringRequest request = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {

                        Log.d("APIResponseeeeeeee", "Response: " + response);
                        try {
                            JSONArray jsonArray = new JSONArray(response);
                            wishlistItems.clear(); // Clear the list before adding new items

                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject jsonObject = jsonArray.getJSONObject(i);
                                WishlistItem newItem = new WishlistItem(
                                        jsonObject.getString("image"),
                                        jsonObject.getString("title"),
                                        jsonObject.getString("location"), // Assuming this is the zipcode
                                        jsonObject.getString("shipping"), // Assuming this is the shippingType
                                        jsonObject.getString("condition"),
                                        jsonObject.getString("price"),
                                        jsonObject.getString("productId") // Assuming this is the itemId
                                );

                                wishlistItems.add(newItem);
                                Log.d("responseeeee","thijgdw"+wishlistItems);
                            }
//                            recyclerView.setVisibility(View.VISIBLE);
//                            adapter.notifyDataSetChanged(); // Notify the adapter
                            if (wishlistItems.isEmpty()) {
                                noResultsTextView.setVisibility(View.VISIBLE); // Show no results text
                                recyclerView.setVisibility(View.GONE); // Hide RecyclerView
                            } else {
                                recyclerView.setVisibility(View.VISIBLE); // Show RecyclerView
                                noResultsTextView.setVisibility(View.GONE); // Hide no results text
                                adapter.notifyDataSetChanged(); // Notify the adapter
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            // Handle the error
                        }
                        finally {
                            progressBar.setVisibility(View.GONE); // Hide the progress bar when fetching is complete
                            searchProductsText.setVisibility(View.GONE);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // Handle the error
            }
        });

        Volley.newRequestQueue(requireContext()).add(request);


}

    private void setupRecyclerView() {
//        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
//        adapter = new WishlistAdapter(wishlistItems, this);
//        recyclerView.setAdapter(adapter);
        int numberOfColumns = 2; // Number of grid columns
        recyclerView.setLayoutManager(new GridLayoutManager(getContext(), numberOfColumns));
        adapter = new WishlistAdapter(wishlistItems, this);
        recyclerView.setAdapter(adapter);
    }

    @Override
    public void onItemDelete(int position, WishlistItem item) {
        // Remove the item from MongoDB
        // Example: MongoDB.deleteItem(item.getItemId());

        // Remove from the adapter's data source
        wishlistItems.remove(position);
        adapter.notifyItemRemoved(position);
    }
}
