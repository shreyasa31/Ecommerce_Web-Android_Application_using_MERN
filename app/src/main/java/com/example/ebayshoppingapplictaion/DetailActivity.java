package com.example.ebayshoppingapplictaion;

import static com.example.ebayshoppingapplictaion.SimilarItemAdapter.clearPicassoCache;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.CallbackManager;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.facebook.FacebookSdk;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.concurrent.locks.Condition;

public class DetailActivity extends AppCompatActivity   {
//    implements TabsViewAdapter.OnContentLoadedListener
    private TextView toolbarTitle;
    private ImageView toolbarImage;
    private TabLayout tabLayout;
    private ViewPager2 viewPager;
    private TabsViewAdapter tabsViewAdapter;
    private ProgressBar progressBar;
    private TextView loadingText;
    private ImageButton cart;
    private boolean isInWishlist = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        clearPicassoCache(this);
        setContentView(R.layout.activity_detail);
        viewPager = findViewById(R.id.viewPager1);
        cart=findViewById(R.id.cartButton);
        String keyword = getIntent().getStringExtra("keyword");
        String itemId=getIntent().getStringExtra("itemId");
        String ShippingType=getIntent().getStringExtra("ShippingType");
        String price=getIntent().getStringExtra("price");
        String condition=getIntent().getStringExtra("condition");
        String title=getIntent().getStringExtra("title");
        String image=getIntent().getStringExtra("image");
        String zipcode=getIntent().getStringExtra("zipcode");
        progressBar = findViewById(R.id.progressBar);
        loadingText = findViewById(R.id.searchProductsText);
        progressBar.setVisibility(View.VISIBLE);
        loadingText.setVisibility(View.VISIBLE);
        loadData();
        Log.d("DetailActivity", "Keywordddddddddddddddddd: " + itemId);

//        // Create a new instance of PhotosFragment with the keyword
//        PhotosFragment photosFragment = PhotosFragment.newInstance(keyword);
//
//        // Add the fragment to the activity's layout
//        getSupportFragmentManager().beginTransaction()
//                .replace(R.id.fragment_container, photosFragment)
//                .commit();

        tabsViewAdapter = new TabsViewAdapter(this,keyword,itemId,ShippingType);
        viewPager.setAdapter(tabsViewAdapter);


        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Enable the Up button
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // Find the TextView and ImageView
        toolbarTitle = findViewById(R.id.toolbarTitle);
        toolbarImage = findViewById(R.id.toolbarImage);
        toolbarImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    shareProductOnFacebook();
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        });

        // Hide the default title to use the custom one
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        // Set the title and image
        String productTitle = getIntent().getStringExtra("title");
        toolbarTitle.setText(productTitle); // Set the custom title
        // Set the image resource for the ImageView if needed
         toolbarImage.setImageResource(R.drawable.facebook1);
        toolbarImage.setColorFilter(Color.WHITE, PorterDuff.Mode.SRC_IN);
        // Set image size
        float density = getResources().getDisplayMetrics().density;
        int width = (int)(45 * density);
        int height = (int)(45 * density);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(width, height);
        toolbarImage.setLayoutParams(params);

         tabLayout = findViewById(R.id.tabLayout);
        LayoutInflater inflater = LayoutInflater.from(this);

        toolbar.setTitleTextAppearance(this, R.style.ToolbarTitleStyle);


        tabLayout.setBackgroundColor(ContextCompat.getColor(this, R.color.navy_blue));

        // Set tab text colors and indicator color
        int tabSelectedColor = ContextCompat.getColor(this, R.color.white);
        int tabUnselectedColor = ContextCompat.getColor(this, R.color.tabTextColor);
        int tabIndicatorColor = ContextCompat.getColor(this, R.color.tabIndicatorColor); // Make sure you have this color defined

        tabLayout.setTabTextColors(tabUnselectedColor, tabSelectedColor);
        tabLayout.setSelectedTabIndicatorColor(tabIndicatorColor);




        String[] tabTitles = new String[]{"Product", "Shipping", "Photos", "Similar"};
        int[] imageResIds = new int[]{R.drawable.information_variant, R.drawable.truck_delivery, R.drawable.google, R.drawable.equal};

        for (int i = 0; i < tabTitles.length; i++) {
            TabLayout.Tab tab = tabLayout.newTab();
            View tabView = inflater.inflate(R.layout.custom_tab, null);

            TextView tabText = tabView.findViewById(R.id.tab_text);
            ImageView tabIcon = tabView.findViewById(R.id.tab_icon);

            tabText.setText(tabTitles[i]);
            tabIcon.setImageResource(imageResIds[i]);
            tabText.setTextColor(i == 0 ? tabSelectedColor : tabUnselectedColor); // Set the first tab as selected by default
            tabIcon.setColorFilter(i == 0 ? tabSelectedColor : tabUnselectedColor, PorterDuff.Mode.SRC_IN);
            tab.setCustomView(tabView);
            tabLayout.addTab(tab);
        }
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {

                View customView = tab.getCustomView();
                if (customView != null) {
                    TextView tabText = customView.findViewById(R.id.tab_text);
                    ImageView tabIcon = customView.findViewById(R.id.tab_icon);
                    tabText.setTextColor(tabSelectedColor);
                    tabIcon.setColorFilter(tabSelectedColor, PorterDuff.Mode.SRC_IN);
                    viewPager.setCurrentItem(tab.getPosition());
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

                View customView = tab.getCustomView();
                if (customView != null) {
                    TextView tabText = customView.findViewById(R.id.tab_text);
                    ImageView tabIcon = customView.findViewById(R.id.tab_icon);
                    tabText.setTextColor(tabUnselectedColor);
                    tabIcon.setColorFilter(tabUnselectedColor, PorterDuff.Mode.SRC_IN);
                }

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
            }
        });

//here u insert progress old code

        cart.setOnClickListener(new View.OnClickListener() {

            @Override

            public void onClick(View v) {
                Log.d("cehcllkkkkkkkkkkkS","wefgw"+isInWishlist);
                if(!isInWishlist) {
                    Log.d("if its trueeeeeeeeeeeeeeeeeee","wefgw"+isInWishlist);
                    addToWishlist(itemId, title, image, price, zipcode, condition, ShippingType);

                } else {
                    Log.d("if its falseeeeeeeeeee","wefgw"+isInWishlist);
                    removeFromWishlist(itemId,title); // You'll need to implement this

                }
            }
        });

    }
//    public void onContentLoaded() {
//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                progressBar.setVisibility(View.GONE);
//                loadingText.setVisibility(View.GONE);
//            }
//        });
//    }
private void loadData() {
    // Replace this with your actual data loading logic
    new Thread(new Runnable() {
        @Override
        public void run() {
            // Simulate a task by sleeping for 3 seconds
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            // Once data loading is complete, hide the ProgressBar
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.setVisibility(View.GONE);
                    loadingText.setVisibility(View.GONE);
                }
            });
        }
    }).start();
}

    private String trimmedTitle(String title) {
        int maxLength = 20; // Define the maximum length of the title
        if (title.length() > maxLength) {
            return title.substring(0, maxLength) + "...";
        } else {
            return title;
        }
    }
    private void addToWishlist(String itemId, String title, String image, String price, String zipcode, String condition, String shippingType) {
        String baseUrl = "http://10.0.2.2:8080/addToWishlist?"; // Replace with your actual API URL
        //... rest of your method
        Uri.Builder builder = Uri.parse(baseUrl).buildUpon();
        builder.appendQueryParameter("ItemID", itemId);
        builder.appendQueryParameter("image", image);
        builder.appendQueryParameter("title", title);
        builder.appendQueryParameter("location", zipcode);
        builder.appendQueryParameter("shipping", shippingType);
        builder.appendQueryParameter("condition",condition );
        builder.appendQueryParameter("price", price);
        String urlWithParams = builder.build().toString();
        Log.d("wishlistttttttttttttttttttttt", "URL: " + urlWithParams);
        RequestQueue queue = Volley.newRequestQueue(this);
        isInWishlist = true;
        updateCartIcon();
        Toast.makeText(this, trimmedTitle(title)+"was added to wishlist", Toast.LENGTH_SHORT).show();
        StringRequest stringRequest = new StringRequest(Request.Method.GET, urlWithParams,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Handle the response (assuming it's a string)
                        Log.d("dwgfehqdjksldjf","eyfgywefhwjf");
                        isInWishlist = true;
                        Log.d("inside addwishlisttttttttt", "wefgw" + isInWishlist);
                        runOnUiThread(() -> updateCartIcon());
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // Handle error
                Log.e("ProductResults", "Error: " + error.getMessage());
            }
        });

        queue.add(stringRequest);
    }

    private void removeFromWishlist(String itemId,String title) {
        String removeFromWishlistUrl = "http://10.0.2.2:8080/deleteWishlist?"; // Replace with your actual API endpoint
        //... rest of your method
        Uri.Builder builder = Uri.parse(removeFromWishlistUrl).buildUpon();
        builder.appendQueryParameter("itemID", itemId);

        String urlWithParams = builder.build().toString();
        Log.d("deletewishlistttttttt", "URL: " + urlWithParams);
        RequestQueue queue = Volley.newRequestQueue(this);

        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, urlWithParams,
                response -> {
                    isInWishlist = false;

                    runOnUiThread(() -> updateCartIcon());
                    Toast.makeText(this, trimmedTitle(title)+"was removed from wishlist", Toast.LENGTH_SHORT).show();
                },
                error -> {
                    Log.e("ProductResults", "Error removing item from wishlist: " + error.getMessage());
                });

        queue.add(stringRequest);
    }

    private void updateCartIcon() {
        if(isInWishlist) {
            cart.setImageResource(R.drawable.cart_remove1); // set your cart_remove icon here
        } else {
            cart.setImageResource(R.drawable.cart_plus1); // set your cart_add icon here
        }
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
//
        private void shareProductOnFacebook() throws JSONException {
            ShareDialog shareDialog = new ShareDialog(this);
            String productUrlArrayString = getIntent().getStringExtra("productUrl");
            JSONArray jsonArray = new JSONArray(productUrlArrayString);
            String productUrl = jsonArray.getString(0);
            String hashtag = "#CSCI571Fall23AndroidApp";
            // Unescape the URL if it's escaped
            if (productUrl != null) {
                productUrl = productUrl.replace("\\/", "/");
            }
            Log.d("producttttttturl","uwugfuw"+productUrl);
            if (productUrl != null) {
                Uri productUri = Uri.parse(productUrl);

                ShareLinkContent shareLinkContent = new ShareLinkContent.Builder()
                        .setContentUrl(productUri)
                        .setShareHashtag(new ShareHashtag.Builder().setHashtag(hashtag).build())
                        .build();

                if (ShareDialog.canShow(ShareLinkContent.class)) {
                    Log.d("FGHJK","SDFGHJKJHGFDFGHJK");
                    shareDialog.show(shareLinkContent, ShareDialog.Mode.AUTOMATIC);
                } else {
                    // Fallback for when the Facebook app is not installed
                    String sharerUrl = "https://www.facebook.com/sharer/sharer.php?u=" + productUrl+"&hashtag=" + Uri.encode(hashtag);
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(sharerUrl));
                    startActivity(intent);
                }
            } else {
                Log.e("DetailActivity", "Invalid or empty product URL");
            }


    }
   
}

