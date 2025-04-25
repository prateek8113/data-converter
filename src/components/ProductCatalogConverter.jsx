// ProductCatalogConverter.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCatalogConverter = () => {
  const [formData, setFormData] = useState({
    productCatalog: {
      0: [],
      1: [],
      2: [],
      3: []
    },
    services: []
  });

  const [activeTab, setActiveTab] = useState('product');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    image: "",
    specs: {}
  });
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    image: ""
  });
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  // Modified addSpec function to keep the spec name after adding
  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setNewProduct({
        ...newProduct,
        specs: {
          ...newProduct.specs,
          [newSpecKey]: newSpecValue
        }
      });
      // Keep the spec key (name) but clear only the spec value
      setNewSpecValue("");
      // DO NOT reset the spec key/name: setNewSpecKey("");
    }
  };

  const removeSpec = (key) => {
    const updatedSpecs = { ...newProduct.specs };
    delete updatedSpecs[key];
    setNewProduct({
      ...newProduct,
      specs: updatedSpecs
    });
  };

  const addProduct = () => {
    if (newProduct.id && newProduct.name) {
      const updatedCatalog = { ...formData.productCatalog };
      updatedCatalog[activeCategoryIndex] = [
        ...updatedCatalog[activeCategoryIndex],
        { ...newProduct }
      ];

      setFormData({
        ...formData,
        productCatalog: updatedCatalog
      });

      // Reset product form
      setNewProduct({
        id: "",
        name: "",
        image: "",
        specs: {}
      });
      
      // Also reset the spec inputs when adding a product
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const addService = () => {
    if (newService.title && newService.description) {
      setFormData({
        ...formData,
        services: [...formData.services, { ...newService }]
      });

      // Reset service form
      setNewService({
        title: "",
        description: "",
        image: ""
      });
    }
  };

  const removeProduct = (categoryIndex, productIndex) => {
    const updatedCatalog = { ...formData.productCatalog };
    updatedCatalog[categoryIndex] = updatedCatalog[categoryIndex].filter((_, index) => index !== productIndex);
    setFormData({
      ...formData,
      productCatalog: updatedCatalog
    });
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const generateJSON = () => {
    setJsonOutput(JSON.stringify(formData, null, 2));
  };

  const copyToClipboard = () => {
    // Create a temporary textarea element to copy from
    const textArea = document.createElement("textarea");
    textArea.value = jsonOutput;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        console.error("Copy command was unsuccessful");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Product Catalog Data Converter</h1>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => setActiveTab('product')}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            Services
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview & Export
          </button>
        </li>
      </ul>

      {/* Product Form */}
      {activeTab === 'product' && (
        <div>
          <div className="mb-4">
            <h2 className="h4 mb-3">Select Category</h2>
            <div className="btn-group mb-3">
              {Object.keys(formData.productCatalog).map((category) => (
                <button
                  key={category}
                  className={`btn ${activeCategoryIndex === parseInt(category) ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategoryIndex(parseInt(category))}
                >
                  Category {category}
                </button>
              ))}
            </div>
          </div>

          <div className="card mb-4 bg-light">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">Add New Product to Category {activeCategoryIndex}</h3>
              <div className="row mb-3">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newProduct.id}
                    onChange={handleProductChange}
                    className="form-control"
                    placeholder="e.g. 1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleProductChange}
                    className="form-control"
                    placeholder="e.g. Crystal Chandelier"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Image Path</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleProductChange}
                    className="form-control"
                    placeholder="e.g. /images/chandelier.jpg"
                  />
                </div>
              </div>

              <div className="mb-3">
                <h4 className="h6 mb-2">Product Specifications</h4>
                <div className="row mb-2">
                  <div className="col-md-4 mb-2">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      className="form-control"
                      placeholder="Spec name (e.g. wattage)"
                    />
                  </div>
                  <div className="col-md-4 mb-2">
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      className="form-control"
                      placeholder="Value (e.g. 60W)"
                    />
                  </div>
                  <div className="col-md-4 mb-2">
                    <button
                      onClick={addSpec}
                      className="btn btn-success"
                    >
                      Add Spec
                    </button>
                  </div>
                </div>
                
                {/* Display current specs */}
                {Object.keys(newProduct.specs).length > 0 && (
                  <div className="mt-3 p-3 bg-white border rounded">
                    <h5 className="h6 mb-2">Current Specifications:</h5>
                    <ul className="list-group">
                      {Object.entries(newProduct.specs).map(([key, value]) => (
                        <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                          <span><strong>{key}:</strong> {value}</span>
                          <button
                            onClick={() => removeSpec(key)}
                            className="btn btn-sm btn-danger"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={addProduct}
                className="btn btn-primary w-100"
              >
                Add Product to Category {activeCategoryIndex}
              </button>
            </div>
          </div>

          {/* Display current products by category */}
          <div>
            <h3 className="h4 mb-3">Current Products</h3>
            {Object.entries(formData.productCatalog).map(([categoryIndex, products]) => (
              <div key={categoryIndex} className="mb-4">
                <h4 className="h5 mb-2">Category {categoryIndex} ({products.length} products)</h4>
                {products.length > 0 ? (
                  <div className="row">
                    {products.map((product, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="mb-1"><strong>ID:</strong> {product.id}</p>
                                <p className="mb-1"><strong>Name:</strong> {product.name}</p>
                                <p className="mb-1"><strong>Image:</strong> {product.image}</p>
                              </div>
                              <button
                                onClick={() => removeProduct(parseInt(categoryIndex), index)}
                                className="btn btn-sm btn-danger"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-2">
                              <p className="mb-1"><strong>Specifications:</strong></p>
                              <ul className="list-group">
                                {Object.entries(product.specs).map(([key, value]) => (
                                  <li key={key} className="list-group-item py-1">{key}: {value}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No products in this category yet.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Form */}
      {activeTab === 'service' && (
        <div>
          <div className="card mb-4 bg-light">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">Add New Service</h3>
              <div className="mb-3">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={newService.title}
                  onChange={handleServiceChange}
                  className="form-control"
                  placeholder="e.g. Designer Lighting Solution"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleServiceChange}
                  className="form-control"
                  rows="3"
                  placeholder="Service description..."
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Image Path</label>
                <input
                  type="text"
                  name="image"
                  value={newService.image}
                  onChange={handleServiceChange}
                  className="form-control"
                  placeholder="e.g. /images/lighting.png"
                />
              </div>
              <button
                onClick={addService}
                className="btn btn-primary w-100"
              >
                Add Service
              </button>
            </div>
          </div>

          {/* Display current services */}
          <div>
            <h3 className="h4 mb-3">Current Services</h3>
            {formData.services.length > 0 ? (
              <div className="row">
                {formData.services.map((service, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="mb-1"><strong>Title:</strong> {service.title}</p>
                            <p className="mb-1"><strong>Image:</strong> {service.image}</p>
                            <p className="mb-1"><strong>Description:</strong> {service.description}</p>
                          </div>
                          <button
                            onClick={() => removeService(index)}
                            className="btn btn-sm btn-danger"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No services added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Preview & Export */}
      {activeTab === 'preview' && (
        <div>
          <div className="mb-4">
            <button
              onClick={generateJSON}
              className="btn btn-success btn-lg"
            >
              Generate JSON
            </button>
          </div>

          {jsonOutput && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="h4">JSON Output</h3>
                <button
                  onClick={copyToClipboard}
                  className="btn btn-primary"
                >
                  {copySuccess ? "✓ Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <pre className="bg-dark text-light p-3 rounded" style={{ overflowX: 'auto' }}>
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCatalogConverter;
