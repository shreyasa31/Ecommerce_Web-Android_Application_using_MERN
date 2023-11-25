//package com.example.ebayshoppingapplictaion;
//
//import android.content.Context;
//import android.content.Intent;
//import android.net.Uri;
//import android.view.LayoutInflater;
//import android.view.View;
//import android.view.ViewGroup;
//import android.widget.ImageView;
//import android.widget.TextView;
//import androidx.annotation.NonNull;
//import androidx.recyclerview.widget.RecyclerView;
//import com.squareup.picasso.Picasso;
//import java.util.List;
//
//public class SimilarItemAdapter extends RecyclerView.Adapter<SimilarItemAdapter.ViewHolder> {
//
//    private List<SimilarItem> itemList;
//    private Context context;
//
//    public SimilarItemAdapter(Context context, List<SimilarItem> itemList) {
//        this.context = context;
//        this.itemList = itemList;
//    }
//
//    @NonNull
//    @Override
//    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
//        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_similar, parent, false);
//        return new ViewHolder(view);
//    }
//
//    @Override
//    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
//        SimilarItem item = itemList.get(position);
//        holder.textViewProductName.setText(item.getTitle());
//        holder.textViewProductPrice.setText(item.getPrice());
//        holder.textViewProductShipping.setText(item.getShippingCost());
//        holder.textViewTimeLeft.setText(item.getTimeLeft());
//
//        Picasso.get().load(item.getImage()).into(holder.imageViewProduct);
//
//        holder.itemView.setOnClickListener(v -> {
//            Uri itemUri = Uri.parse(item.getViewItemURL());
//            Intent intent = new Intent(Intent.ACTION_VIEW, itemUri);
//            context.startActivity(intent);
//        });
//    }
//
//    @Override
//    public int getItemCount() {
//        return itemList.size();
//    }
//
//    public static class ViewHolder extends RecyclerView.ViewHolder {
//        ImageView imageViewProduct;
//        TextView textViewProductName, textViewProductPrice, textViewProductShipping, textViewTimeLeft;
//
//        public ViewHolder(@NonNull View itemView) {
//            super(itemView);
//            imageViewProduct = itemView.findViewById(R.id.imageViewProduct);
//            textViewProductName = itemView.findViewById(R.id.textViewProductName);
//            textViewProductPrice = itemView.findViewById(R.id.textViewProductPrice);
//            textViewProductShipping = itemView.findViewById(R.id.textViewProductShipping);
//            textViewTimeLeft = itemView.findViewById(R.id.textViewTimeLeft);
//        }
//    }
//}
