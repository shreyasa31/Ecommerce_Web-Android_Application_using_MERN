// Function to add an item to the wishlist
function addToWishlist(productId, title, price, shipping) {
    fetch('/wishlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({productId,image, title, price, shipping })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Item added to wishlist:', data);
    })
    .catch(error => {
      console.error('Error adding item to wishlist:', error);
    });
  }
  
  // Function to get the wishlist and display it
  function displayWishlist(userId) {
    fetch(`/wishlist/${userId}`)
    .then(response => response.json())
    .then(items => {
      // Here you would create the HTML table and fill it with the items
      const wishlistTable = document.getElementById('wishlistTable');
      wishlistTable.innerHTML = ''; // Clear the table first
      items.forEach(item => {
        wishlistTable.innerHTML += `
          <tr>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.shipping}</td>
          </tr>
        `;
      });
    })
    .catch(error => {
      console.error('Error retrieving wishlist:', error);
    });
  }
  
  // Event listeners for wishlist buttons
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function() {
      const itemData = this.dataset; // Assuming you store item data in data-* attributes
      addToWishlist(itemData.userId, itemData.productId, itemData.title, itemData.price, itemData.shipping);
    });
  });
  
  // Event listener for displaying wishlist
  document.getElementById('showWishlist').addEventListener('click', function() {
    const userId = this.dataset.userId; // Set the
  