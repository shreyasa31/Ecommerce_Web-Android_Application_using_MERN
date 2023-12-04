package com.example.ebayshoppingapplictaion;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ItemSpecificsAdapter extends RecyclerView.Adapter<ItemSpecificsAdapter.ViewHolder> {
    private List<ProductItem.ItemSpecific> specifics;

    public ItemSpecificsAdapter(List<ProductItem.ItemSpecific> specifics) {
        this.specifics = specifics;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_specific, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ProductItem.ItemSpecific specific = specifics.get(position);
        holder.valueTextView.setText(specific.getValue());
    }

    @Override
    public int getItemCount() {
        return specifics.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView valueTextView;

        public ViewHolder(View view) {
            super(view);
            valueTextView = view.findViewById(R.id.valueTextView); // ID of your TextView in item_specific.xml
        }
    }
}
