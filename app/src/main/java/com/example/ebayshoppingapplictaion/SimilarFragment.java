package com.example.ebayshoppingapplictaion;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


public class SimilarFragment extends Fragment {
    private RecyclerView recyclerView;
    private Spinner myspinner1,myspinner2;
    private SimilarItemAdapter adapter;
    private List<SimilarItem> similarItems = new ArrayList<>();
    private List<SimilarItem> originalItems = new ArrayList<>();



    // Required empty public constructor
        private static final String ARG_ITEM_ID = "itemId";
        private String itemId;
        private TextView noRecordsTextView;

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
        myspinner1=view.findViewById(R.id.spinner1);
        myspinner2=view.findViewById(R.id.spinner2);
        noRecordsTextView = view.findViewById(R.id.noRecordsTextView);
        // Initialize the adapter with the empty list
        adapter = new SimilarItemAdapter(getContext(), similarItems);
        recyclerView.setAdapter(adapter); // Attach the adapter to RecyclerView
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getActivity(),
                R.array.spinner_items1, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        myspinner1.setAdapter(adapter);
        ArrayAdapter<CharSequence> adapter1 = ArrayAdapter.createFromResource(getActivity(),
                R.array.spinner_items2, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        myspinner2.setAdapter(adapter1);

        myspinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position == 0) { // Assuming the default item is at position 0
                    myspinner2.setEnabled(false);
                    resetToOriginalList();
                } else {
                    myspinner2.setEnabled(true);
                    sortItems();
                }
            }


            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                myspinner2.setEnabled(false);
            }
        });

// Listener for myspinner2
        myspinner2.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (myspinner1.getSelectedItemPosition() != 0) {
                    sortItems(); // Only sort if default is not selected in myspinner1
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });
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
                        checkForEmptyList();
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
            originalItems.clear();

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
                originalItems.add(item);

                Log.d("SimilarFragment", "Item " + i + ": " + title + ", " + price);
            }

            adapter.notifyDataSetChanged();

        } catch (Exception e) {
            e.printStackTrace();
            Log.e("SimilarFragment", "Error parsing JSON", e);
        }}
    private void checkForEmptyList() {
        if (similarItems.isEmpty()) {
            noRecordsTextView.setVisibility(View.VISIBLE);
        } else {
            noRecordsTextView.setVisibility(View.GONE);
        }
    }
    private void sortItems() {
        String criteria = myspinner1.getSelectedItem().toString();
        String order = myspinner2.getSelectedItem().toString();

        Comparator<SimilarItem> comparator;

        switch (criteria) {
            case "Name":
                comparator = Comparator.comparing(SimilarItem::getTitle);
                break;
            case "Price":
                comparator = Comparator.comparingDouble(item -> Double.parseDouble(item.getPrice()));
                break;
            case "Days":
//                comparator = Comparator.comparingInt(item -> getDays(item.getTimeLeft()));
//                comparator = (item1, item2) -> Integer.compare(getDays(item2.getTimeLeft()), getDays(item1.getTimeLeft()));
                comparator = Comparator.comparingInt(item -> getDays(item.getTimeLeft()));
                if (order.equals("Descending")) {
                    comparator = comparator.reversed();
                }
                break;
            default:
                return; // If no valid criteria is selected, return without sorting.
        }

        if (!criteria.equals("Days") && order.equals("Descending")) {
            comparator = comparator.reversed();
        }
        Collections.sort(similarItems, comparator);
        adapter.notifyDataSetChanged();
    }

    private int getDays(String timeLeft) {
        try {
            // Assuming timeLeft is in the format "X days"
            String[] parts = timeLeft.split(" ");
            if (parts.length >= 2) {
                return Integer.parseInt(parts[0]); // Extract the numeric part
            }
        } catch (NumberFormatException e) {
            Log.e("SimilarFragment", "Error parsing days from timeLeft", e);
        }
        return 0; // Default to 0 if parsing fails
    }
    private void resetToOriginalList() {
        similarItems.clear();
        similarItems.addAll(originalItems); // Reset to original data
        adapter.notifyDataSetChanged(); // Notify the adapter
    }


}