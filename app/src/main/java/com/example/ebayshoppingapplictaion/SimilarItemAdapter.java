package com.example.ebayshoppingapplictaion;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.util.List;

public class SimilarItemAdapter extends RecyclerView.Adapter<SimilarItemAdapter.ViewHolder> {

    private List<SimilarItem> itemList;
    private Context context;

    public SimilarItemAdapter(Context context, List<SimilarItem> itemList) {
        this.context = context;
        this.itemList = itemList;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_similar, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        SimilarItem item = itemList.get(position);
        holder.textViewProductName.setText(item.getTitle());
        holder.textViewProductPrice.setText(item.getPrice());
        holder.textViewProductShipping.setText(item.getShippingCost());
        holder.textViewTimeLeft.setText(item.getTimeLeft());

        Picasso.get().load(item.getImage()).into(holder.imageViewProduct);

//        holder.itemView.setOnClickListener(v -> {
//            Uri itemUri = Uri.parse(item.getViewItemURL());
//            Log.d("URL Checkkkkkkkkkkkkk", item.getViewItemURL());
//            Intent intent = new Intent(Intent.ACTION_VIEW, itemUri);
//            context.startActivity(intent);
//        });
        holder.itemView.setOnClickListener(v -> {
            try {
//                Uri itemUri = Uri.parse(item.getViewItemURL());
//                Uri itemUri= Uri.parse("https://www.google.com");
//                Log.d("URL Checkkkkkkkkkkkkk", String.valueOf(itemUri));
//                Intent intent = new Intent(Intent.ACTION_VIEW, itemUri);
//                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                context.startActivity(intent);
                String productUrl = item.getViewItemURL();
                String googleSearchUrl = "https://www.google.com/search?q=" + Uri.encode(productUrl);
                Log.d("Google Search URL", googleSearchUrl);

                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(googleSearchUrl));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                Intent intent = new Intent(context, ShippingFragment.class); // Replace ShippingFragment.class with your destination class
//                intent.putExtra("shippingCost", item.getShippingCost());
                context.startActivity(intent);


            } catch (Exception e) {
                Log.e("SimilarItemAdapterrrrrrrrrrrrrrrrrrr", "Error opening URL", e); // Improved error logging
//                e.printStackTrace();
                // Handle exception or log error
            }



        });
//        holder.itemView.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                openWebPage(item.getViewItemURL(), context);
//            }
//        });

    }
    public static void clearPicassoCache(Context context) {
        try {
            File cache = new File(context.getCacheDir(), "picasso-cache");
            if (cache.exists() && cache.isDirectory()) {
                for (File file : cache.listFiles()) {
                    file.delete();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//    private static void openWebPage(String url, Context context) {
//        Intent intent = new Intent(Intent.ACTION_VIEW);
//        intent.setData(Uri.parse(url));
//        if (intent.resolveActivity(context.getPackageManager()) != null) {
//            context.startActivity(intent);
//        }
//    }

    @Override
    public int getItemCount() {
        return itemList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder
    {
        ImageView imageViewProduct;
        TextView textViewProductName, textViewProductPrice, textViewProductShipping, textViewTimeLeft;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            imageViewProduct = itemView.findViewById(R.id.imageViewProduct);
            textViewProductName = itemView.findViewById(R.id.textViewProductName);
            textViewProductPrice = itemView.findViewById(R.id.textViewProductPrice);
            textViewProductShipping = itemView.findViewById(R.id.textViewProductShipping);
            textViewTimeLeft = itemView.findViewById(R.id.textViewTimeLeft);
        }
    }
}
