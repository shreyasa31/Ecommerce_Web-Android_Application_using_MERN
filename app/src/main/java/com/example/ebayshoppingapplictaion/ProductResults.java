package com.example.ebayshoppingapplictaion;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
//import android.widget.Toolbar;
import androidx.appcompat.widget.Toolbar;


public class ProductResults extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_results);


        ImageView img = findViewById(R.id.backArrow);
        ProgressBar progressBar = findViewById(R.id.progressBar);
        TextView textView = findViewById(R.id.textView8);
        TextView searchProductsText = findViewById(R.id.searchProductsText);
        // Initially, show the progress bar and hide the text view
        progressBar.setVisibility(View.VISIBLE);
        textView.setVisibility(View.GONE);
        searchProductsText.setVisibility(View.VISIBLE);

        // Handler to delay the display of the text
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // Hide the progress bar and show the text
                progressBar.setVisibility(View.GONE);
                searchProductsText.setVisibility(View.GONE);
                textView.setText("Hi");
                textView.setVisibility(View.VISIBLE);
            }
        }, 2000); // 2000 ms delay
      img.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
              finish();

          }
      });
    }

}