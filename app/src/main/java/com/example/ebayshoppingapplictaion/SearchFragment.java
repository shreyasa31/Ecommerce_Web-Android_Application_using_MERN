package com.example.ebayshoppingapplictaion;

import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;


public class SearchFragment extends Fragment {
    private CheckBox checkBox,checkBox2,checkBox3,checkBox4,checkBox5,checkBox6;
    private TextView textView,textView1;
    private EditText editText,editText2,KeywordEditText;
    private RadioGroup radioGroup;
    private Button dynamicButton,dynamicButton1;
    private ConstraintLayout constraintLayout;
    private Spinner mySpinner;
    private RadioButton zip;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_search, container, false);
        checkBox2=view.findViewById(R.id.checkBox2);
        checkBox3=view.findViewById(R.id.checkBox3);
        checkBox4=view.findViewById(R.id.checkBox4);
        checkBox5=view.findViewById(R.id.checkBox5);
        checkBox6=view.findViewById(R.id.checkBox);

        checkBox = view.findViewById(R.id.checkBox6);
        KeywordEditText=view.findViewById(R.id.KeywordEditText);
        textView1 = view.findViewById(R.id.textDistance);
        textView = view.findViewById(R.id.textView9);
        editText = view.findViewById(R.id.zipcode);
        editText2=view.findViewById(R.id.distance);
        radioGroup = view.findViewById(R.id.radioGroup);
        textView.setVisibility(View.GONE);
        editText.setVisibility(View.GONE);
        editText2.setVisibility(View.GONE);
        radioGroup.setVisibility(View.GONE);
        textView1.setVisibility(View.GONE);
        dynamicButton = view.findViewById(R.id.button);
        dynamicButton1 = view.findViewById(R.id.button2);
        constraintLayout = view.findViewById(R.id.frameLayout);

        editText2.setText("10");
        mySpinner = view.findViewById(R.id.spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getActivity(),
                R.array.spinner_items, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mySpinner.setAdapter(adapter);
        dynamicButton1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                KeywordEditText.setText("");
                checkBox6.setChecked(false);
                checkBox2.setChecked(false);
                checkBox3.setChecked(false);
                checkBox4.setChecked(false);
                checkBox5.setChecked(false);
                checkBox.setChecked(false);
                radioGroup.clearCheck();
                editText.setText("");
                editText2.setText("10");
                mySpinner.setSelection(0);
            }
        });
        checkBox.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (checkBox.isChecked()) {
                    textView.setVisibility(View.VISIBLE);
                    editText.setVisibility(View.VISIBLE);
                    editText2.setVisibility(View.VISIBLE);
                    radioGroup.setVisibility(View.VISIBLE);
                    textView1.setVisibility(View.VISIBLE);
                    updateButtonConstraint(R.id.radioGroup);
                } else {
                    textView.setVisibility(View.GONE);
                    editText.setVisibility(View.GONE);
                    editText2.setVisibility(View.GONE);
                    radioGroup.setVisibility(View.GONE);
                    textView1.setVisibility(View.GONE);
                    updateButtonConstraint(R.id.checkBox6);
                }
            }
        });

        dynamicButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isValidInput()) {
                    // Proceed with your search logic
                } else {
                    Toast.makeText(getActivity(), "Invalid keyword or zipcode", Toast.LENGTH_SHORT).show();
                }
            }
        });

        return view;
    }
    //
    private void updateButtonConstraint(int anchorId) {
        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(constraintLayout);
        constraintSet.connect(R.id.button, ConstraintSet.TOP, anchorId, ConstraintSet.BOTTOM);
        constraintSet.connect(R.id.button2, ConstraintSet.TOP, anchorId, ConstraintSet.BOTTOM);
        constraintSet.applyTo(constraintLayout);
    }
    private boolean isValidInput() {
        String keyword = KeywordEditText.getText().toString().trim();
        String zipcode = editText.getText().toString().trim();

        if (keyword.isEmpty()) {
            KeywordEditText.setError("Keyword is required");
            return false;
        }

        if (zip.isChecked() && (zipcode.isEmpty()) ){
            editText.setError("Valid zipcode is required");
            return false;
        }

        return true;
    }
}