package com.example.ebayshoppingapplictaion;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class TabsViewAdapter extends FragmentStateAdapter {
    public TabsViewAdapter(FragmentActivity fa) {
        super(fa);
    }

    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new ProductFragment();
            case 1:
                return new ShippingFragment();
            case 2:
                return new PhotosFragment();
            case 3:
                return new SimilarFragment();
            default:
                return new ProductFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 4; // Number of tabs
    }
}
