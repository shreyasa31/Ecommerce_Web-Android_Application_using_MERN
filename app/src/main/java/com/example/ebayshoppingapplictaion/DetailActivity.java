package com.example.ebayshoppingapplictaion;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.viewpager2.widget.ViewPager2;

import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

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

}