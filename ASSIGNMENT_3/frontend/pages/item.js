import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'bootstrap';

// write component and export it



// const handleSearch = async (e) => {
//     // To prevent form submission
//     e.preventDefault();
//    const conditions = [];
//    for (let key in condition) {
//        if (condition[key]) {
//            conditions.push(key);
//        }
//    }
//    console.log(conditions);
 
//    const shippingOptions = [];
//    for (let key in shippingOption) {
//        if (shippingOption[key]) {
//            shippingOptions.push(key);
//        }
//    }
 
//    const params = new URLSearchParams({
//        keyword: keyword,
//        category: category,
//        condition: conditions.join(','),
//        ...shippingOptions.reduce((acc, val) => ({ ...acc, [val]: true }), {}),
//        distance: distance,
//        buyerPostalCode: fromOption === 'other' ? zipCode : undefined
//    });
 
//    const url = `http://localhost:8080/search?${params.toString()}`;
 
//    try {
//        const response = await axios.get(url);
//        console.log(response.data);  // Handle response data as needed
//        setShowTableHeaders(true);
//        setShowDetail(true);
//        setProducts(response.data.message.items);
 
//    } catch (error) {
//        console.error("Error fetching data:", error);
//    }
//  }
 

// const ItemDetailPage = () => {
//     // State to store the item details
//     const [itemData, setItemDetails] = useState(null);
  
//     // Function to process the item detail data
//     const processItemDetailData = (data) => {
//       if (!data || !data.Item) return null;
  
//       let item = {
//         photo: data.Item.PictureURL || [],
//         price: data.Item.CurrentPrice?.Value || '',
//         location: data.Item.Location || '',
//         returnPolicy: data.Item.ReturnPolicy || '',
//         itemSpecifics: (data.Item.ItemSpecifics?.NameValueList || [])
//           .filter(i => i.Name && i.Value && i.Value.length > 0)
//           .map(i => ({ name: i.Name, value: i.Value[0] })),
//       };
  
//       return item;
//     };
  
//     // Effect hook to fetch item details
//     useEffect(() => {
//       const fetchItemDetails = async () => {
//         try {
//           // Replace with your actual URL and item I
//           const itemID = '335007021375';

// const response = await axios.get(`http://localhost:8080/getItem?ItemID=${itemID}`);

//           const processedData = processItemDetailData(response.data);
//           setItemDetails(processedData);
//         } catch (error) {
//           console.error('Error fetching item details:', error);
//         }
//       };
  
//       fetchItemDetails();
//     }, []);
   const ItemsTable = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      setLoading(true);
      const itemID = '335007021375'; // The item ID you want to fetch
      fetch(`http://localhost:8080/getItem?ItemID=${itemID}`)
 // replace '/api/your-endpoint' with your actual API endpoint
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setItems(data);
        })
        .catch(error => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
    
  return (
    <div className="container mt-5">
      {items && (
        <table>
          <tbody>
            {items.photo && (
              <tr>
                <td>Photo</td>
                <td>
                  {items.photo.map((url, index) => (
                    <img key={index} src={url} alt="Item" width="50" />
                  ))}
                </td>
              </tr>
            )}
            {items.price && (
              <tr>
                <td>Price</td>
                <td>{items.price}</td>
              </tr>
            )}
            {items.location && (
              <tr>
                <td>Location</td>
                <td>{items.location}</td>
              </tr>
            )}
            {items.returnPolicy && (
              <tr>
                <td>Return Policy</td>
                <td>{items.returnPolicy}</td>
              </tr>
            )}
            {items.itemSpecifics && items.itemSpecifics.length > 0 && (
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
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ItemsTable;


