
import useFetchProducts from './useFetchProducts';

function ProductList() {
  const { products, loading, error } = useFetchProducts('/api/wishlist');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.data.map((product) => (
        <div key={product.id}>
          <img src={product.image} alt={product.title} />
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <button>Add to Wishlist</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
