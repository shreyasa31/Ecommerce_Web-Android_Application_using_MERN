package com.example.ebayshoppingapplictaion;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class WishlistAdapter extends RecyclerView.Adapter<WishlistAdapter.ViewHolder> {

    private List<WishlistItem> wishlistItems;
    private OnItemClickListener listener;

    public WishlistAdapter(List<WishlistItem> wishlistItems, OnItemClickListener listener) {
        this.wishlistItems = wishlistItems;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_wishlist, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        WishlistItem item = wishlistItems.get(position);
        // Set data to your views
        // Example: holder.imageView.setImage...

        Glide.with(holder.itemView.getContext())
                .load(item.getImage())
                .centerCrop()
                .into(holder.ImageViewItem);
        holder.textViewTitle2.setText(item.getTitle());
        holder.textViewTitle3.setText("Zip: "+item.getLocation());
        holder.textViewTitle4.setText(item.getShipping());
        holder.textViewTitle5.setText(item.getCondition());
        holder.textViewTitle6.setText(item.getPrice());
        holder.wishlist.setOnClickListener(v -> {
            listener.onItemDelete(position, item);
        });
    }

    @Override
    public int getItemCount() {
        return wishlistItems.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView ImageViewItem,wishlist;
        TextView textViewTitle2;
        TextView textViewTitle3;
        TextView textViewTitle4;
        TextView textViewTitle5;
        TextView textViewTitle6;

        public ViewHolder(@NonNull View view) {
            super(view);
            ImageViewItem = view.findViewById(R.id.textViewTitle1);
            textViewTitle2 = view.findViewById(R.id.textViewTitle2);
            textViewTitle3 = view.findViewById(R.id.textViewTitle3);
            textViewTitle4 = view.findViewById(R.id.textViewTitle4);
            textViewTitle5 = view.findViewById(R.id.textViewTitle5);
            textViewTitle6= view.findViewById(R.id.textViewTitle6);
            wishlist=view.findViewById(R.id.wishlistIcon);
        }
    }


    public interface OnItemClickListener {
        void onItemDelete(int position, WishlistItem item);
    }
}

