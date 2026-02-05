import { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [productionPlan, setProductionPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialQuantity, setNewMaterialQuantity] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const responseMaterials = await fetch('http://localhost:8080/api/materials');
      if (!responseMaterials.ok) {
        throw new Error("Failed to fetch materials");
      }

      const dataMaterials = await responseMaterials.json();
      setRawMaterials(dataMaterials);

      const responseProducts = await fetch('http://localhost:8080/api/products');
      if (!responseProducts.ok) {
        throw new Error("Failed to fetch products");
      }

      const dataProducts = await responseProducts.json();
      setProducts(dataProducts);

      const responsePlan = await fetch('http://localhost:8080/api/plan');
      if (!responsePlan.ok) {
        throw new Error("Failed to fetch production plan");
      }

      const dataPlan = await responsePlan.json();
      setProductionPlan(dataPlan);
    } catch (error) {
      console.error(error);
      setErrorMessage("Connection error. Please check if the Backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMaterial = async (event) => {
    event.preventDefault();
    try {
      await fetch('http://localhost:8080/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMaterialName,
          stockQuantity: parseInt(newMaterialQuantity)
        })
      });
      setNewMaterialName('');
      setNewMaterialQuantity('');
      fetchData();
    } catch (error) {
      alert('Error creating material', error);
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();

    try {
      await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          compositions: []
        })
      });

      setNewProductName('');
      setNewProductPrice('');
      fetchData();
    } catch (error) {
      alert('Error creating product', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header-title">🏭 Autoflex Production Manager</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="card-container" style={{ marginBottom: '30px' }}>
        <h3>➕ Quick Registration</h3>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

          <form onSubmit={handleCreateMaterial} style={{ flex: 1 }}>
            <h4>New Raw Material</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                placeholder="Name (e.g., Steel)"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                required
                style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                placeholder="Qty"
                type="number"
                value={newMaterialQuantity}
                onChange={(e) => setNewMaterialQuantity(e.target.value)}
                required
                style={{ padding: '8px', width: '80px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button type="submit" className="button-update" style={{ margin: 0, fontSize: '0.9rem' }}>Save</button>
            </div>
          </form>

          <form onSubmit={handleCreateProduct} style={{ flex: 1 }}>
            <h4>New Product</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                placeholder="Name (e.g., Table)"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required
                style={{ padding: '8px', flex: 1, border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                placeholder="Price"
                type="number"
                step="0.01"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                required
                style={{ padding: '8px', width: '80px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button type="submit" className="button-update" style={{ margin: 0, fontSize: '0.9rem' }}>Save</button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid-layout">
        <div className="card-container">
          <h3>📦 Current Stock</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((rawMaterial) => (
                <tr key={rawMaterial.id}>
                  <td>{rawMaterial.name}</td>
                  <td><span className="quantity-badge">{rawMaterial.stockQuantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-container">
          <h3>🪑 Product Catalog</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className="price-text">
                    {product.price ? `R$ ${product.price.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>🚀 Production Plan</h2>
          <button className="button-update" onClick={fetchData} disabled={isLoading} style={{ margin: 0 }}>
            {isLoading ? 'Wait...' : '🔄 Recalculate'}
          </button>
        </div>
        <p style={{ marginTop: '10px' }}>Priority Strategy: <strong>Highest Value First</strong></p>

        {productionPlan.length === 0 ? (
          <div className="empty-message">
            ⚠️ No items can be produced with current stock.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="result-header">
                <th>Product</th>
                <th>Suggested Quantity</th>
                <th>Estimated Total Value</th>
              </tr>
            </thead>
            <tbody>
              {productionPlan.map((planItem, index) => (
                <tr key={index} style={{ background: 'white' }}>
                  <td>{planItem.productName}</td>
                  <td style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                    {planItem.quantityProduced} units
                  </td>
                  <td className="price-text">
                    R$ {planItem.totalEstimatedValue?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
