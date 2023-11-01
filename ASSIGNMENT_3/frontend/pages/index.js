import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import axios from 'axios';


export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [condition, setCondition] = useState({ New: false, Used: false, Unspecified: false });
  const [shippingOption, setShippingOption] = useState({ localPickup: false, freeshipping: false });
  const [distance, setDistance] = useState('');
  const [fromOption, setFromOption] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [products, setProducts] = useState(null);
  
  // function getIconUnicode(iconName) {
  //   // Map icon names to their Unicode values (this is just an example, replace with the correct mappings)
  //   const iconMap = {
  //     '🖤': 'add_shopping_cart',  // Replace with actual Unicode
  //     // ... add other icons as needed
  //   };
  
  //   return iconMap[iconName] || '';
  // }
  const getIconDisplay = (iconType) => {
    if (iconType === "cart_icon") {
        // return <i className="material-icons"></i>;
       return  <span class="material-icons">
add_shopping_cart
</span>;
    } else {
        return iconType; // or some default display, like a placeholder text or icon
    }
}

const handleSearch = async (e) => {
  e.preventDefault();  // To prevent form submission

  const conditions = [];
  for (let key in condition) {
      if (condition[key]) {
          conditions.push(key);
      }
  }
  console.log(conditions);

  const shippingOptions = [];
  for (let key in shippingOption) {
      if (shippingOption[key]) {
          shippingOptions.push(key);
      }
  }

  const params = new URLSearchParams({
      keyword: keyword,
      category: category,
      condition: conditions.join(','),
      ...shippingOptions.reduce((acc, val) => ({ ...acc, [val]: true }), {}),
      distance: distance,
      buyerPostalCode: fromOption === 'other' ? zipCode : undefined
  });

  const url = `http://localhost:8080/search?${params.toString()}`;

  try {
      const response = await axios.get(url);
      console.log(response.data);  // Handle response data as needed
      setProducts(response.data.message.items);

  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

  

  return (
    <>
      <div className={styles.row + " bg-dark text-white p-2 justify-content-center align-items-center search_container"}>

        <div className="container mt-5">
          <h3 className="mb-4 text-center">Product Search</h3>
          <form>
            <div className="form-group row">
              <label htmlFor="keyword" className="col-12 col-md-2 col-form-label">Keyword</label>
              <div className="col-12 col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  id="keyword" 
                  placeholder="Enter Product Name(Eg. iPhone 8)" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="category" className="col-12 col-md-2 col-form-label">Category</label>
              <div className="col-12 col-md-4">
                <select 
                  className="form-control" 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                        <option value="All Categories">All Categories</option>
                        <option value="Art">Art</option>
                        <option value="Baby">Baby</option>
                        <option value="Books">Books</option>
                        <option value="Clothing">Clothing, Shoes & Accessories</option>
                        <option value="Computers">Computers/Tablets & Networking</option>
                        <option value="Music">Music</option>
                        <option value="Health&Beauty">Health & Beauty</option>
                        <option value="VideoGames">Vidoe Games & Consoles</option>
                </select>
              </div>
            </div>

            {/* ... [Continue with the same pattern for other fields] */}
            
            <div className="form-group row">
              <label htmlFor="distance" className="col-12 col-md-2 col-form-label">Distance (Miles)</label>
              <div className="col-12 col-md-4">
                <input 
                  type="text" 
                  className="form-control" 
                  id="distance" 
                  placeholder="10"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-12 col-md-2">From</label>
              <div className="col-12 col-md-6">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="fromOption" 
                    id="currentLocation" 
                    value="currentLocation"
                    checked={fromOption === 'currentLocation'}
                    onChange={() => setFromOption('currentLocation')}
                  />
                  <label className="form-check-label" for="currentLocation">Current Location</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="fromOption" 
                    id="other" 
                    value="other"
                    checked={fromOption === 'other'}
                    onChange={() => setFromOption('other')}
                  />
                  <label className="form-check-label" htmlFor="other">Other. Please specify zip code:</label>
                  <input 
                    type="text" 
                    className="form-control mt-2" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
            </div></div>
             {/* Conditions */}
<div className="form-group row">
  <label className="col-12 col-md-2">Condition</label>
  <div className="col-12 col-md-6">
    <div className="form-check form-check-inline">
      <input 
        className="form-check-input" 
        type="checkbox" 
        id="new" 
        value="New"
        checked={condition.New}
        onChange={() => setCondition(prevState => ({ ...prevState, New: !prevState.New }))}
      />
      <label className="form-check-label" htmlFor="new">New</label>
    </div>
    <div className="form-check form-check-inline">
      <input 
        className="form-check-input" 
        type="checkbox" 
        id="used" 
        value="Used"
        checked={condition.Used}
        onChange={() => setCondition(prevState => ({ ...prevState, Used: !prevState.Used }))}
      />
      <label className="form-check-label" htmlFor="used">Used</label>
    </div>
    <div className="form-check form-check-inline">
      <input 
        className="form-check-input" 
        type="checkbox" 
        id="unspecified" 
        value="Unspecified"
        checked={condition.Unspecified}
        onChange={() => setCondition(prevState => ({ ...prevState, Unspecified: !prevState.Unspecified }))}
      />
      <label className="form-check-label" htmlFor="unspecified">Unspecified</label>
    </div>
  </div>
</div>

{/* Shipping Options */}
<div className="form-group row">
  <label className="col-12 col-md-2">Shipping Options</label>
  <div className="col-12 col-md-6">
    <div className="form-check form-check-inline">
      <input 
        className="form-check-input" 
        type="checkbox" 
        name="shippingOption" 
        id="localPickup" 
        value="localPickup"
        checked={shippingOption.localPickup}
        onChange={() => setShippingOption(prevState => ({ ...prevState, localPickup: !prevState.localPickup }))}
      />
      <label className="form-check-label" htmlFor="localPickup">Local Pickup</label>
    </div>
    <div className="form-check form-check-inline">
      <input 
        className="form-check-input" 
        type="checkbox" 
        name="shippingOption" 
        id="freeshipping" 
        value="freeshipping"
        checked={shippingOption.freeshipping}
        onChange={() => setShippingOption(prevState => ({ ...prevState, freeshipping: !prevState.freeshipping }))}
      />
      <label className="form-check-label" htmlFor="freeshipping">Free Shipping</label>
    </div>
  </div>
</div>

{/* Buttons */}
<div className="form-group row justify-content-center">
  <div className="col-12 col-md-6 text-cente">
    <button type="submit" className="btn btn-primary mr-2" onClick={handleSearch}>Search</button>
    <button type="reset" className="btn btn-secondary">Clear</button>
  </div>
</div>

            
          </form>
          
        </div>
      </div>
      <div className="container mt-3">
      {products && products.length > 0 && (
      <div className="table-responsive">
      <table class=" table table-dark table-striped table-hover tabled w-100 custom-row-height">
  <thead>
    <tr>
      <th class=" bg-dark text-white"  scope="col">#</th>
      <th class=" bg-dark text-white"  scope="col">Image</th>
      <th class=" bg-dark text-white"  scope="col">Title</th>
      <th class=" bg-dark text-white" scope="col">Price</th>
      <th class=" bg-dark text-white"  scope="col">Shipping</th>
      <th class=" bg-dark text-white"  scope="col">Zip</th>
      <th class=" bg-dark text-white"  scope="col">Wishlist</th>
    </tr>
  </thead>
  <tbody >
    
  {
  products && products.map((element, index) => (
    <tr  key={index}>
      <td class=" bg-dark text-white"  scope="row">{index + 1}</td>
      {/* <td class=" bg-dark text-white" ><img src={element.image} alt="" width='100' height='100'/></td> */}
      
      <td className="bg-dark text-white">
  <a href={`./image/ImageView?imageUrl=${encodeURIComponent(element.image)}`} target="_blank" rel="noopener noreferrer">
    <img src={element.image} alt="error" width='100' height='100'/>
  </a>
</td>
      <td className="bg-dark text-white text-truncate" style={{ maxWidth: "150px"}}> <a href="http://www.google.com" className="d-block text-truncate always-blue">{element.title}</a></td> 
      <td class=" bg-dark text-white" >{element.price}</td>
      <td class=" bg-dark text-white" >{element.shippingType}</td>
      <td class=" bg-dark text-white" >{element.zipcode}</td>
      
      {/* <td class=" bg-dark text-white"><button >{element.wishlist.icon}</button></td> */}
      {/* <td  className="bg-dark text-white material-symbols-outlined ">
    <button dangerouslySetInnerHTML={{ __html: getIconUnicode(element.wishlist.icon) }}></button>
</td> */}
<td className="bg-dark text-white">
        <button>
          {getIconDisplay(element.wishlist.icon)}
        </button>
      </td>


    </tr> 
  ))
}

  </tbody>
</table></div>)}

      </div>
    </>
  )
}
