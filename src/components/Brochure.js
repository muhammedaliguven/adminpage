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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

function Brochure() {
  const [brochures, setBrochures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchBrochures();
    fetchCategories();
    fetchMarks();
  }, []);

  // Broşür listesini API'den al
  const fetchBrochures = () => {
    axios.get('/api/brochure/getAll')
      .then((response) => {
        setBrochures(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brochures:", error);
      });
  };

  // Kategori listesini API'den al
  const fetchCategories = () => {
    axios.get('/api/category/getAll')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

   // Marka listesini API'den al
   const fetchMarks = () => {
    axios.get('/api/mark/getAll')
      .then((response) => {
        setMarks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Yeni broşür ekleme
  const addBrochure = (data) => {
    axios.post('/api/brochure/create', data)
      .then((response) => {
        setBrochures([...brochures, response.data]);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error adding brochure:", error);
      });
  };

  // Broşürü güncelleme
  const updateBrochure = (data) => {
    axios.put(`/api/brochure/update/${selectedBrochure.id}`, data)
      .then((response) => {
        const updatedBrochures = brochures.map((brochure) =>
          brochure.id === selectedBrochure.id ? response.data : brochure
        );
        setBrochures(updatedBrochures);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error updating brochure:", error);
      });
  };

  // Broşürü silme
  const deleteBrochure = (id) => {
    axios.delete(`/api/brochure/delete/${id}`)
      .then(() => {
        setBrochures(brochures.filter((brochure) => brochure.id !== id));
      })
      .catch((error) => { 
        console.error("Error deleting brochure:", error);
      });
  };

  // Formu gönderme işlevi (yeni ekleme veya güncelleme)
  const onSubmit = (data) => {
    console.log("burda");
    if (selectedBrochure) {
      console.log("if");
      updateBrochure(data);
    } else {
      console.log("else");
      addBrochure(data);
    }
  };

  // Broşür ekleme veya düzenleme için formu açma
  const handleOpenForm = (brochure = null) => {
    setSelectedBrochure(brochure);
    if (brochure) {
      setValue('brochureImage', brochure.brochureImage); // Broşür görüntüsünü ayarlayın
      setValue('categoryId', brochure.categoryId); // Kategori değerini ayarla
      setValue('markId', brochure.markId); // Marka değerini ayarla
    } else {
      reset(); // Yeni bir form açıldığında sıfırla
    }
    setOpen(true);
  };

  // Dialog'u kapatma
  const handleClose = () => {
    setOpen(false);
    setSelectedBrochure(null); // Seçili broşürü sıfırlayın
  };

  // DataGrid için kolonlar
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'startDate', headerName: 'StartDate', width: 200 },
    { field: 'endDate', headerName: 'EndDate', width: 200 },
    { field: 'markId', headerName: 'Mark', width: 200, valueGetter: (markId) => {
      const mark = marks.find(mark => mark.id === markId);
      return mark ? mark.name : '';
  }},
    { field: 'categoryId', headerName: 'Category', width: 200, valueGetter: (categoryId) => {
        const category = categories.find(category => category.id === categoryId);
        return category ? category.name : '';
    }},
    { field: 'brochureImage', headerName: 'BrochureImage', width: 200 },
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
            onClick={() => deleteBrochure(params.row.id)}
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
      <h1>Brochure List</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
       Add Brochure 
      </Button>
      <DataGrid rows={brochures} columns={columns} pageSize={5} checkboxSelection />
      
      {/* Broşür ekleme/güncelleme formu için dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedBrochure ? "Update Brochure" : "Add Brochure"}</DialogTitle>
        <DialogContent>
  <form onSubmit={handleSubmit(onSubmit)}>
    <TextField
      {...register('brochureImage', { required: true })}
      label="Brochure Image"
      fullWidth
      margin="dense"
    />
   <FormControl fullWidth margin="dense">
  <InputLabel>Category</InputLabel>
  <Select
    {...register('categoryId', { required: true })}
    value={selectedBrochure ? selectedBrochure.categoryId : ""}
    onChange={(e) => setValue("categoryId", e.target.value)} // Değeri güncelle
  >
    {categories.map((category) => (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth margin="dense">
  <InputLabel>Mark</InputLabel>
  <Select
    {...register('markId', { required: true })}
    value={selectedBrochure ? selectedBrochure.markId : ""}
    onChange={(e) => setValue("markId", e.target.value)} // Değeri güncelle
  >
    {marks.map((mark) => (
      <MenuItem key={mark.id} value={mark.id}>
        {mark.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
    <DialogActions>
      <Button onClick={handleClose} color="secondary">
        Cancel
      </Button>
      <Button type="submit" color="primary">
        {selectedBrochure ? "Update" : "Add"}
      </Button>
    </DialogActions>
  </form>
</DialogContent>
      </Dialog>
    </div>
  );
}

export default Brochure;
