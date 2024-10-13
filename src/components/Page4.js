import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

function Page4() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ürün listesini API'den al
  const fetchProducts = () => {
    axios.get('/api/mark/getAll')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  // Yeni ürün ekleme
  const addProduct = (data) => {
    axios.post('https://api.example.com/products', data)
      .then((response) => {
        setProducts([...products, response.data]);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  // Ürünü güncelleme
  const updateProduct = (data) => {
    axios.put(`https://api.example.com/products/${selectedProduct.id}`, data)
      .then((response) => {
        const updatedProducts = products.map((product) =>
          product.id === selectedProduct.id ? response.data : product
        );
        setProducts(updatedProducts);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  // Ürünü silme
  const deleteProduct = (id) => {
    axios.delete(`https://api.example.com/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  // Formu gönderme işlevi (yeni ekleme veya güncelleme)
  const onSubmit = (data) => {
    if (selectedProduct) {
      updateProduct(data);
    } else {
      addProduct(data);
    }
  };

  // Ürün ekleme veya düzenleme için formu açma
  const handleOpenForm = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      reset(product); // Güncelleme için mevcut ürünü forma yükle
    }
    setOpen(true);
  };

  // Dialog'u kapatma
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // DataGrid için kolonlar
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Product Name', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteProduct(params.row.id)}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>Product List</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
        Add Product
      </Button>
      <DataGrid rows={products} columns={columns} pageSize={5} checkboxSelection />
      
      {/* Ürün ekleme/güncelleme formu için dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedProduct ? "Update Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name', { required: true })}
              label="Product Name"
              fullWidth
              margin="dense"
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedProduct ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page4;
