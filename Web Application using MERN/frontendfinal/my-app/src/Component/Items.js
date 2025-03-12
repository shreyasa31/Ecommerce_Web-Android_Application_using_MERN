import { Tab, Nav, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import facebookImage from './facebook.png';
import TabsComponent from './TabsComponent';
import PhotosTab from './PhotosTab';
import SimilarItems from './SimilarProducts';
import ShippingTab from './Shipping';
import React from 'react';
//newcommit
const ItemsTable = ({items,shipping,handleBack}) => {
    // console.log(items?.items?.photo)
    // console.log(items.items.price)
    // // const [items, setItems] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');
  
//     useEffect(() => {
//       setLoading(true);
//       const itemID = '335007021375'; // The item ID you want to fetch
//       fetch(`http://localhost:8080/getItem?ItemID=${itemID}`)
//  // replace '/api/your-endpoint' with your actual API endpoint
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           setItems(data);
//         })
//         .catch(error => {
//           setError(error.message);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }, []);
  
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
  
    // if (error) {
    //   return <div>Error: {error}</div>;
    // }
    const [images, setImages] = useState([]);
    
    const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ItemID, setItemID] = useState('');
  const [activeTab, setActiveTab] = useState('product');
  const [productTitle, setProductTitle] = useState('');
  const [itemsp, setItemsp] = useState([]);
  const [itemspdup, setItemspdup] = useState([]);
  const [sortCategory, setSortCategory] = useState('Default');
  const [sortOrder, setSortOrder] = useState('Ascending');
  const [isSortOrderDisabled, setIsSortOrderDisabled] = useState(true);

  // Callback function to update active tab
  const handleSelectTab = (key) => {
    setActiveTab(key);
  };

  const fetchImages = async (ItemID) => {
    try {
      // Replace with your actual fetch request
      const response = await fetch(`https://hw3shreyaback.wl.r.appspot.com/getItem?ItemID=${items.id}`)
      const data = await response.json();
      if (data && data.images) {
        setImages(data.images);
      } else {
        // Handle the case where data is not in the expected format
        console.error('Received data is not in expected format:', data);
        setImages([]); // Reset images state to empty if data is incorrect
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  useEffect(() => {
    // Assuming 'ItemID' is a prop or state
    fetchImages(ItemID);
}, [ItemID]);
    const traverseCallback = () => {
      handleBack();
    };
    // const selectedItem = items && items.length > 0 ? items[0] : null;

  //   useEffect(() => {
  //     // Assuming 'ItemID' is a prop or state
  //     fetchPhotos(productTitle);
  // }, [productTitle]);


  useEffect(() => {
    const fetchSimilarItems = async () => {
      try {
        const response = await fetch(`https://hw3shreyaback.wl.r.appspot.com/getSimilarItems?itemID=${items.id}`);
        if (response.ok) {
          const data = await response.json();
          setItemsp(data); // Assuming this path holds your items
          setItemspdup(data);
        } else {
          throw new Error('Error fetching similar items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchPhotos = async () => {
      try {
  
        // Replace with your actual fetch request
        console.log("fetching photos")
        const response = await fetch(`https://hw3shreyaback.wl.r.appspot.com/googlesearch?q=${encodeURIComponent(items.title)}`);
  
        // const response = await fetch(`http://localhost:8080/getItem?ItemID=${ItemID}`)
        const data = await response.json();
        console.log(data)
        if (data && data.length > 0) {
          console.log("got photos")
          setPhotos(data);
        } else {
          // Handle the case where data is not in the expected format
          console.error('Received data is not in expected format:', data);
          setImages([]); // Reset images state to empty if data is incorrect
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchPhotos();
    fetchSimilarItems();
  }, [ItemID]);

  useEffect(() => {
    // Disable the sort order dropdown if the sort category is 'Default'
    if (sortCategory === 'Default') {
      setIsSortOrderDisabled(true);
      setSortOrder('Ascending'); // Reset to default or any required value
    } else {
      setIsSortOrderDisabled(false);
    }
  }, [sortCategory]);

  const [visibleItems, setVisibleItems] = useState(5);
  const handleSortCategoryChange = (event) => {
    setSortCategory(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };
  const showMore = () => {
    setVisibleItems(itemsp.length);
};

const showLess = () => {
    setVisibleItems(5);
};

  useEffect(() => {
    // This code will run after `sortCategory` has been updated and the component has re-rendered
    sortProductsArray();
  }, [sortCategory, sortOrder]);

  const sortProductsArray = () => {
    if(sortCategory === "Default") {
      setItemsp(itemspdup)
    }
    else {

    const sortedProducts = [...itemsp].sort((a, b) => {
      let comparison = 0;

      switch (sortCategory) {
        case 'ProductName':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'DaysLeft':
          comparison = a.timeLeft - b.timeLeft;
          break;
        case 'Price':
          comparison = a.price - b.price;
          break;
        case 'ShoppingCost':
          comparison = a.shippingCost - b.shippingCost;
          break;
        default:
          return 0; // No sorting
      }

      return sortOrder === 'Descending' ? comparison * -1 : comparison;
    });

    setItemsp(sortedProducts);
  }
  };

  return (
    <>
    {/* */}
    {/* <div className="container mt-5">
    <h2 onClick={traverseCallback }> List</h2>
      {(
       <table>
          <tbody>
            {items?.photo && (
              <tr>
                <td>Photo</td>
                <td>
                  {items?.photo.map((url, index) => (
                    <img key={index} src={url} alt="Item" width="50" />
                  ))}
                </td>
              </tr>
            )}
            {items?.price && (
              <tr>
                <td>Price</td>
                <td>{items.price}</td>
              </tr>
            )}
            {items?.location && (
              <tr>
                <td>Location</td>
                <td>{items.location}</td>
              </tr>
            )}
             {items?.returnPolicy && (
              <tr>
                <td>Return Policy</td>
                <td>{items?.returnPolicy?.returnsAccepted ? `Returns Accepted within ${items?.returnPolicy?.returnsWithin}` : "Returns Not Accepted"} </td>
              </tr>
            )}
            {items?.itemSpecifics && items?.itemSpecifics.length > 0 && (
        <tr>
          {/* <td>Item Specifics</td> */}
          {/* <td>
            {items.itemSpecifics.map((specific, index) => (
              <div key={index}>
                <strong>{specific.name}</strong> {specific.value}
              </div>
            ))}
          </td>
        </tr>
      )}
          </tbody>
        </table>
      )}
      
    </div>
    </>
  ); */} 

  
  <div className="container mt-5">
  <button onClick={traverseCallback}>List</button>
  <div className="d-flex justify-content-end">
        {/* <a href="/facebook" className="me-2">
          <i className="fab fa-facebook-f"><img></img></i> {/* Font Awesome Icon */}
        {/* </a> */}
        {/* <a href="/wishlist">
          <i className="fas sfa-heart"> </i> {/* Font Awesome Icon */}
        {/* </a> */} 

        <button  className="me-2">
    {/* Using an img tag directly instead of the i tag */}
    <img src={facebookImage} alt="Facebook" style={{ width: '24px', height: '24px' }} />
  </button>
  
  <button>
    {/* Using Google Material Icons for the cart */}
    <span className="material-icons">add_shopping_cart</span>
  </button>
      </div>
      
      {/* <Tab.Container id="list-tabs" defaultActiveKey="product">
        <Nav variant="tabs" className="mb-3 justify-content-end">
          <Nav.Item>
            <Nav.Link eventKey="product">Product</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="photos">Photos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="shipping">Shipping</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="seller">Seller</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="similar-products">Similar Products</Nav.Link>
          </Nav.Item>
        </Nav> */}

        {/* <Tab.Content>
          <Tab.Pane eventKey="product"> */}
            {/* Table code goes here */}
            {/* <div className="table-responsive">
              <table className="table table-dark table-striped"> */}
                {/* ... rest of your table code ... */}
              {/* </table> */}
            {/* </div> */}
          {/* </Tab.Pane>
          <Tab.Pane eventKey="photos"> */}
            {/* Content for Photos tab */}
          {/* </Tab.Pane> */}
          {/* ... Other tabs content ... */}
        {/* </Tab.Content> */}
      {/* </Tab.Container> */}
      <TabsComponent onSelectTab={handleSelectTab} />
      <Tab.Content>
        <Tab.Pane eventKey="product" active={activeTab === 'product'}>
          {/* Your table component or its content should be here */}
          {activeTab === 'product' && (
            // ... Table code ...
            <div className="table-responsive">
      <table className="table table-dark table-striped">
        <tbody>
          <tr>
            <td>Photos</td>
            <td>
              <a href="#imageModal" role="button" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
                View Product Images
              </a>
              <div className={showModal ? "modal fade show d-block" : "modal fade"} id="imageModal" tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="imageModalLabel">Product Images</h5>
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      {/* Carousel */}
                      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                          {images.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                              <img src={image.url} className="d-block w-100" alt={`Item ${index}`} style={{ height: '500px', objectFit: 'contain' }} />
                            </div>
                          ))}
                        </div>
                        {images.length > 1 && (
                          <>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                              <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
              {showModal ? <div className="modal-backdrop fade show"></div> : null}
            </td>
          </tr>
    
        {items?.price && (
          <tr>
            <td>Price</td>
            <td>{items.price}</td>
          </tr>
        )}
        {items?.location && (
          <tr>
            <td>Location</td>
            <td>{items.location}</td>
          </tr>
        )}
        {items?.returnPolicy && (
          <tr>
            <td>Return Policy</td>
            <td>
              {items?.returnPolicy?.returnsAccepted
                ? `Returns Accepted within ${items?.returnPolicy?.returnsWithin}`
                : "Returns Not Accepted"}
            </td>
          </tr>
        )}
        {/* {items?.itemSpecifics && items?.itemSpecifics.length > 0 && (
          <tr>
            {/* <td>Item Specifics</td> */}
           
             {/* <td>


             </td>
             
                  {items.itemSpecifics.map((specific, index) => (
                    <tr key={index}>
                     <td><strong>{specific.name}</strong></td> 
                    <td> {specific.value}</td>
                    </tr>
                  ))}
               
             
            
          </tr>
        )} */}
        {items?.itemSpecifics && items?.itemSpecifics.length > 0 && (
              <tr>
                <td>Name</td>
                <td>Value</td>
              </tr>
            )}
            {items.itemSpecifics && items.itemSpecifics.map((specific, index) => (
              <tr key={index}>
                <td><strong>{specific.name}</strong></td>
                <td>{specific.value}</td>
              </tr>
            ))}
      </tbody>
    </table>
  </div>
          )}
        </Tab.Pane>
         <Tab.Pane eventKey="photos" active={activeTab === 'photos'}>
          {activeTab === 'photos' &&  <div>

          {photos.map((photo, index) => (
            <img key={index} src={photo} />
          ))}
      </div>}
    

        {/* </Tab.Pane>  */}
        {/* <Tab.Pane eventKey="photos" active={activeTab === 'photos'}>
  {activeTab === 'photos' && (
    <PhotosTab productTitle={items?.title} />


    ///////// photos collage
  )} */}
</Tab.Pane>
        <Tab.Pane eventKey="shipping" active={activeTab === 'shipping'}>
         {/* {activeTab === 'shipping' && <ShippingTab />}</Tab.Pane> */}
            {/* {activeTab === 'shipping' && <ShippingTab prodcutID={ItemID} wishlistProducts={items} />} */}
       
        
          {/* {activeTab === 'shipping' && (<div className="container mt-3">
      {shipping ? (
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
              
            {Object.entries(shipping).map(([key, value]) => {
    console.log(`Rendering shipping details for product index: ${key}`, value); // Debug log
    return (
      <tr key={key}>
        


        <td class="text-white">{value.shippingCost}</td>
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
    </div>)} */}
    {activeTab === 'shipping' && (
  <div className="container mt-3">
    {shipping ? (
      <div className="table-responsive">
        <table className="table table-striped table-dark">
          <tbody>
          <tr>
                    <td>Shipping Cost</td>
                    <td>{shipping.shippingCost}</td>
                  </tr>
                  <tr>
                    <td>Shipping Location</td>
                    <td>{shipping.shippingLocation}</td>
                  </tr>
                  <tr>
                    <td>Handling Time</td>
                    <td>{shipping.handlingTime}</td>
                  </tr>
                  <tr>
                  <td>Expedited Shipping</td>
              <td>{shipping.expeditedShipping ? <span className="material-icons" style={{ color: 'green' }}>done</span> : <span className="material-icons" style={{ color: 'red' }}>close</span>}</td>
        
                  </tr>
                  <tr>
                  <td>One Day Shipping</td>
              <td>{shipping.oneDayShipping ? <span className="material-icons" style={{ color: 'green' }}>done</span> :<span className="material-icons" style={{ color: 'red' }}>close</span> }</td>
                  </tr>
                  <tr>
                  <td>Returns Accepted</td>
              <td>{shipping.returnsAccepted ? <span className="material-icons" style={{ color: 'green' }}>done</span> : <span className="material-icons" style={{ color: 'red' }}>close</span>}</td>
     
                  </tr>
          
          </tbody>
        </table>
      </div>
    ) : (
      <p>No shipping information available.</p>
    )}
  </div>
)}

          {/* ...other shipping details */}
    
    
            </Tab.Pane>
        <Tab.Pane eventKey="seller" active={activeTab === 'seller'}>
          {/* ...seller details */}
          {activeTab === 'seller' && (
  <div className="container mt-3">
    
    {items ? (
      <div className="table-responsive">
        <table className="table table-striped table-dark">
          <tbody>
          {/* <tr class="text-centre col-sm-6 "><td>{items.storeName}</td></tr> */}
      
           


          {items.feedbackScore && (
  <tr>
    <td>Feedback Score</td>
    <td>{items.feedbackScore}</td>
  </tr>
)}

{items.PositiveFeedbackPercent && (
  <tr>
    <td>Popularity</td>
    <td>{items.PositiveFeedbackPercent}</td>
  </tr>
)}

{items.feedbackRatingStar && (
  <tr>
    <td>Feedback Rating Star</td>
    <td>{items.feedbackRatingStar}</td>
  </tr>
)}

{typeof items.TopRatedSeller !== 'undefined' && (
  <tr>
    <td>Top Rated Seller</td>
    <td>{items.TopRatedSeller ? <span className="material-icons" style={{ color: 'green' }}>done</span> : <span className="material-icons" style={{ color: 'red' }}>close</span>}</td>
  </tr>
)}

{items.storeName && (
  <tr>
    <td>Store Name</td>
    <td>{items.storeName}</td>
  </tr>
)}

{items.storeURL && (
  <tr>
    <td>Buy Product At</td>
    <td><a href={items.storeURL} target="_blank" rel="noopener noreferrer">Store</a></td>
  </tr>
)}

          
          </tbody>
        </table>
      </div>
    ) : (
      <p>No shipping information available.</p>
    )}
  </div>




)}
        </Tab.Pane>
        <Tab.Pane eventKey="similar-products" active={activeTab === 'similar-products'}>
          {/* ...similar products */}
          {/* call similarproducts js here */}
          {activeTab === 'similar-products' && <div>
      <h2>Similar Items</h2>
      <label>
        Sort by:
        <select value={sortCategory} onChange={handleSortCategoryChange}>
          <option value="Default">Default</option>
          <option value="ProductName">Product Name</option>
          <option value="DaysLeft">Days Left</option>
          <option value="Price">Price</option>
          <option value="ShoppingCost">Shopping Cost</option>
        </select>
      </label>
      <label>
        Order:
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          disabled={isSortOrderDisabled}
        >
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>
      </label>
      {/* <ul>
        {itemsp.map((item) => (
          
          <li key={item.itemId}>
            <p>Title: {item.title}</p>
            <p>Price: {item.price}</p>
            <p>image:{item.image}</p>
            <p>Shipping Cost: {item.shippingCost}</p>
            <p>Days Left: {item.timeLeft}</p>
          </li>
        ))}
      </ul> */}
       {/* <div className="row">
                                {itemsp.slice(0, visibleItems).map((item, index) => (
                                    <div key={index} className="col-md-4 col-lg-3 mb-4">
                                        <div className="card">
                                            <img src={item.image} className="card-img-top" alt="Product" />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.title}</h5>
                                                <p className="card-text">Price: {item.price}</p>
                                                <p className="card-text">Shipping Cost: {item.shippingCost}</p>
                                                <p className="card-text">Days Left: {item.timeLeft}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div> */}
                          <div className="row">
  {itemsp.slice(0, visibleItems).map((item, index) => (
    <div key={index} className="col-12 mb-4">
      <div className="card">
        <div className="row g-0 bg-dark">
          <div className="col-md-4">
            <img src={item.image} className="img-fluid rounded-start" alt="Product" />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title text-white">{item.title}</h5>
              <p className="card-text text-white">Price: {item.price}</p>
              <p className="card-text text-white">Shipping Cost: {item.shippingCost}</p>
              <p className="card-text text-white">Days Left: {item.timeLeft}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
                            {visibleItems < itemsp.length ? (
                                <button onClick={showMore} className="btn btn-primary">
                                    Show More
                                </button>
                            ) : (
                                <button onClick={showLess} className="btn btn-secondary">
                                    Show Less
                                </button>
                            )}
    </div> }

        </Tab.Pane>
        

{/* <Tab.Pane eventKey="shipping" active={activeTab === 'shipping'}>
  {activeTab === 'shipping' && selectedItem && <ShippingTab itemId={selectedItem.id} />}
</Tab.Pane> */}
            
        </Tab.Content> 


      
</div>
</>
);                  }



export default ItemsTable;