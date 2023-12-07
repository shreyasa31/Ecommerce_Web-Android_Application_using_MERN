package com.example.ebayshoppingapplictaion;

import android.app.Activity;
import android.os.Bundle;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import java.io.IOException;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.LinearLayoutManager;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

public class PhotosFragment extends Fragment {

    private static final String ARG_KEYWORD = "keyword";
    private String keyword;
    private RecyclerView recyclerView;
    private ImageCardAdapter imageCardAdapter;
    private List<String> imageUrls = new ArrayList<>();

    public PhotosFragment() {
        // Required empty public constructor
    }

    public static PhotosFragment newInstance(String keyword) {
        PhotosFragment fragment = new PhotosFragment();
        Bundle args = new Bundle();
        args.putString(ARG_KEYWORD, keyword);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            keyword = getArguments().getString(ARG_KEYWORD);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_photos, container, false);
        recyclerView = view.findViewById(R.id.recyclerViewPhotos);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        imageCardAdapter = new ImageCardAdapter(imageUrls);
        recyclerView.setAdapter(imageCardAdapter);

        fetchImages();
        return view;
    }

    private void fetchImages() {
        String url = "http://10.0.2.2:8080/googlesearch?q=" + keyword; // Use keyword here
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(url).build();
        Log.d("PhotosFragmenttttttttt", "Sendingggggggg request to URL: " + url);
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    final String responseData = response.body().string();
                    getActivity().runOnUiThread(() -> {
                        try {
                                                            // Example of parsing a JSON array response
                            JSONArray jsonArray = new JSONArray(responseData);
                            for (int i = 0; i < jsonArray.length(); i++) {
                                String imageUrl = jsonArray.getString(i);
                                imageUrls.add(imageUrl);
                            }
                            imageCardAdapter.notifyDataSetChanged();
//                            Activity activity = getActivity();
//                            if (activity != null) {
//                                ProgressBar progressBar = activity.findViewById(R.id.progressBar);
//                                TextView loadingText = activity.findViewById(R.id.searchProductsText);
//                                progressBar.setVisibility(View.GONE);
//                                loadingText.setVisibility(View.GONE);
//                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                                                            // Handle JSON parsing error
                        }
                    });
                }}

            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                // Handle failure
            }
        });
    }

    // ImageCardAdapter and ViewHolder class implementation
}
