import './ProductTable.css'

function ProductTable({ products }) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio Unit.</th>
            <th>Precio x Mayor</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.codigoProducto || index}>
              <td>{product.codigoProducto}</td>
              <td>{product.tipoProducto}</td>
              <td>{product.nombreProducto}</td>
              <td>{product.cantidadStock}</td>
              <td>${product.precioUnitario?.toFixed(2)}</td>
              <td>${product.precioXMayor?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
