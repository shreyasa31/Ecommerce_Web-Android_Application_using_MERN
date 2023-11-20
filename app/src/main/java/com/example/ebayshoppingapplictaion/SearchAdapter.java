package com.example.ebayshoppingapplictaion;

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

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView ImageViewItem;
        TextView textViewTitle2;
        TextView textViewTitle3;
        TextView textViewTitle4;
        TextView textViewTitle5;
        TextView textViewTitle6;
        // ... other views

        public ViewHolder(View view) {
            super(view);
            ImageViewItem = view.findViewById(R.id.textViewTitle1);
            textViewTitle2 = view.findViewById(R.id.textViewTitle2);
            textViewTitle3 = view.findViewById(R.id.textViewTitle3);
            textViewTitle4 = view.findViewById(R.id.textViewTitle4);
            textViewTitle5 = view.findViewById(R.id.textViewTitle5);
            textViewTitle6= view.findViewById(R.id.textViewTitle6);
            // ... initialize other views
        }
    }

    public SearchAdapter(List<SearchItem> searchItems) {
        this.searchItems = searchItems;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_search, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        SearchItem item = searchItems.get(position);
        Glide.with(holder.itemView.getContext())
                .load(item.getImage())
                .into(holder.ImageViewItem);
        holder.textViewTitle2.setText(item.getTitle());
        holder.textViewTitle3.setText(item.getZipcode());
        holder.textViewTitle4.setText(item.getShippingType());
        holder.textViewTitle5.setText(item.getCondition());
        holder.textViewTitle6.setText(item.getPrice());
        // ... set other views
    }

    @Override
    public int getItemCount() {
        return searchItems.size();
    }
}

