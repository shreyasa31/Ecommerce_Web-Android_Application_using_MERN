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
    <div className="container mt-5">
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
          <td>Item Specifics</td>
          <td>
            {items.itemSpecifics.map((specific, index) => (
              <div key={index}>
                <strong>{specific.name}:</strong> {specific.value}
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
  );
                  }



export default ItemsTable;