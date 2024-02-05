import React, { useState, useEffect } from 'react';

function SimilarItems() {
  const [items, setItems] = useState([]);
  const [itemID, setitemID] = useState('');

  useEffect(() => {
    const fetchSimilarItems = async () => {
      try {
        console.log(itemID);
        const response = await fetch(`http://localhost:8080/getSimilarItems?itemID=${itemID}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setItems(data.getSimilarItemsResponse.itemRecommendations.item); // Assuming this path holds your items
        } else {
          throw new Error('Error fetching similar items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSimilarItems();
  }, [itemID]);

  return (
    <div>
      <h2>Similar Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.itemId}>
            <p>Title: {item.title}</p>
            {/* <p>Price: {item.price}}</p>
            <p>Shipping Cost: {item.shippingCost.__value__} {item.shippingCost.@currencyId}</p>
            <p>Days Left: {item.timeLeft}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SimilarItems;
