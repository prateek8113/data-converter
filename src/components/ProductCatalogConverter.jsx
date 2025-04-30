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
    image: "", // Default image
    colorImages: {}, // For color-specific images
    specs: {},
    variants: {
      colors: [],
      sizes: [] // Contains objects with {size, price} structure
    }
  });
  
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    image: ""
  });
  
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColorImage, setNewColorImage] = useState("");
  const [selectedColorForImage, setSelectedColorForImage] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newSizePrice, setNewSizePrice] = useState(""); 
  const [jsonOutput, setJsonOutput] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Track all unique spec names that have been used
  const [savedSpecNames, setSavedSpecNames] = useState([]);

  // Track the current specifications separately to persist them
  const [currentSpecs, setCurrentSpecs] = useState({});

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

  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      // Update both the newProduct specs and separate currentSpecs
      const updatedSpecs = {
        ...currentSpecs,
        [newSpecKey]: newSpecValue
      };
      
      setCurrentSpecs(updatedSpecs);
      
      setNewProduct({
        ...newProduct,
        specs: updatedSpecs
      });
      
      // Save this spec name if it's not already saved
      if (!savedSpecNames.includes(newSpecKey)) {
        setSavedSpecNames([...savedSpecNames, newSpecKey]);
      }
      
      // Keep the spec key (name) and just clear the value
      setNewSpecValue("");
    }
  };

  // Add a new color to the product variants
  const addColor = () => {
    if (newColor && !newProduct.variants.colors.includes(newColor)) {
      const updatedVariants = {
        ...newProduct.variants,
        colors: [...newProduct.variants.colors, newColor]
      };
      
      setNewProduct({
        ...newProduct,
        variants: updatedVariants
      });
      
      setNewColor("");
    }
  };

  // Add a color-specific image
  const addColorImage = () => {
    if (selectedColorForImage && newColorImage && newProduct.variants.colors.includes(selectedColorForImage)) {
      const updatedColorImages = {
        ...newProduct.colorImages,
        [selectedColorForImage]: newColorImage
      };
      
      setNewProduct({
        ...newProduct,
        colorImages: updatedColorImages
      });
      
      // Reset the input fields
      setNewColorImage("");
      setSelectedColorForImage("");
    } else if (!newProduct.variants.colors.includes(selectedColorForImage)) {
      alert("Please add this color to the product variants first");
    }
  };
  
  // Remove a color image
  const removeColorImage = (color) => {
    const updatedColorImages = { ...newProduct.colorImages };
    delete updatedColorImages[color];
    
    setNewProduct({
      ...newProduct,
      colorImages: updatedColorImages
    });
  };

  // Add a new size with price to the product variants
  const addSize = () => {
    if (newSize) {
      // Check if size already exists
      const sizeExists = newProduct.variants.sizes.some(sizeObj => sizeObj.size === newSize);
      
      if (!sizeExists) {
        const price = newSizePrice ? newSizePrice : "0";
        const newSizeObj = { size: newSize, price };
        
        const updatedVariants = {
          ...newProduct.variants,
          sizes: [...newProduct.variants.sizes, newSizeObj]
        };
        
        setNewProduct({
          ...newProduct,
          variants: updatedVariants
        });
        
        setNewSize("");
        setNewSizePrice("");
      }
    }
  };

  // Remove a color from variants
  const removeColor = (colorToRemove) => {
    // Also remove any color image associated with this color
    const updatedColorImages = { ...newProduct.colorImages };
    delete updatedColorImages[colorToRemove];
    
    setNewProduct({
      ...newProduct,
      variants: {
        ...newProduct.variants,
        colors: newProduct.variants.colors.filter(color => color !== colorToRemove)
      },
      colorImages: updatedColorImages
    });
  };

  // Remove a size from variants
  const removeSize = (sizeToRemove) => {
    setNewProduct({
      ...newProduct,
      variants: {
        ...newProduct.variants,
        sizes: newProduct.variants.sizes.filter(sizeObj => sizeObj.size !== sizeToRemove)
      }
    });
  };

  // Update price for a specific size
  const updateSizePrice = (sizeToUpdate, newPrice) => {
    const updatedSizes = newProduct.variants.sizes.map(sizeObj => 
      sizeObj.size === sizeToUpdate 
        ? { ...sizeObj, price: newPrice } 
        : sizeObj
    );
    
    setNewProduct({
      ...newProduct,
      variants: {
        ...newProduct.variants,
        sizes: updatedSizes
      }
    });
  };

  const removeSpec = (key) => {
    const updatedSpecs = { ...currentSpecs };
    delete updatedSpecs[key];
    
    setCurrentSpecs(updatedSpecs);
    
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

      // Clear the current spec key but keep the values
      setNewSpecKey("");
      
      // Show an alert that product was added successfully
      alert(`Product "${newProduct.name}" (ID: ${newProduct.id}) added to Category ${activeCategoryIndex}!`);
    }
  };

  const clearProductForm = () => {
    // Reset all product fields when explicitly requested
    setNewProduct({
      id: "",
      name: "",
      image: "",
      colorImages: {},
      specs: {},
      variants: {
        colors: [],
        sizes: []
      }
    });
    setCurrentSpecs({});
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

  const clearAllSpecs = () => {
    // Clear all specs if needed
    setCurrentSpecs({});
    setNewProduct({
      ...newProduct,
      specs: {}
    });
  };

  const generateJSON = () => {
    // Create a clean copy of the data to avoid any React state artifacts
    const cleanData = {
      productCatalog: {},
      services: []
    };
    
    // Process the product catalog data
    Object.entries(formData.productCatalog).forEach(([categoryId, products]) => {
      // Ensure each product has the correct structure
      cleanData.productCatalog[categoryId] = products.map(product => ({
        id: product.id,
        name: product.name,
        image: product.image, // Default image
        colorImages: product.colorImages || {}, // Include color-specific images
        specs: product.specs || {},
        variants: {
          colors: product.variants.colors || [],
          sizes: product.variants.sizes || []
        }
      }));
    });
    
    // Process services
    cleanData.services = formData.services.map(service => ({
      title: service.title,
      description: service.description,
      image: service.image
    }));
    
    setJsonOutput(JSON.stringify(cleanData, null, 2));
  };

  const generateSingleProductJSON = () => {
    if (newProduct.id && newProduct.name) {
      // Create a clean copy with proper structure
      const singleProduct = {
        id: newProduct.id,
        name: newProduct.name,
        image: newProduct.image, // Default image
        colorImages: newProduct.colorImages || {},
        specs: newProduct.specs || {},
        variants: {
          colors: newProduct.variants.colors || [],
          sizes: newProduct.variants.sizes || []
        }
      };
      
      setJsonOutput(JSON.stringify(singleProduct, null, 2));
    } else {
      alert("Please fill at least ID and Name fields");
    }
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

  // Function to select a saved spec name
  const selectSavedSpecName = (specName) => {
    setNewSpecKey(specName);
  };
  
  // Function to edit a spec value directly
  const editSpecValue = (key, value) => {
    const updatedSpecs = { ...currentSpecs };
    updatedSpecs[key] = value;
    
    setCurrentSpecs(updatedSpecs);
    
    setNewProduct({
      ...newProduct,
      specs: updatedSpecs
    });
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title h5 m-0">Add New Product to Category {activeCategoryIndex}</h3>
                <div>
                  <button
                    onClick={generateSingleProductJSON}
                    className="btn btn-sm btn-info me-2"
                  >
                    Preview Current Product JSON
                  </button>
                  <button
                    onClick={clearProductForm}
                    className="btn btn-sm btn-warning"
                  >
                    Clear All Fields
                  </button>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newProduct.id}
                    onChange={handleProductChange}
                    className="form-control"
                    placeholder="e.g. w1"
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
                    placeholder="e.g. wire"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Default Image Path</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleProductChange}
                    className="form-control"
                    placeholder="e.g. /images/wire.jpg"
                  />
                </div>
              </div>

              {/* Product Variants Section */}
              <div className="mb-4">
                <h4 className="h6 mb-3">Product Variants</h4>
                
                {/* Color Variants */}
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h5 className="h6 mb-0">Color Options</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-md-8">
                        <input
                          type="text"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          className="form-control"
                          placeholder="Enter color (e.g. red, green, etc.)"
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          onClick={addColor}
                          className="btn btn-success w-100"
                        >
                          Add Color
                        </button>
                      </div>
                    </div>
                    
                    {newProduct.variants.colors.length > 0 ? (
                      <div className="mt-2">
                        <h6 className="mb-2">Available Colors:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {newProduct.variants.colors.map((color, index) => (
                            <div key={index} className="badge bg-primary d-flex align-items-center p-2">
                              {color}
                              <button
                                onClick={() => removeColor(color)}
                                className="btn btn-sm text-white ms-2 p-0"
                                style={{ fontSize: '12px' }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted small mt-2">No colors added yet.</p>
                    )}
                  </div>
                </div>
                
                {/* Color-specific Images */}
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h5 className="h6 mb-0">Color-specific Images</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-md-4">
                        <select 
                          className="form-select"
                          value={selectedColorForImage}
                          onChange={(e) => setSelectedColorForImage(e.target.value)}
                        >
                          <option value="">Select a color</option>
                          {newProduct.variants.colors.map((color, idx) => (
                            <option key={idx} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-5">
                        <input
                          type="text"
                          value={newColorImage}
                          onChange={(e) => setNewColorImage(e.target.value)}
                          className="form-control"
                          placeholder="Enter image path for this color"
                        />
                      </div>
                      <div className="col-md-3">
                        <button
                          onClick={addColorImage}
                          className="btn btn-success w-100"
                          disabled={!selectedColorForImage || !newColorImage}
                        >
                          Add Image
                        </button>
                      </div>
                    </div>
                    
                    {Object.keys(newProduct.colorImages).length > 0 ? (
                      <div className="mt-3">
                        <h6 className="mb-2">Color-specific Images:</h6>
                        <table className="table table-sm table-bordered">
                          <thead>
                            <tr>
                              <th>Color</th>
                              <th>Image Path</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(newProduct.colorImages).map(([color, imgPath], idx) => (
                              <tr key={idx}>
                                <td>{color}</td>
                                <td>{imgPath}</td>
                                <td>
                                  <button
                                    onClick={() => removeColorImage(color)}
                                    className="btn btn-sm btn-danger"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted small mt-2">No color-specific images added yet.</p>
                    )}
                  </div>
                </div>
                
                {/* Size Variants with Price */}
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="h6 mb-0">Size Options with Pricing</h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-md-5">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          className="form-control"
                          placeholder="Enter size (e.g. .75mm, 1mm, etc.)"
                        />
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          value={newSizePrice}
                          onChange={(e) => setNewSizePrice(e.target.value)}
                          className="form-control"
                          placeholder="Price"
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          onClick={addSize}
                          className="btn btn-success w-100"
                        >
                          Add Size with Price
                        </button>
                      </div>
                    </div>
                    
                    {newProduct.variants.sizes.length > 0 ? (
                      <div className="mt-2">
                        <h6 className="mb-2">Available Sizes with Prices:</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newProduct.variants.sizes.map((sizeObj, index) => (
                                <tr key={index}>
                                  <td>{sizeObj.size}</td>
                                  <td>
                                    <input
                                      type="text"
                                      value={sizeObj.price}
                                      onChange={(e) => updateSizePrice(sizeObj.size, e.target.value)}
                                      className="form-control form-control-sm"
                                      placeholder="Set price"
                                    />
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => removeSize(sizeObj.size)}
                                      className="btn btn-sm btn-danger"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted small mt-2">No sizes added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="h6 m-0">Product Specifications</h4>
                  <button
                    onClick={clearAllSpecs}
                    className="btn btn-sm btn-warning"
                  >
                    Clear All Specs
                  </button>
                </div>
                
                {/* Display saved spec names as buttons */}
                {savedSpecNames.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Saved Spec Names - Click to Select:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {savedSpecNames.map((specName, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm ${newSpecKey === specName ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => selectSavedSpecName(specName)}
                        >
                          {specName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
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
                
                {/* Display current specs with inline editing */}
                {Object.keys(currentSpecs).length > 0 && (
                  <div className="mt-3 p-3 bg-white border rounded">
                    <h5 className="h6 mb-2">Current Specifications:</h5>
                    <ul className="list-group">
                      {Object.entries(currentSpecs).map(([key, value]) => (
                        <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center flex-grow-1 me-2">
                            <strong className="me-2">{key}:</strong>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => editSpecValue(key, e.target.value)}
                              className="form-control form-control-sm"
                              style={{ maxWidth: '200px' }}
                            />
                          </div>
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
                                <p className="mb-1"><strong>Default Image:</strong> {product.image}</p>
                              </div>
                              <button
                                onClick={() => removeProduct(parseInt(categoryIndex), index)}
                                className="btn btn-sm btn-danger"
                              >
                                Remove
                              </button>
                            </div>
                            
                            {/* Display color-specific images */}
                            {Object.keys(product.colorImages || {}).length > 0 && (
                              <div className="mt-2">
                                <p className="mb-1"><strong>Color Images:</strong></p>
                                <div className="table-responsive">
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Color</th>
                                        <th>Image Path</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(product.colorImages).map(([color, imgPath], i) => (
                                        <tr key={i}>
                                          <td>{color}</td>
                                          <td>{imgPath}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            
                            {/* Display colors and sizes with prices */}
                            {(product.variants.colors.length > 0 || product.variants.sizes.length > 0) && (
                              <div className="mt-2">
                                <p className="mb-1"><strong>Variants:</strong></p>
                                <div className="row">
                                  {product.variants.colors.length > 0 && (
                                    <div className="col-md-6 mb-2">
                                      <p className="mb-1 small">Colors:</p>
                                      <div className="d-flex flex-wrap gap-1">
                                        {product.variants.colors.map((color, i) => (
                                          <span key={i} className="badge bg-primary">{color}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {product.variants.sizes.length > 0 && (
                                    <div className="col-md-6 mb-2">
                                      <p className="mb-1 small">Sizes with Prices:</p>
                                      <div className="table-responsive">
                                        <table className="table table-sm">
                                          <thead>
                                            <tr>
                                              <th>Size</th>
                                              <th>Price</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {product.variants.sizes.map((sizeObj, i) => (
                                              <tr key={i}>
                                                <td>{sizeObj.size}</td>
                                                <td>{sizeObj.price}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
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

      {/* Service Form - unchanged */}
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
