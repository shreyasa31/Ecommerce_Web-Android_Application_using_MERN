package com.example.ebayshoppingapplictaion;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
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
    private TextView text1,text2;
    private LinearLayout linearLayout;
//    private ProgressBar progressBar;
    private TextView noResultsTextView;
//    private TextView searchProductsText;
    private WishlistAdapter adapter;
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_wishlist, container, false);
        recyclerView = view.findViewById(R.id.recyclerView);
//        progressBar = view.findViewById(R.id.progressBar);
//        searchProductsText = view.findViewById(R.id.searchProductsText);
        noResultsTextView=view.findViewById(R.id.noResultsTextView);
        linearLayout=view.findViewById(R.id.linearlayout);
        text1=view.findViewById(R.id.text1);
        text2=view.findViewById(R.id.text2);

        // Initially, show the progress bar and hide the text view
//        progressBar.setVisibility(View.VISIBLE);
//        searchProductsText.setVisibility(View.VISIBLE);
        setupRecyclerView(); // Initialize the RecyclerView and adapter here
        fetchWishlistItems(); // Then fetch the wishlist items
        return view;
    }
    private void updateWishlistSummary() {
        Log.d("WishlistFragmenttttttttt", "Updating wishlist summary");
        int totalCount = wishlistItems.size();
        double totalPrice = 0;
        for (WishlistItem item : wishlistItems) {
            try {
                // Remove any currency symbols or commas before parsing
                String priceString = item.getPrice().replaceAll("[^\\d.]+", "");
                totalPrice += Double.parseDouble(priceString);
            } catch (NumberFormatException e) {
                Log.e("WishlistFragment", "Error parsing price for item: " + item.getTitle(), e);
            }
        }
     Log.d("counttttt","bhbhb"+totalCount);
        Log.d("price","bhbhb"+totalPrice);
        // Update the TextViews
        text1.setText("Wishlist Total(" + totalCount+"items)");
        text2.setText("$" + String.format("%.2f", totalPrice));
    }

    public void onResume() {
        super.onResume();
        fetchWishlistItems(); // Refresh wishlist data when returning to the fragment
    }
    private void fetchWishlistItems() {
        String url = "http://10.0.2.2:8080/getWishlist";
        Log.d("wishlistgetapi", "apiiiiiiiii" + url);
//        progressBar.setVisibility(View.VISIBLE); // Show the progress bar when fetching begins
//        searchProductsText.setVisibility(View.VISIBLE);
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
                                linearLayout.setVisibility(View.GONE);
                            } else {
                                recyclerView.setVisibility(View.VISIBLE); // Show RecyclerView
                                linearLayout.setVisibility(View.VISIBLE);
                                noResultsTextView.setVisibility(View.GONE); // Hide no results text
                                adapter.notifyDataSetChanged(); // Notify the adapter
                                updateWishlistSummary();
                            }


                        } catch (Exception e) {
                            e.printStackTrace();
                            // Handle the error
                        }
//                        finally {
//                            progressBar.setVisibility(View.GONE); // Hide the progress bar when fetching is complete
//                            searchProductsText.setVisibility(View.GONE);
//                        }
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


//    public void onItemDelete(int position, WishlistItem item) {
//        // Remove the item from MongoDB
//        // Example: MongoDB.deleteItem(item.getItemId());
//        String removeFromWishlistUrl = "http://10.0.2.2:8080/deleteWishlist?"; // Replace with your actual API endpoint
//
//        // Construct the request URL with query parameters
//        Uri.Builder builder = Uri.parse(removeFromWishlistUrl).buildUpon();
//        builder.appendQueryParameter("itemID", item.getProductUrl());
//
//        String urlWithParams = builder.build().toString();
//        Log.d("deletewishlistttttttt", "URL: " + urlWithParams);
//        RequestQueue queue = Volley.newRequestQueue(this);
//
//        // Using StringRequest instead of JsonObjectRequest
//        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, urlWithParams,
//                response -> {
//                    // Handle successful response
//                    item.setInWishlist(false);
//                    position = wishlistItems.indexOf(item);
//                    Toast.makeText(this, trimmedTitle(item.getTitle())+"was removed from wishlist", Toast.LENGTH_SHORT).show();
//                    adapter.notifyItemChanged(position);
//                    Log.d("ProductResults", "Item removed from wishlist");
//                },
//                error -> {
//                    // Handle error
//                    Log.e("ProductResults", "Error removing item from wishlist: " + error.getMessage());
//                });
//
//        queue.add(stringRequest);
//        // Remove from the adapter's data source
//        wishlistItems.remove(position);
//        adapter.notifyItemRemoved(position);
//    }
    private String trimmedTitle(String title) {
        int maxLength = 20; // Define the maximum length of the title
        if (title.length() > maxLength) {
            return title.substring(0, maxLength) + "...";
        } else {
            return title;
        }
    }
    @Override
//    public void onItemDelete(int position, WishlistItem item) {
//        String removeFromWishlistUrl = "http://10.0.2.2:8080/deleteWishlist"; // Your API endpoint
//
//        // Construct the request URL with query parameters
//        Uri.Builder builder = Uri.parse(removeFromWishlistUrl).buildUpon();
//        builder.appendQueryParameter("itemID", item.getProductUrl());
//
//        String urlWithParams = builder.build().toString();
//        Log.d("DeleteWishlistttttttttttttttt", "URL: " + urlWithParams);
//
//        RequestQueue queue = Volley.newRequestQueue(getActivity()); // Use getActivity() in Fragment
//
//        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, urlWithParams,
//                response -> {
//                    // Handle successful response
//                    Log.d("DeleteWishlist", "Item removed from wishlist: " + item.getTitle());
//                    Toast.makeText(getActivity(), trimmedTitle(item.getTitle()) + " was removed from wishlist", Toast.LENGTH_SHORT).show();
//
//                    // Update list and adapter
//                    wishlistItems.remove(position);
//                    adapter.notifyItemRemoved(position);
//
//
//                },
//                error -> {
//                    // Handle error
//                    Log.e("DeleteWishlist", "Error removing item from wishlist: " + error.getMessage());
//                    Toast.makeText(getActivity(), "Error removing item from wishlist", Toast.LENGTH_SHORT).show();
//                });
//
//        queue.add(stringRequest);
//    }

    public void onItemDelete(int position, WishlistItem item) {
        String removeFromWishlistUrl = "http://10.0.2.2:8080/deleteWishlist"; // Your API endpoint

        // Construct the request URL with query parameters
        Uri.Builder builder = Uri.parse(removeFromWishlistUrl).buildUpon();
        builder.appendQueryParameter("itemID", item.getProductUrl());

        String urlWithParams = builder.build().toString();
        Log.d("DeleteWishlistttttttttttttttt", "URL: " + urlWithParams);

        RequestQueue queue = Volley.newRequestQueue(getActivity()); // Use getActivity() in Fragment

        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, urlWithParams,
                response -> {
                    // Handle successful response
                    Log.d("DeleteWishlist", "Item removed from wishlist: " + item.getTitle());
                    Toast.makeText(getActivity(), trimmedTitle(item.getTitle()) + " was removed from wishlist", Toast.LENGTH_SHORT).show();
                },
                error -> {
                    // Handle error
                    Log.e("DeleteWishlist", "Error removing item from wishlist: " + error.getMessage());
                    Toast.makeText(getActivity(), "Error removing item from wishlist", Toast.LENGTH_SHORT).show();
                });

        queue.add(stringRequest);

        // Create a list of items to be removed
        List<WishlistItem> itemsToRemove = new ArrayList<>();
        itemsToRemove.add(item);

        // Remove the items from the list
        wishlistItems.removeAll(itemsToRemove);

        adapter.notifyDataSetChanged();
        updateWishlistSummary();

        // Check if wishlistItems is empty
        if (wishlistItems.isEmpty()) {
            noResultsTextView.setVisibility(View.VISIBLE); // Show no results text
            linearLayout.setVisibility(View.GONE);
            recyclerView.setVisibility(View.GONE); // Hide RecyclerView
        }
    }


}
