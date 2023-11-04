const ItemsTable = (items) => {
    console.log("Inside Items Table",items);
    console.log(items.items.photo)
    console.log(items.items.price)
    // const [items, setItems] = useState([]);
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
    
  return (
    <div className="container mt-5">
      {(
        <table>
          <tbody>
            {items.items.photo && (
              <tr>
                <td>Photo</td>
                <td>
                  {items.items.photo.map((url, index) => (
                    <img key={index} src={url} alt="Item" width="50" />
                  ))}
                </td>
              </tr>
            )}
            {items.items.price && (
              <tr>
                <td>Price</td>
                <td>{items.items.price}</td>
              </tr>
            )}
            {items.items.location && (
              <tr>
                <td>Location</td>
                <td>{items.items.location}</td>
              </tr>
            )}
            {/* {items.returnPolicy && (
              <tr>
                <td>Return Policy</td>
                <td>{items.returnPolicy}</td>
              </tr>
            )} */}
            {/* {items.itemSpecifics && items.itemSpecifics.length > 0 && (
              <tr>
                <td>Item Specifics</td>
                <td>
                  {items.itemSpecifics.map((specific, index) => (
                    <div key={index}>
                      {specific.name}: {specific.value}
                    </div>
                  ))}
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ItemsTable;


