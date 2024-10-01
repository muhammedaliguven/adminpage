import React, { useState } from 'react';
import { useTable } from 'react-table';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Ürün 1', price: 100 },
    { id: 2, name: 'Ürün 2', price: 150 },
    { id: 3, name: 'Ürün 3', price: 200 },
  ]);

  const [newProduct, setNewProduct] = useState({ id: '', name: '', price: '' });
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({ id: '', name: '', price: '' });

  // Ürün ekleme fonksiyonu
  const handleAddProduct = () => {
    const updatedProducts = [...products, { ...newProduct, id: products.length + 1 }];
    setProducts(updatedProducts);
    setNewProduct({ id: '', name: '', price: '' });
  };

  // Ürün güncelleme fonksiyonu
  const handleUpdateProduct = (id) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? editProduct : product
    );
    setProducts(updatedProducts);
    setEditProductId(null);
  };

  // Ürün silme fonksiyonu
  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  // Tablo kolonları
  const columns = React.useMemo(
    () => [
      {
        Header: 'Ürün Adı',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Fiyat',
        accessor: 'price',
      },
      {
        Header: 'İşlemler',
        Cell: ({ row }) => (
          <>
            {editProductId === row.original.id ? (
              <>
                <button onClick={() => handleUpdateProduct(row.original.id)}>Kaydet</button>
                <button onClick={() => setEditProductId(null)}>İptal</button>
              </>
            ) : (
              <>
                <button onClick={() => { setEditProductId(row.original.id); setEditProduct(row.original); }}>Düzenle</button>
                <button onClick={() => handleDeleteProduct(row.original.id)}>Sil</button>
              </>
            )}
          </>
        ),
      },
    ],
    [editProductId, editProduct]
  );

  const data = React.useMemo(() => products, [products]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <h2>Ürün Listesi</h2>
      {/* Ürün Ekleme */}
      <div>
        <input
          type="text"
          placeholder="Ürün Adı"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={handleAddProduct}>Ürün Ekle</button>
      </div>

      {/* Ürün Listesi */}
      <table {...getTableProps()} style={{ border: 'solid 1px blue', marginTop: '20px' }}>
        <thead>
          {
            headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>{column.render('Header')}</th>
                ))}
              </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {
                    row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray' }}>
                          {cell.render('Cell')}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>

      {/* Ürün Güncelleme Alanı */}
      {editProductId && (
        <div style={{ marginTop: '20px' }}>
          <h3>Ürünü Düzenle</h3>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Fiyat"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export default Products;