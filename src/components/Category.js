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

function Category() {
  const [categorys, setCategorys] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCategorys();
  }, []);

  // Ürün listesini API'den al
  const fetchCategorys = () => {
    axios.get('/api/category/getAll')
      .then((response) => {
        setCategorys(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categorys:", error);
      });
  };

  // Yeni ürün ekleme
  const addCategory = (data) => {
    axios.post('/api/category/create', data)
      .then((response) => {
        setCategorys([...categorys, response.data]);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  // Ürünü güncelleme
  const updateCategory = (data) => {
    axios.put(`/api/category/update/${selectedCategory.id}`, data)
      .then((response) => {
        const updatedCategorys = categorys.map((category) =>
          category.id === selectedCategory.id ? response.data : category
        );
        setCategorys(updatedCategorys);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  // Ürünü silme
  const deleteCategory = (id) => {
    axios.delete(`/api/category/delete/${id}`)
      .then(() => {
        setCategorys(categorys.filter((category) => category.id !== id));
      })
      .catch((error) => { 
        console.error("Error deleting category:", error);
      });
  };

  // Formu gönderme işlevi (yeni ekleme veya güncelleme)
  const onSubmit = (data) => {
    if (selectedCategory) {
      updateCategory(data);
    } else {
      addCategory(data);
    }
  };

  // Ürün ekleme veya düzenleme için formu açma
  const handleOpenForm = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      reset(category); // Güncelleme için mevcut ürünü forma yükle
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
    { field: 'name', headerName: 'Category Name', width: 200 },
    { field: 'link', headerName: 'Category link', width: 200 },

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
            onClick={() => deleteCategory(params.row.id)}
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
      <h1>Category List</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
       Add Category 
      </Button>
      <DataGrid rows={categorys} columns={columns} pageSize={5} checkboxSelection />
      
      {/* Ürün ekleme/güncelleme formu için dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedCategory ? "Update Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name', { required: true })}
              label="Category Name"
              fullWidth
              margin="dense"
            />
            <TextField
              {...register('link', { required: true })}
              label="Category Link"
              fullWidth
              margin="dense"
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedCategory ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Category;
