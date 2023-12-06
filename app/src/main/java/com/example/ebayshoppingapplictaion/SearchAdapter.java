package com.example.ebayshoppingapplictaion;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import com.bumptech.glide.Glide;

import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class SearchAdapter extends RecyclerView.Adapter<SearchAdapter.ViewHolder> {

    private List<SearchItem> searchItems;
    private OnItemClickListener listener;


    public interface OnItemClickListener {
        void onItemClick(SearchItem item);
        void onWishlistClick(SearchItem item);
    }

    public SearchAdapter(List<SearchItem> searchItems, OnItemClickListener listener) {
        this.searchItems = searchItems;
        this.listener = listener;
    }

    public  class ViewHolder extends RecyclerView.ViewHolder {
        ImageView ImageViewItem,wishlist;
        TextView textViewTitle2;
        TextView textViewTitle3;
        TextView textViewTitle4;
        TextView textViewTitle5;
        TextView textViewTitle6;

        // ... other views

        public ViewHolder(View view,final OnItemClickListener listener) {
            super(view);
            ImageViewItem = view.findViewById(R.id.textViewTitle1);
            textViewTitle2 = view.findViewById(R.id.textViewTitle2);
            textViewTitle3 = view.findViewById(R.id.textViewTitle3);
            textViewTitle4 = view.findViewById(R.id.textViewTitle4);
            textViewTitle5 = view.findViewById(R.id.textViewTitle5);
            textViewTitle6= view.findViewById(R.id.textViewTitle6);
            wishlist=view.findViewById(R.id.wishlistIcon);
            // ... initialize other views

//            itemView.setOnClickListener(v -> {
//                if (listener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
//                    listener.onItemClick(searchItems.get(getAdapterPosition()));
//                }
//            });

//            wishlist.setOnClickListener(v -> {
//                Log.d("Onclick","wihskdwhefhwfejfvgehj");
//                if (listener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
//                    listener.onWishlistClick(searchItems.get(getAdapterPosition()));
//                }
//            });
        }
    }

//    public SearchAdapter(List<SearchItem> searchItems) {
//        this.searchItems = searchItems;
//    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_search, parent, false);
        return new ViewHolder(view,listener);


    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        SearchItem item = searchItems.get(position);
        Glide.with(holder.itemView.getContext())
                .load(item.getImage())
                .centerCrop()
                .into(holder.ImageViewItem);
        holder.textViewTitle2.setText(item.getTitle());
        holder.textViewTitle3.setText("Zip: "+item.getZipcode());
        holder.textViewTitle4.setText(item.getShippingType());
        holder.textViewTitle5.setText(item.getCondition());
        holder.textViewTitle6.setText(item.getPrice());
//        holder.wishlist.setImageResource(item.isInWishlist() ? R.drawable.cart_remove : R.drawable.cart_plus);
        // ... set other views
        // Set the background color state list for the item view
//        int[][] states = new int[][] {
//                new int[] { android.R.attr.state_pressed}, // pressed
//                new int[] {}  // default
//        };
//
//        int[] colors = new int[] {
//                Color.GRAY, // color for pressed state
//                Color.WHITE // default color
//        };
//
//        ColorStateList colorStateList = new ColorStateList(states, colors);
//        holder.itemView.setBackgroundTintList(colorStateList);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listener.onItemClick(item);
            }
        });
//        holder.ImageViewItem.setOnClickListener(v -> {
//            if (listener != null) {
//                listener.onWishlistClick(item);
//            }
//        });

        if (item.isInWishlist()) {
            holder.wishlist.setImageResource(R.drawable.cart_remove); // Replace with your selected icon
        } else {
            holder.wishlist.setImageResource(R.drawable.cart_plus); // Replace with your unselected icon
        }

        // Set up onClickListener for the wishlist icon
        holder.wishlist.setOnClickListener(v -> {
            boolean isInWishlist = item.isInWishlist();
            item.setInWishlist(!isInWishlist);

            // Update the icon
            if (item.isInWishlist()) {
                holder.wishlist.setImageResource(R.drawable.cart_remove);
            } else {
                holder.wishlist.setImageResource(R.drawable.cart_plus);
            }

            if (listener != null) {
                listener.onWishlistClick(item);
            }
        });


    }

    @Override
    public int getItemCount() {
        return searchItems.size();
    }
}

