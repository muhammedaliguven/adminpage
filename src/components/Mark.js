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
  const [marks, setMarks] = useState([]);
  const [selectedMark, setSelectedMark] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchMarks();
  }, []);

  // Ürün listesini API'den al
  const fetchMarks = () => {
    axios.get('/api/mark/getAll')
      .then((response) => {
        setMarks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching marks:", error);
      });
  };

  // Yeni ürün ekleme
  const addMark = (data) => {
    axios.post('/api/mark/create', data)
      .then((response) => {
        setMarks([...marks, response.data]);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error adding mark:", error);
      });
  };

  // Ürünü güncelleme
  const updateMark = (data) => {
    axios.put(`/api/mark/update/${selectedMark.id}`, data)
      .then((response) => {
        const updatedMarks = marks.map((mark) =>
          mark.id === selectedMark.id ? response.data : mark
        );
        setMarks(updatedMarks);
        setOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Error updating mark:", error);
      });
  };

  // Ürünü silme
  const deleteMark = (id) => {
    axios.delete(`/api/mark/delete/${id}`)
      .then(() => {
        setMarks(marks.filter((mark) => mark.id !== id));
      })
      .catch((error) => { 
        console.error("Error deleting mark:", error);
      });
  };

  // Formu gönderme işlevi (yeni ekleme veya güncelleme)
  const onSubmit = (data) => {
    if (selectedMark) {
      updateMark(data);
    } else {
      addMark(data);
    }
  };

  // Ürün ekleme veya düzenleme için formu açma
  const handleOpenForm = (mark = null) => {
    setSelectedMark(mark);
    if (mark) {
      reset(mark); // Güncelleme için mevcut ürünü forma yükle
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
    { field: 'name', headerName: 'Mark Name', width: 200 },
    { field: 'link', headerName: 'Mark link', width: 200 },

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
      
      {/* Ürün ekleme/güncelleme formu için dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedMark ? "Update Mark" : "Add Mark"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('name', { required: true })}
              label="Mark Name"
              fullWidth
              margin="dense"
            />
            <TextField
              {...register('link', { required: true })}
              label="Mark Link"
              fullWidth
              margin="dense"
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {selectedMark ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page4;
