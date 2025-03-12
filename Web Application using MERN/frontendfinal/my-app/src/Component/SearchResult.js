import React from "react";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination';
import axios from "axios";
import styles from './styles/Home.module.css';
import ItemsTable from './Items';


const ITEMS_PER_PAGE = 10;
export default function ResultTable({tableData, getdetails}){
  console.log("Inside search table",tableData, typeof tableData);
  
  const [currentPage, setCurrentPage] = useState(1);

  // Function to calculate the number of pages
  const pageCount = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  
  // Function to change page
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsForCurrentPage = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const [details,setDetails]=useState({});
  const [shippingDetails, setShippingDetails]=useState({});

  const paginationItems = [];
  for (let number = 1; number <= pageCount; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
        {number}
      </Pagination.Item>
    );
  }
  const [indiDetail, setIndiDetail] = useState(false);
  // shipping param next to id
  const getItems=async (ItemID, shippingCost,shippingLocation,handlingTime,expeditedShipping,oneDayShipping,returnsAccepted )=>{
      console.log("Item ID",ItemID);
      const response=await axios.get(`https://hw3shreyaback.wl.r.appspot.com/getItem?ItemID=${ItemID}`)
      console.log("Response",response);
      setDetails(response.data);
      setShippingDetails({
        "shippingCost": shippingCost,
        "shippingLocation": [shippingLocation],
        "handlingTime":handlingTime ,
        "expeditedShipping":expeditedShipping,
        "oneDayShipping":oneDayShipping ,
        "returnsAccepted":returnsAccepted
      });
    

      setIndiDetail(true);


      // getdetails
  }
  console.log("Inside search Result", tableData)
    // const getIconDisplay = (iconType) => {
    //     if (iconType === "cart_icon") {
    //       // return <i className="material-icons"></i>;
    //       return <span class="material-icons">
    //         add_shopping_cart
    //       </span>;
    //     } else {
    //       return iconType; // or some default display, like a placeholder text or icon
    //     }
    //   }
      const handleBack = () => {
        setDetails(null);
        setIndiDetail(false);
      };

    // const addToWishlist = async (e) => {
    //   console.log(e);
    //   const url = `http://localhost:8080/addToWishlist`;
    
    //   try {
    //     const response = await axios.get(`http://localhost:8080/addToWishlist?ItemID=${e.itemId}&image=${e.image}&title=${e.title}&price=${e.price}&shipping=${e.shippingType}&shippingCost=${e.shippingCost}&shippingLocation=${e.shippingLocation}&handlingTime=${e.handlingTime}&expeditedShipping=${e.expeditedShipping}&oneDayShipping=${e.oneDayShipping}&returnsAccepted=${e.returnsAccepted}`);
    //     console.log(response.data);  // Handle response data as needed
  
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }

    // const deleteWishlist = async (itemId) => {
    //   console.log(`Removing item with ID: ${itemId}`);
    //   try {
    //     const response = await axios.delete(`http://localhost:8080/deleteWishlist?itemID=${itemId}`);
    //     console.log('Item removed from wishlist:', response.data);  // Handle response data as needed
    //   } catch (error) {
    //     console.error("Error removing item from wishlist:", error);
    //   }
    // }
    //now if i click once it should add if i click again it should delete from wishlist
    const [wishlist, setWishlist] = useState([]);
    // const handleWishlistClick = async (e) => {
    //   const isItemInWishlist = wishlist.includes(e.itemId);
    //   let newWishlistItems;
    //   if (!isItemInWishlist) {
    //     // Add the item to the wishlist in the database
    //     try {
    //       const response = await axios.get(`http://localhost:8080/addToWishlist?ItemID=${e.itemId}&image=${e.image}&title=${e.title}&price=${e.price}&shipping=${e.shippingType}&shippingCost=${e.shippingCost}&shippingLocation=${e.shippingLocation}&handlingTime=${e.handlingTime}&expeditedShipping=${e.expeditedShipping}&oneDayShipping=${e.oneDayShipping}&returnsAccepted=${e.returnsAccepted}`);
    //       console.log(response.data);  // Handle response data as needed
    //     } catch (error) {
    //       console.error("Error adding item to wishlist:", error);
    //     }
    //     // Update local state to add the item to the wishlist
    //     newWishlistItems = [...wishlist, e.itemId];
    //   } else {
    //     // Remove the item from the wishlist in the database
    //     try {
    //       console.log(`Removing item with ID: ${e.itemId}`);
    //       const response = await axios.delete(`http://localhost:8080/deleteWishlist?itemID=${e.itemId}`);
    //       console.log('Item removed from wishlist:', response.data);  // Handle response data as needed
    //     } catch (error) {
    //       console.error("Error removing item from wishlist:", error);
    //     }
    //     // Update local state to remove the item from the wishlist
    //     newWishlistItems = wishlist.filter((itemId) => itemId !== e.itemId);
    //   }  
    //   setWishlist(newWishlistItems);
    // };

    const handleWishlistClick = async (e) => {
      console.log("wishlist clicked!")
      // call getwishlist and initialize newwishlists array
      const response = await axios.get('https://hw3shreyaback.wl.r.appspot.com/getWishlist'); // Replace with your API endpoint
      const cur_wishlist = response.data;
      

      const newWishlistItems = cur_wishlist;
      console.log(newWishlistItems)
      // if newWishlistItems has a productId = e.itemId
      let flag = 0;
      // for loop for newWishlistItems
      for (let i = 0; i < newWishlistItems.length; i++) {
        if (newWishlistItems[i].productId === e.itemId) {
          // delete from wishlist
          console.log("deleting from wishlist")
          flag = 1;
          try {
            console.log(`Removing item with ID: ${e.itemId}`);
            const response = await axios.delete(`https://hw3shreyaback.wl.r.appspot.com/deleteWishlist?itemID=${e.itemId}`);
            console.log('Item removed from wishlist:', response.data);  // Handle response data as needed
          } catch (error) {
            console.error("Error removing item from wishlist:", error);
          }
          // Update local state to remove the item from the wishlist
          newWishlistItems.splice(i, 1);
          break;
        }
      }
      if (flag === 0) {
        // add to wishlist
        console.log("adding to wishlist")
        try {
          const response = await axios.get(`https://hw3shreyaback.wl.r.appspot.com/addToWishlist?ItemID=${e.itemId}&image=${e.image}&title=${e.title}&price=${e.price}&shipping=${e.shippingType}&shippingCost=${e.shippingCost}&shippingLocation=${e.shippingLocation}&handlingTime=${e.handlingTime}&expeditedShipping=${e.expeditedShipping}&oneDayShipping=${e.oneDayShipping}&returnsAccepted=${e.returnsAccepted}`);
          console.log(response.data);  // Handle response data as needed
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        // Update local state to add the item to the wishlist
        newWishlistItems.push(e.itemId);
      }
      setWishlist(newWishlistItems);
    }
          
  
      



    
         
      





      // console.log("newWishlistItems: ",newWishlistItems)
      // console.log("old wishlist: ", wishlist)
      // if (cur_wishlist.includes(e.itemId)) {
      //   // Remove the item from the wishlist in the database
      //   try {
      //     console.log(`Removing item with ID: ${e.itemId}`);
      //     const response = await axios.delete(`http://localhost:8080/deleteWishlist?itemID=${e.itemId}`);
      //     console.log('Item removed from wishlist:', response.data); // Handle response data as needed
          
      //     // Update local state to remove the item from the wishlist
      //     newWishlistItems = cur_wishlist.filter((itemId) => itemId !== e.itemId);
      //   } catch (error) {
      //     console.error("Error removing item from wishlist:", error);
      //     return; // Exit the function if there was an error
      //   }
      // } else {
      //   // Add the item to the wishlist in the database
      //   try {
      //     console.log(`item added: ${e.itemId}`)
      //     console.log(`Adding item with ID: ${e.itemId}`);
      //     const response = await axios.get(`http://localhost:8080/addToWishlist?ItemID=${e.itemId}&image=${e.image}&title=${e.title}&price=${e.price}&shipping=${e.shippingType}&shippingCost=${e.shippingCost}&shippingLocation=${e.shippingLocation}&handlingTime=${e.handlingTime}&expeditedShipping=${e.expeditedShipping}&oneDayShipping=${e.oneDayShipping}&returnsAccepted=${e.returnsAccepted}`);
      //     console.log('Item added to wishlist:', response.data); // Handle response data as needed
          
      //     // Update local state to add the item to the wishlist
      //     newWishlistItems.push(e.itemId);
          
      //   } catch (error) {
      //     console.error("Error adding item to wishlist:", error);
      //     return; // Exit the function if there was an error
      //   }
      // }
    
      // setWishlist(newWishlistItems); // Update the wishlist state
    


    // Function to handle adding/removing items from wishlist
//     const [wishlist, setWishlist] = useState([]);
// const handleWishlistClick = async (e) => {
//   const isItemInWishlist = wishlist.includes(e.itemId);
  
//   try {
//     if (isItemInWishlist) {
//       // Remove the item from the wishlist in the database
//       await axios.get(`http://localhost:8080/deleteWishlist?ItemID=${e.itemId}`);

//       // Update local state to remove the item from the wishlist
//         setWishlist((prevWishlist) => {
//         const newWishlist = new Set(prevWishlist);
//         newWishlist.delete(e.itemId);
//         return newWishlist;
//       });
//     } else {
//       // Add the item to the wishlist in the database
//       try {
//           const response = await axios.get(`http://localhost:8080/addToWishlist?ItemID=${e.itemId}&image=${e.image}&title=${e.title}&price=${e.price}&shipping=${e.shippingType}&shippingCost=${e.shippingCost}&shippingLocation=${e.shippingLocation}&handlingTime=${e.handlingTime}&expeditedShipping=${e.expeditedShipping}&oneDayShipping=${e.oneDayShipping}&returnsAccepted=${e.returnsAccepted}`);
//              console.log(response.data);  // Handle response data as needed
      
//            } catch (error) {
//              console.error("Error fetching data:", error);
//            }
//     }
//   } catch (error) {
//     console.error('Error updating wishlist:', error);
//     // Optionally handle any rollback or user notification here
//   }
// };


    return(
        <>
         { indiDetail &&  <ItemsTable items={details} shipping={shippingDetails} handleBack={handleBack}/>}
        {!indiDetail && <div className="container mt-3">
        <div class="row mb-3">
          <div class="col">
          </div>
          <div class="col-auto">
            <button class="btn custom-hover">
              Detail<i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>


        <div className="table-responsive">
          

            <table class=" table table-dark table-striped table-hover tabled w-100 custom-row-height">
              <thead>
                <tr>
                  <th class=" bg-dark text-white" scope="col">#</th>
                  <th class=" bg-dark text-white" scope="col">Image</th>
                  <th class=" bg-dark text-white" scope="col">Title</th>
                  <th class=" bg-dark text-white" scope="col">Price</th>
                  <th class=" bg-dark text-white" scope="col">Shipping</th>
                  <th class=" bg-dark text-white" scope="col">Zip</th>
                  <th class=" bg-dark text-white" scope="col">Wishlist</th>
                </tr>
              </thead>


              <tbody >
                {
    //               
                      itemsForCurrentPage.map((element, index) => (
                        element.shippingType &&(
                        <tr key={index}>
                          <td class=" bg-dark text-white" scope="row">{index + 1}</td>
                          {/* <td class="bg-dark text-white" scope="row">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td> */}
                          {/* <td class=" bg-dark text-white" ><img src={element.image} alt="" width='100' height='100'/></td> */}

                          <td className="bg-dark text-white">
                            <a href={`./image/ImageView?imageUrl=${encodeURIComponent(element.image)}`} target="_blank" rel="noopener noreferrer">
                              <img src={element.image} alt="error" width='100' height='100' />
                            </a>
                          </td>
                          {console.log(element.title)}
                          {/* (element.itemId,element.shippingDetails) */}
                          <td className="bg-dark text-white text-truncate" style={{ maxWidth: "150px" }}><span onClick={()=>getItems(element.itemId, element.shippingCost,element.shippingLocation,element.handlingTime,element.expeditedShipping,element.oneDayShipping,element.returnsAccepted )}>{element.title}</span></td>
                          <td class=" bg-dark text-white" >{element.price}</td>
                          <td class=" bg-dark text-white" >{element.shippingType}</td>
                          <td class=" bg-dark text-white" >{element.zipcode}</td>

                          {/* <td class=" bg-dark text-white"><button >{element.wishlist.icon}</button></td> */}
                          {/* <td  className="bg-dark text-white material-symbols-outlined ">
    <button dangerouslySetInnerHTML={{ __html: getIconUnicode(element.wishlist.icon) }}></button>
</td> */}
                          <td className="bg-dark text-white">
                            {/* {
                              wishlist_products.some((obj) => obj.productId == element.itemId) ? (

                                // <div>Already Added to Wishlist</div>
                                <button> {getIconDisplay1
                                  (element.wishlist.icon)}</button>
                              ) : ( */}
                                {/* <button onClick={() => addToWishlist(element)}> */}
                                {/* <button onClick={() => addToWishlist(element)} class="material-icons">
                                 add_shopping_cart
                                </button> */}
                                  
                                  {/* <button onClick={() => handleWishlistClick(element)}>
                                  {wishlist.includes(element.itemId)?<span className="material-icons" style={{ color: 'green' }}>remove_shopping_cart</span> :  <span className="material-icons" style={{ color: 'green' }}>add_shopping_cart</span>} */}
                                {/* <button onClick={() => handleWishlistClick(element)}>
                                  {wishlist.includes(element.itemId)?<span className="material-icons" style={{ color: 'green' }}>remove_shopping_cart</span> :  <span className="material-icons" style={{ color: 'green' }}>{getIconDisplay
                                  (element.wishlist.icon)}</span> } 
                                </button> */}
                                {/* </button> */}
                                {/* HERE wishlist includes doesnt work so write other code */}

                                
                                <button onClick={() => handleWishlistClick(element)}>
                                  {wishlist.includes(element.itemId)?<span className="material-icons" style={{ color: 'green' }}>remove_shopping_cart</span> :  <span className="material-icons" style={{ color: 'green' }}>add_shopping_cart</span>}
                                </button>



                              {/* )
                            } */}


                          </td>


                        </tr>
                      )) 
                      )

                }




              </tbody>
            </table>
        



</div>
</div>}
        </>
    )


}