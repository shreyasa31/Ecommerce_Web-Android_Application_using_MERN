import React from "react";
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination';
import axios from "axios";
import styles from './styles/Home.module.css';
import ItemsTable from './Items';


const ITEMS_PER_PAGE = 10;
export default function ResultTable({tableData}){
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

  const paginationItems = [];
  for (let number = 1; number <= pageCount; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
        {number}
      </Pagination.Item>
    );
  }
  const [indiDetail, setIndiDetail] = useState(false);
  const getItems=async (ItemID)=>{
      console.log("Item ID",ItemID);
      const response=await axios.get(`http://localhost:8080/getItem?ItemID=${ItemID}`)
      console.log("Response",response);
      setDetails(response.data);
      setIndiDetail(true);
  }
  console.log("Inside search Result", tableData)
    const getIconDisplay = (iconType) => {
        if (iconType === "cart_icon") {
          // return <i className="material-icons"></i>;
          return <span class="material-icons">
            add_shopping_cart
          </span>;
        } else {
          return iconType; // or some default display, like a placeholder text or icon
        }
      }
      const handleBack = () => {
        setDetails(null);
        setIndiDetail(false);
      };
    return(
        <>
         { indiDetail &&  <ItemsTable items={details} handleBack={handleBack}/>}
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
                        <tr key={index}>
                          {/* <td class=" bg-dark text-white" scope="row">{index + 1}</td> */}
                          <td class="bg-dark text-white" scope="row">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                          {/* <td class=" bg-dark text-white" ><img src={element.image} alt="" width='100' height='100'/></td> */}

                          <td className="bg-dark text-white">
                            <a href={`./image/ImageView?imageUrl=${encodeURIComponent(element.image)}`} target="_blank" rel="noopener noreferrer">
                              <img src={element.image} alt="error" width='100' height='100' />
                            </a>
                          </td>
                          <td className="bg-dark text-white text-truncate" style={{ maxWidth: "150px" }}><span onClick={()=>getItems(element.itemId)}>{element.title}</span></td>
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
                                <button>
                                  {getIconDisplay
                                    (element.wishlist.icon)}
                                </button>
                              {/* )
                            } */}


                          </td>


                        </tr>
                      )) 
                }




              </tbody>
            </table>
        



</div>
</div>}
        </>
    )


}