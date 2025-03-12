// import {React,  useState, useEffect } from 'react';


 

//   // Function to fetch data from the API
//   const fetchShippingDetails = async ({ conditions, shippingOptions, keyword, category, distance, fromOption, zipCode }) => {
//     const [shippingDetails, setShippingDetails] = useState(null);
//     // Assuming 'params' is a URLSearchParams object with query parameters already set
//     const params = new URLSearchParams({
//       keyword: keyword,
//       category: category,
//       condition: conditions.join(','),
//       ...shippingOptions.reduce((acc, val) => ({ ...acc, [val]: true }), {}),
//       distance: distance,
//       buyerPostalCode: fromOption === 'other' ? zipCode : undefined
      
//     });
//     const url = `http://localhost:8080/search?${params.toString()}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
      
//       // If the response has items, we proceed to extract the shipping details
//       if (data && data.items) {
//         const shippingInfo = data.items.map(item => ({
//           shippingCost: item.shippingCost,
//           shippingLocation: item.shippingLocation,
//           handlingTime: item.handlingTime,
//           expeditedShipping: item.expeditedShipping,
//           oneDayShipping: item.oneDayShipping,
//           returnsAccepted: item.returnsAccepted
//         }));
//         setShippingDetails(shippingInfo);
//       }
//     } catch (error) {
//       console.error('There was an error fetching the shipping details: ', error);
//     }
//     useEffect(() => {
//       fetchShippingDetails();
//     }, [conditions, shippingOptions, keyword, category, distance, fromOption, zipCode]);  
  
//     // Return statement to render shippingDetails
//     return (
//       <div className="container mt-3">
//         {shippingDetails ? (
//           <div className="table-responsive">
//             <table className="table table-striped table-dark">
//               <thead>
//                 <tr>
//                   <th scope="col">Shipping Cost</th>
//                   <th scope="col">Shipping Location</th>
//                   <th scope="col">Handling Time</th>
//                   <th scope="col">Expedited Shipping</th>
//                   <th scope="col">One Day Shipping</th>
//                   <th scope="col">Returns Accepted</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {shippingDetails.map((detail, index) => (
//                   <tr key={index}>
//                     <td>{detail.shippingCost}</td>
//                     <td>{detail.shippingLocation}</td>
//                     <td>{detail.handlingTime}</td>
//                     <td>{detail.expeditedShipping}</td>
//                     <td>{detail.oneDayShipping}</td>
//                     <td>{detail.returnsAccepted}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-white">Loading shipping details...</p>
//         )}
//       </div>
//     );
//     // The return statement would go here to render shippingDetails...
//   };
  



//   // useEffect to call the fetch function when the component mounts
 


// export default fetchShippingDetails;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Async function to fetch data from the API
// const ShippingTab = ({wishlistProducts}) => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/getShipping'); // Replace with your API endpoint
//         setItems(response.data);
//       } catch (error) {
//         console.error('Error fetching wishlist data:', error);
//       }
//     };

//     fetchItems();
//   }, []);
const ShippingTab = ({ wishlistProducts }) => {
  const [shippingDetails, setShippingDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch shipping details for a single product
    const fetchShippingDetailsForProduct = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:8080/getShipping/${productId}`);
        // Assuming the backend returns an array of details for a single product
        return response.data.details;
      } catch (error) {
        console.error('Error fetching shipping details for product ID:', productId, error);
        return [];
      }
    };

    // Fetch shipping details for all products in the wishlist
    const fetchAllShippingDetails = async () => {
      setLoading(true);
      const allDetails = [];
      for (const product of wishlistProducts) {
        const details = await fetchShippingDetailsForProduct(product.id);
        allDetails.push(...details);
      }
      setShippingDetails(allDetails);
      setLoading(false);
    };

    if (wishlistProducts && wishlistProducts.length > 0) {
      fetchAllShippingDetails();
    }
  }, [wishlistProducts]);

  // Render the shipping details or a loading state
  return (
    <div className="container mt-3">
      {shippingDetails ? (
        <div className="table-responsive">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">Shipping Cost</th>
                <th scope="col">Shipping Location</th>
                <th scope="col">Handling Time</th>
                <th scope="col">Expedited Shipping</th>
                <th scope="col">One Day Shipping</th>
                <th scope="col">Returns Accepted</th>
              </tr>
            </thead>
            <tbody>
              
            {Object.entries(shippingDetails).map(([key, value]) => {
    console.log(`Rendering shipping details for product index: ${key}`, value); // Debug log
    return (
      <tr key={key}>
        


        <td>{value.shippingCost}</td>
        <td>{value.shippingLocation}</td>
        <td>{value.handlingTime}</td>
        <td>{value.expeditedShipping}</td>
        <td>{value.oneDayShipping}</td>
        <td>{value.returnsAccepted}</td>
      </tr>
    );
  })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white">Loading shipping details...</p>
      )}
    </div>
  );
};

export default ShippingTab;
