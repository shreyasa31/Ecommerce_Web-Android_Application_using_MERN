import React from "react";
import Table from 'react-bootstrap/Table';



export default function ResultTable(){
    const [products, setProducts] = useState(null);
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
    return(
        <>
        <div className="container mt-3">
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
    //               products && products.length > 0 ?
    //                 isWishlist
    //                   ? products
    //                     .filter((element) =>
    //                       wishlist_products.some((obj) => obj.productId === element.itemId)
    //                     )
    //                     .map((element, index) => (
    //                       <tr key={index}>
    //                         <td class=" bg-dark text-white" scope="row">{index + 1}</td>
    //                         {/* <td class=" bg-dark text-white" ><img src={element.image} alt="" width='100' height='100'/></td> */}

    //                         <td className="bg-dark text-white">
    //                           <a href={`./image/ImageView?imageUrl=${encodeURIComponent(element.image)}`} target="_blank" rel="noopener noreferrer">
    //                             <img src={element.image} alt="error" width='100' height='100' />
    //                           </a>
    //                         </td>
    //                         <td className="bg-dark text-white text-truncate" style={{ maxWidth: "150px" }}><span onClick={()=>getItems(element.itemId)}>{element.title}</span></td>
    //                         <td class=" bg-dark text-white" >{element.price}</td>
    //                         <td class=" bg-dark text-white" >{element.shippingType}</td>
    //                         <td class=" bg-dark text-white" >{element.zipcode}</td>

    //                         {/* <td class=" bg-dark text-white"><button >{element.wishlist.icon}</button></td> */}
    //                         {/* <td  className="bg-dark text-white material-symbols-outlined ">
    //     <button dangerouslySetInnerHTML={{ __html: getIconUnicode(element.wishlist.icon) }}></button>
    // </td> */}
    //                         <td className="bg-dark text-white">
    //                           {
    //                             wishlist_products.some((obj) => obj.productId == element.itemId) ? (

    //                               <button> {getIconDisplay1
    //                                 (element.wishlist.icon)}</button>
    //                             ) : (
    //                               <button onClick={() => addToWishlist(element)}>
    //                                 {getIconDisplay(element.wishlist.icon)}
    //                               </button>
    //                             )
    //                           }


    //                         </td>


    //                       </tr>
    //                     ))
                       products.map((element, index) => (
                        <tr key={index}>
                          <td class=" bg-dark text-white" scope="row">{index + 1}</td>
                          {/* <td class=" bg-dark text-white" ><img src={element.image} alt="" width='100' height='100'/></td> */}

                          <td className="bg-dark text-white">
                            <a href={`./image/ImageView?imageUrl=${encodeURIComponent(element.image)}`} target="_blank" rel="noopener noreferrer">
                              <img src={element.image} alt="error" width='100' height='100' />
                            </a>
                          </td>
                          <td className="bg-dark text-white text-truncate" style={{ maxWidth: "150px" }}> <a href="http://www.google.com" className="d-block text-truncate always-blue">{element.title}</a></td>
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
</div>
        </>
    )


}