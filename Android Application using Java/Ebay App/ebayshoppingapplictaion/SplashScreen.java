package com.example.ebayshoppingapplictaion;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class SplashScreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() { //whatever performed after delay
                Intent iHome=new Intent(SplashScreen.this, MainActivity.class);
                startActivity(iHome);
            }
        },2000);
    }


}