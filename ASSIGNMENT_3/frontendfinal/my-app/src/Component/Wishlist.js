import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WishlistTable = ({wishlistProducts}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getWishlist'); // Replace with your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      }
    };

    fetchItems();
  }, []);
  function manualDecode(str) {
    if (typeof str !== 'string') {
      console.error('The input is not a string:', str);
      return ''; // Or handle the non-string case as appropriate for your use case.
    }
    
    console.log('Original Encoded Title:', str);
  
    // Decoding common percent-encoded characters manually
    // ... (same replacement code)
  
    // Attempt to decode the rest using decodeURIComponent
    let decodedStr=str;
    try {
      decodedStr = decodeURIComponent(decodedStr);
      console.log('Decoded with decodeURIComponent:', decodedStr);
    } catch (e) {
      console.error('Error decoding URI component:', e);
    }
  
    // If still not decoded, try to decode once more
    try {
      decodedStr = decodeURIComponent(decodedStr);
      console.log('Decoded with double decodeURIComponent:', decodedStr);
    } catch (e) {
      console.error('Error on second decode:', e);
    }
  
    return decodedStr;
  }
  
  return (
    <div className="container mt-3">
      <h2>Wishlist</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Shipping</th>
              <th>Favourite</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
             
              <tr key={item.productId}>
                <td>{index + 1}</td>
                <td><img src={item.image} className="img-fluid" alt={item.title} style={{ maxWidth: '70px' }} /></td>
                <td>{manualDecode(item.title)}</td>
                
                <td>${item.price}</td>
                <td>{item.shipping}</td>
                <td>
                  {/* You can implement adding to wishlist or any other action here */}
                  <button className="btn btn-primary btn-sm">Add to Wishlist</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default WishlistTable;
