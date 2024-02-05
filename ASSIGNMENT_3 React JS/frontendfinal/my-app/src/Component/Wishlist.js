import React, { useEffect, useState } from 'react';
import axios from 'axios';
//newcommit
const WishlistTable = ({wishlistProducts}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://hw3shreyaback.wl.r.appspot.com/getWishlist'); // Replace with your API endpoint
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      }
    };

    fetchItems();
  }, []);
  // const getIconDisplay1= (iconType) => {
  //   if (iconType === "cart_icon") {
  //     // return <i className="material-icons"></i>;
  //     return <span class="material-icons">
  //       add_shopping_cart
  //     </span>;
  //   } else {
  //     return iconType; // or some default display, like a placeholder text or icon
  //   }
  // }
  function DecodedText({ encodedText }) {
    let decodedText;
    try {
      decodedText = decodeURIComponent(encodedText);
    } catch (e) {
      console.error('Error decoding text:', e);
      decodedText = encodedText; // Fallback to original if error occurs
    }
    return <>{decodedText}</>;
  }
  // const [details,setDetails]=useState({});
  // const [shippingDetails, setShippingDetails]=useState({});
  // const getItems=async (ItemID, shippingCost,shippingLocation,handlingTime,expeditedShipping,oneDayShipping,returnsAccepted )=>{
  //   console.log("Item ID",ItemID);
  //   const response=await axios.get(`http://localhost:8080/getItem?ItemID=${ItemID}`)
  //   console.log("Response",response);
  //   setDetails(response.data);
  //   setShippingDetails({
  //     "shippingCost": shippingCost,
  //     "shippingLocation": [shippingLocation],
  //     "handlingTime":handlingTime ,
  //     "expeditedShipping":expeditedShipping,
  //     "oneDayShipping":oneDayShipping ,
  //     "returnsAccepted":returnsAccepted
  //   });


  
  return (
    <div className="container mt-3 ">


      <div className="table-responsive">
        <table className="table table-dark  table-striped">
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
          <tbody >
            {items.map((item, index) => (
             
              <tr key={item.productId}>
                <td>{index + 1}</td>
                <td><img src={item.image} className="img-fluid" alt={item.title} style={{ maxWidth: '70px' }} /></td>
                {console.log(item.title)}
                <td className="text-truncate" style={{ maxWidth: "150px" }}>{item.title}</td>
               
                <td>{item.price}</td>
                <td>{item.shipping}</td>
                <td>
                  {/* You can implement adding to wishlist or any other action here */}
                  {/* <button className="btn btn-primary btn-sm">{getIconDisplay1
                                    (item.wishlist.icon)}</button> */}
                      <button class="material-icons" style={{ color: 'orange' }}>remove_shopping_cart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// }

export default WishlistTable;
