package com.example.ebayshoppingapplictaion;

import android.content.Intent;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ProgressBar;
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
    private RadioButton zip,current;
    private TextView validationText,validationText1;

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
        zip=view.findViewById(R.id.radioButton2);
        editText2.setText("10");
        mySpinner = view.findViewById(R.id.spinner);
        current=view.findViewById(R.id.radioButton1);
        current.setChecked(true);
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
                zip.setChecked(false);
                editText.setText("");
                editText2.setText("10");
                mySpinner.setSelection(0);
            }
        });
//        current.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (current.isChecked()) {
//                    current.setChecked(true);
//                    zip.setChecked(false);
//                }
//            }
//        });
//
//        zip.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (zip.isChecked()) {
//                    zip.setChecked(true);
//                    current.setChecked(false);
//                }
//            }
//        });


        // Replace with your RadioGroup ID
        editText.setEnabled(false);
        current.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    zip.setChecked(false);
                    editText.setEnabled(false);
                } else {
                    // Check if zip is also not checked, then recheck current
                    if (!zip.isChecked()) {
                        current.setChecked(true);

                    }
                }
            }
        });

        zip.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    current.setChecked(false);
                    editText.setEnabled(true);
                } else {
                    // Check if current is also not checked, then recheck zip
                    if (!current.isChecked()) {
                        zip.setChecked(true);
                    }
                }
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
        validationText = view.findViewById(R.id.validationText);
        validationText1=view.findViewById(R.id.validation2);
        validationText.setVisibility(View.GONE);
        validationText1.setVisibility(View.GONE);
       // Assuming you have a submit button
//        dynamicButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                validateEditText();
//                validateEditText1();
//            }
//
//        });
//        dynamicButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (isValidInput()) {
//                    // Proceed with your search logic
//
//                } else {
//                    Toast.makeText(getActivity(), "Please fix all the errors", Toast.LENGTH_SHORT).show();
//                }
//            }
//        });
        dynamicButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isValidInput()) {
                    // Show the progress bar


                    // Your search logic here
                    // For example, making a network request or processing data

                    // After the search logic is complete or after a delay, hide the progress bar
                    // This could be in the response handler of your network request or after a delay
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {


                            Intent intent = new Intent(getActivity(), ProductResults.class);
                            // You can put extra data in the Intent if needed
                            // intent.putExtra("key", value);
                            startActivity(intent);

                            // Proceed with next steps, such as displaying search results
                        }
                    }, 2000); // Adjust this delay according to your needs
                } else {
                    Toast.makeText(getActivity(), "Please fix all the errors", Toast.LENGTH_SHORT).show();
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
//    private void validateEditText() {
//        if (KeywordEditText.getText().toString().trim().isEmpty()) {
//            validationText.setText("Please enter mandatory field");
//            validationText.setVisibility(View.VISIBLE);
//        } else {
//            validationText.setVisibility(View.GONE);
//        }
//    }
//    private void validateEditText1() {
//        if ( editText.getText().toString().trim().isEmpty()) {
//            validationText1.setText("Please enter mandatory field");
//            validationText1.setVisibility(View.VISIBLE);
//        } else {
//            validationText1.setVisibility(View.GONE);
//        }
//    }
private boolean isValidInput() {
    String keyword = KeywordEditText.getText().toString().trim();
    String zipcode = editText.getText().toString().trim();

    if (keyword.isEmpty() || (zip.isChecked() && (zipcode.isEmpty()) )) {
        validationText.setText("Please enter mandatory field");
        validationText.setVisibility(View.VISIBLE);
        validationText1.setText("Please enter mandatory field");
        validationText1.setVisibility(View.VISIBLE);
        return false;
    }



//    if (zip.isChecked() && (zipcode.isEmpty()) ){
//        validationText1.setText("Valid zipcode is required");
//        validationText1.setVisibility(View.VISIBLE);
//        return false;
//    }
    else {
        validationText.setVisibility(View.GONE);
        validationText1.setVisibility(View.GONE);
    }

    return true;
}

}