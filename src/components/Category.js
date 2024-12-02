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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('/api/category/getAll')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  const addCategory = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await axios.post('/api/category/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCategories();
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await axios.put(`/api/category/update/${selectedCategory.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCategories();
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = (id) => {
    axios.delete(`/api/category/delete/${id}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  };

  const onSubmit = (data) => {
    if (selectedCategory) {
      updateCategory(data);
    } else {
      addCategory(data);
    }
  };

  const handleOpenForm = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      reset(category);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Category Name', width: 200 },
    {
      field: 'image',
      headerName: 'Image',
      width: 200,
      renderCell: (params) => (
        <img
          src={`data:image/jpeg;base64,${params.value}`}
          alt="Category"
          style={{ width: '100%', height: 'auto' }}
        />
      ),
    },
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
      <DataGrid rows={categories} columns={columns} pageSize={5} checkboxSelection />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedCategory ? 'Update Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name', { required: true })}
              label="Category Name"
              fullWidth
              margin="dense"
            />
            <input
              type="file"
              {...register('image')}
              accept="image/*"
              style={{ marginTop: '16px' }}
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedCategory ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Category;
