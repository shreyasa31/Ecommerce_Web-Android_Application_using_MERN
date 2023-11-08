import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostalCodeAutocomplete = ({ zipCode, setZipCode }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (zipCode.length > 2) {
        try {
          const response = await axios.get(`http://localhost:8080/getPostalCode?postalstart=${zipCode}`);
          if (response.data && response.data.postalCodes) {
            setSuggestions(response.data.postalCodes);
          }
        } catch (error) {
          console.error('Error fetching postal codes:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    loadSuggestions();
  }, [zipCode]);

  return (
    <div>
      <input
        type="text"
        className="form-control mt-2 mb-3"
        value={zipCode}
        onChange={(e) => {
          setZipCode(e.target.value);
          setShowSuggestions(true);
        }}
        // onBlur={() => {
        //   // Optionally hide suggestions when the input loses focus
        //   setTimeout(() => setShowSuggestions(false), 100);
        // }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="list-group">
          {suggestions.map((suggestion, index) => (
            <button
              type="button"
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setZipCode(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostalCodeAutocomplete;
