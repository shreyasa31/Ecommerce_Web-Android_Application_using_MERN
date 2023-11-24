package com.example.ebayshoppingapplictaion;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.CallbackManager;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.facebook.FacebookSdk;

import org.json.JSONArray;
import org.json.JSONException;

public class DetailActivity extends AppCompatActivity {
    private TextView toolbarTitle;
    private ImageView toolbarImage;
    private TabLayout tabLayout;
    private ViewPager2 viewPager;
    private TabsViewAdapter tabsViewAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_detail);
        viewPager = findViewById(R.id.viewPager1);

        String keyword = getIntent().getStringExtra("keyword");


        Log.d("DetailActivity", "Keywordddddddddddddddddd: " + keyword);

//        // Create a new instance of PhotosFragment with the keyword
//        PhotosFragment photosFragment = PhotosFragment.newInstance(keyword);
//
//        // Add the fragment to the activity's layout
//        getSupportFragmentManager().beginTransaction()
//                .replace(R.id.fragment_container, photosFragment)
//                .commit();

        tabsViewAdapter = new TabsViewAdapter(this,keyword);
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
        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback()
        {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                tabLayout.getTabAt(position).select();
            }
        });

    }

    //
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
//    private void shareProductOnFacebook() {
        // Retrieve product details such as URL, name, etc.
//        ShareDialog shareDialog = new ShareDialog(this);
////
//        String productUrl = getIntent().getStringExtra("productUrl");
//        String unescapedUrl = productUrl.replace("\\/", "/");
//        if (unescapedUrl != null) {
//            // Parse the URL to a Uri object
//            Uri productUri = Uri.parse(unescapedUrl);
//
//            // Prepare the content to share
//            ShareLinkContent shareLinkContent = new ShareLinkContent.Builder()
//                    .setContentUrl(productUri) // Set the content URL to the product URL
//                    // .setQuote("Check out this product!") // Optional: if you want to add a predefined quote
//                    .build();
//            Log.d("Dghdjskasjhdfghdjsxkz", "Product URL: " + productUri);
//            // Show the share dialog
//
////            shareDialog.show(shareLinkContent);
////            shareDialog.show(shareLinkContent, ShareDialog.Mode.AUTOMATIC);
//            if (ShareDialog.canShow(ShareLinkContent.class)) {
//                shareDialog.show(shareLinkContent, ShareDialog.Mode.AUTOMATIC);
//            } else {
//                // Fallback for when the Facebook app is not installed
//                String sharerUrl = "https://www.facebook.com/sharer/sharer.php?u=" + productUrl;
//                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(sharerUrl));
//                startActivity(intent);
//            }
//        } else {
//            // Handle the case where there is no URL to share
//            Log.e("DetailActivity", "Product URL is null or empty");
//        }
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

