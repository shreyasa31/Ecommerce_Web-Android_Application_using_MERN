package com.example.ebayshoppingapplictaion;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.Manifest;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


public class SearchFragment extends Fragment {
    private ListView listViewPostalCodes;
    private ArrayAdapter<String> adapter;
    private List<String> postalCodeList;
    private RequestQueue requestQueue;
    private CheckBox checkBox,checkBox2,checkBox3,checkBox4,checkBox5,checkBox6;
    private TextView textView,textView1;
    private EditText editText,editText2,KeywordEditText;
    private RadioGroup radioGroup;
    private Button dynamicButton,dynamicButton1;
    private ConstraintLayout constraintLayout;
    private Spinner mySpinner;
    private RadioButton zip,current;
    private TextView validationText,validationText1;
    private LocationManager locationManager;
    private LocationListener locationListener;

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
//autocomplete
        listViewPostalCodes = view.findViewById(R.id.listView);
        postalCodeList = new ArrayList<>();
        adapter = new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, postalCodeList);
        listViewPostalCodes.setAdapter(adapter);
        requestQueue = Volley.newRequestQueue(getActivity());
        editText.addTextChangedListener(new TextWatcher() {
            @Override

            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s.length() == 3) {

                    fetchPostalCodes(s.toString());
                    listViewPostalCodes.setVisibility(View.VISIBLE);
                }
                else{
                    listViewPostalCodes.setVisibility(View.GONE);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        listViewPostalCodes.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                // Get the selected item text from ListView
                String selectedItem = (String) parent.getItemAtPosition(position);
                // Set the EditText text to the selected zipcode
                editText.setText(selectedItem);
                // Optionally, you can hide the ListView after selection
                listViewPostalCodes.setVisibility(View.GONE);
            }
        });


        //dropdown
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getActivity(),
                R.array.spinner_items, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mySpinner.setAdapter(adapter);
        //clear
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
                zip.setChecked(false);
                current.setChecked(true);
                zip.setChecked(false);
                editText.setText("");
                editText2.setText("10");
                mySpinner.setSelection(0);
            }
        });



//that checkbox press distance and all displays
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
        //current location




        validationText = view.findViewById(R.id.validationText);
        validationText1=view.findViewById(R.id.validation2);
        validationText.setVisibility(View.GONE);
        validationText1.setVisibility(View.GONE);
//search button press
        dynamicButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isValidInput()) {


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
                            intent.putExtra("keyword",KeywordEditText .getText().toString());
                            intent.putExtra("category", mySpinner.getSelectedItem().toString());
                            String condition = getConditionString();
                            intent.putExtra("condition", condition);
                            intent.putExtra("localpickuponly", checkBox4.isChecked());
                            intent.putExtra("freeshipping", checkBox5.isChecked());
                            intent.putExtra("distance", editText2.getText().toString());
                            intent.putExtra("buyerPostalCode", editText.getText().toString());
                            startActivity(intent);

                            // Proceed with next steps, such as displaying search results
                        }
                    }, 2000); // Adjust this delay according to your needs
                } else {
                    Toast.makeText(getActivity(), "Please fix all the errors", Toast.LENGTH_SHORT).show();
                }
            }
        });

        locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);

        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                Log.d("Location", "Latitude: " + location.getLatitude() + ", Longitude: " + location.getLongitude());
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {}

            @Override
            public void onProviderEnabled(String provider) {}

            @Override
            public void onProviderDisabled(String provider) {}
        };
        //switching radio buttons
        editText.setEnabled(false);
        current.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    zip.setChecked(false);
                    editText.setEnabled(false);
                    requestLocationUpdates();
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
                    if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                        locationManager.removeUpdates(locationListener); // Stop receiving location updates
                    }
                } else {
                    // Check if current is also not checked, then recheck zip
                    if (!current.isChecked()) {
                        zip.setChecked(true);
                    }
                }
            }
        });

        if(current.isChecked()){
            requestLocationUpdates();
        }

        return view;
    }  //here main flower braces ends
    //other methods
    private void updateButtonConstraint(int anchorId) {
        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(constraintLayout);
        constraintSet.connect(R.id.button, ConstraintSet.TOP, anchorId, ConstraintSet.BOTTOM);
        constraintSet.connect(R.id.button2, ConstraintSet.TOP, anchorId, ConstraintSet.BOTTOM);
        constraintSet.applyTo(constraintLayout);
    }
    //validations
    private boolean isValidInput() {
    String keyword = KeywordEditText.getText().toString().trim();
    String zipcode = editText.getText().toString().trim();
    boolean isValid = true;
    if (keyword.isEmpty()) {
        validationText.setText("Please enter mandatory field");
        validationText.setVisibility(View.VISIBLE);
        isValid = false; // Set isValid to false if the keyword is empty
    } else {
        validationText.setVisibility(View.GONE); // Hide the validation message for keyword if it is not empty
    }

    // Check if the zip RadioButton is checked and zipcode is empty
    if (zip.isChecked() && zipcode.isEmpty()) {
        validationText1.setText("Please enter mandatory field");
        validationText1.setVisibility(View.VISIBLE);
        isValid = false; // Set isValid to false if the zipcode is empty
    } else {
        validationText1.setVisibility(View.GONE); // Hide the validation message for zipcode if it is not empty
    }
//made changes here
    return isValid;
}
    // Function to request location updates
    private void requestLocationUpdates() {
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
        } else {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 10, locationListener);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == 1 && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            requestLocationUpdates();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            locationManager.removeUpdates(locationListener);
        }
    }

    private void fetchPostalCodes(String postalStart ) {
//postalStart = editText.getText().toString();

        String apiUrl = "http://10.0.2.2:8080/getPostalCode?postalstart=";
        apiUrl+=postalStart;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest
                (Request.Method.GET, apiUrl, null, new Response.Listener<JSONArray>() {

                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            postalCodeList.clear();
                            for (int i = 0; i < response.length(); i++) {
                                String postalCode = response.getString(i);
                                postalCodeList.add(postalCode);
                                Log.d("PostalCode", postalCode);
                            }
                            adapter.notifyDataSetChanged();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.e("FetchPostalCodes", "JSON parsing error: " + e.getMessage());
                        }
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("FetchPostalCodes", "Volley error: " + error.getMessage());
                    }
                });

        requestQueue.add(jsonArrayRequest);
    }
    private String getConditionString() {
        StringBuilder conditionBuilder = new StringBuilder();

        if (checkBox6.isChecked()) {
            conditionBuilder.append("New,");
        }
        if (checkBox2.isChecked()) {
            conditionBuilder.append("Used,");
        }
        if (checkBox3.isChecked()) {
            conditionBuilder.append("Unspecified,");
        }

        // Remove the trailing comma
        if (conditionBuilder.length() > 0) {
            conditionBuilder.deleteCharAt(conditionBuilder.length() - 1);
        }

        return conditionBuilder.toString();
    }

}