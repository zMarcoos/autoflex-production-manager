import { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [plan, setPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const responseMaterials = await fetch('http://localhost:8080/api/materials');
      if (!responseMaterials.ok) {
        throw new Error("Erro ao carregar materiais");
      }

      const dataMaterials = await responseMaterials.json();
      setMaterials(dataMaterials);

      const responseProducts = await fetch('http://localhost:8080/api/products');
      if (!responseProducts.ok) {
        throw new Error("Erro ao carregar produtos");
      }
      
      const dataProducts = await responseProducts.json();
      setProducts(dataProducts);

      const responsePlan = await fetch('http://localhost:8080/api/plan');
      if (!responsePlan.ok) {
        throw new Error("Erro ao calcular plano");
      }

      const dataPlan = await responsePlan.json();
      setPlan(dataPlan);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro de conexão. Verifique se o Backend (Quarkus) está rodando.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="header-title">🏭 Autoflex Production Manager</h1>

      <button className="button-update" onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Carregando...' : '🔄 Atualizar Dados'}
      </button>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="grid-layout">
        <div className="card-container">
          <h3>📦 Estoque Atual</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((rawMaterial) => (
                <tr key={rawMaterial.id}>
                  <td>{rawMaterial.name}</td>
                  <td><span className="quantity-badge">{rawMaterial.stockQuantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-container">
          <h3>🪑 Catálogo</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço</th>
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
        <h2>🚀 Plano de Produção Sugerido</h2>
        <p>Prioridade: <strong>Maior Valor Agregado</strong></p>

        {plan.length === 0 && !isLoading ? (
          <div className="empty-message">
            ⚠️ Com o estoque atual, não é possível produzir nenhum item.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="result-header">
                <th>Produto</th>
                <th>Quantidade Sugerida</th>
                <th>Faturamento Estimado</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((item, index) => (
                <tr key={index} style={{ background: 'white' }}>
                  <td>{item.productName}</td>
                  <td style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                    {item.quantityProduced} unidades
                  </td>
                  <td className="price-text">
                    R$ {item.totalEstimatedValue?.toFixed(2)}
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
