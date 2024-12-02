import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

const Mark = () => {
  const [marks, setMarks] = useState([]); // Mark verilerini saklar
  const [categories, setCategories] = useState([]); // Kategorileri saklar
  const [selectedMark, setSelectedMark] = useState(null); // Seçili mark
  const [open, setOpen] = useState(false); // Dialog açık/kapalı durumu
  const { register, handleSubmit, reset, setValue, control } = useForm(); // React Hook Form kontrolü

  // API'den mark ve kategori verilerini çek
  useEffect(() => {
    fetchMarks();
    fetchCategories();
  }, []);

  
  const fetchMarks = () => {
    axios
      .get('/api/mark/getAll')
      .then((response) => {
        console.log('Fetched marks:', response.data); // Gelen veriyi konsola yazdır
        setMarks(response.data); // Gelen veriyi state'e kaydet
      })
      .catch((error) => {
        console.error('Error fetching marks:', error); // Hata durumunu konsola yazdır
      });
  };

  const fetchCategories = () => {
    axios
      .get('/api/category/getAll')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  // Form açıldığında verileri doldur veya sıfırla
  const handleOpenForm = (mark = null) => {
    setSelectedMark(mark);
    if (mark) {
      setValue('name', mark.name);
      setValue('categoryId', mark.categoryId);
    } else {
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedMark(null);
  };

  // Mark ekleme işlemi
  const addMark = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name); // Adı ekle
    formData.append('categoryId', data.categoryId); // Kategori ID'sini ekle
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]); // Dosyayı ekle
    }
  
    try {
      await axios.post('/api/mark/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchMarks(); // Verileri yenile
      handleClose(); // Formu kapat
    } catch (error) {
      console.error('Error adding mark:', error);
    }
  };
  

  const updateMark = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]); // Dosyayı ekle
    }
    formData.append('categoryId', data.categoryId);
  
    axios
      .put(`/api/mark/update/${selectedMark.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        fetchMarks();
        handleClose();
      })
      .catch((error) => console.error('Error updating mark:', error));
  };

  // Mark silme işlemi
  const deleteMark = (id) => {
    axios
      .delete(`/api/mark/delete/${id}`)
      .then(() => fetchMarks())
      .catch((error) => console.error('Error deleting mark:', error));
  };

  // Base64 formatına dönüştürme işlemi
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Sadece Base64 kısmını al
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Form gönderimi
  const onSubmit = (data) => {
    if (selectedMark) {
      updateMark(data);
    } else {
      addMark(data);
    }
  };

  // DataGrid sütunları
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Mark Name', width: 200 },
    {
      field: 'image',
      headerName: 'Image',
      width: 200,
      renderCell: (params) => {
        const base64Image = params.value; // Değer Base64 string
        return (
          <img
            src={`data:image/jpeg;base64,${base64Image}`} // Base64 formatını görüntüler
            alt="Mark"
            style={{ width: '100%', height: 'auto' }}
          />
        );
      },
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      width: 200,
      valueGetter: (params) => {
        const category = categories.find((cat) => cat.id === params);
        return category ? category.name : 'N/A';
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenForm(params.row)}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteMark(params.row.id)}
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
      <h1>Mark List</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
        Add Mark
      </Button>
      <DataGrid rows={marks} columns={columns} pageSize={5} checkboxSelection />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedMark ? 'Update Mark' : 'Add Mark'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('name', { required: true })} label="Mark Name" fullWidth margin="dense" />
            <input
              type="file"
              {...register('image')}
              accept="image/*"
              style={{ marginTop: '16px' }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select {...field} label="Category">
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedMark ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mark;
