// TabsComponent.jsx
import { Tab, Nav } from 'react-bootstrap';

const TabsComponent = ({ onSelectTab }) => {
  
  return (
    <Tab.Container id="list-tabs" defaultActiveKey="product" onSelect={(selectedKey) => onSelectTab(selectedKey)}>
     
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
    </Tab.Container>
  );
};

export default TabsComponent;
