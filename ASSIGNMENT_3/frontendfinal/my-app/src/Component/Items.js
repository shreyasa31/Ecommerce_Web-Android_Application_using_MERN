import { Tab, Nav, Row, Col } from 'react-bootstrap';
import facebookImage from './facebook.png';

const ItemsTable = ({items,handleBack}) => {
    console.log("Inside Items Table",items);
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
    const traverseCallback = () => {
      handleBack();
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
  <h2 onClick={traverseCallback}>List</h2>
  <div className="d-flex justify-content-end">
        {/* <a href="/facebook" className="me-2">
          <i className="fab fa-facebook-f"><img></img></i> {/* Font Awesome Icon */}
        {/* </a> */}
        {/* <a href="/wishlist">
          <i className="fas fa-heart"> </i> {/* Font Awesome Icon */}
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
      
      <Tab.Container id="list-tabs" defaultActiveKey="product">
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
        </Nav>

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
      </Tab.Container>
  <div className="table-responsive">
    <table className="table table-dark table-striped">
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
</div>
</>
);                  }



export default ItemsTable;