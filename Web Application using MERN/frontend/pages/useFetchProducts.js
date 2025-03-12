import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchProducts(url) {
  const [wishlist_products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [url]); // Runs once when the component mounts, and then whenever `url` changes

  return { wishlist_products, loading, error };
}

export default useFetchProducts;
