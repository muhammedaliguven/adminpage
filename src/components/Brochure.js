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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function Brochure() {
  const [brochures, setBrochures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, control } = useForm();

  useEffect(() => {
    fetchBrochures();
    fetchCategories();
    fetchMarks();
  }, []);

  const fetchBrochures = () => {
    axios.get('/api/brochure/getAll')
      .then((response) => {
        setBrochures(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brochures:", error);
      });
  };

  const fetchCategories = () => {
    axios.get('/api/category/getAll')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const fetchMarks = () => {
    axios.get('/api/mark/getAll')
      .then((response) => {
        setMarks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

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

  const deleteBrochure = (id) => {
    axios.delete(`/api/brochure/delete/${id}`)
      .then(() => {
        setBrochures(brochures.filter((brochure) => brochure.id !== id));
      })
      .catch((error) => { 
        console.error("Error deleting brochure:", error);
      });
  };

  const onSubmit = (data) => {
    if (selectedBrochure) {
      updateBrochure(data);
    } else {
      addBrochure(data);
    }
  };

const handleOpenForm = (brochure = null) => {
  setSelectedBrochure(brochure);
  if (brochure) {
    setValue('brochureImage', brochure.brochureImage);
    setValue('categoryId', brochure.categoryId);  // Category seçimi
    setValue('markId', brochure.markId);          // Mark seçimi
    setValue('startDate', dayjs(brochure.startDate));
    setValue('endDate', dayjs(brochure.endDate));
  } else {
    reset();
  }
  setOpen(true);
};

  const handleClose = () => {
    setOpen(false);
    setSelectedBrochure(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'startDate', headerName: 'Start Date', width: 200 },
    { field: 'endDate', headerName: 'End Date', width: 200 },
    {
      field: 'markId',
      headerName: 'Mark',
      width: 200,
      valueGetter: (params) => {
        const mark = marks.find(mark => mark.id === params);
        return mark ? mark.name : '';
      },
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      width: 200,
      valueGetter: (params) => {
        const category = categories.find(category => category.id === params);
        return category ? category.name : '';
      },
    },
    { field: 'brochureImage', headerName: 'Brochure Image', width: 200 },
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>

    <div style={{ height: 400, width: '100%' }}>
      <h1>Brochure List</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
        Add Brochure
      </Button>
      <DataGrid rows={brochures} columns={columns} pageSize={5} checkboxSelection />

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
  <Controller
    name="categoryId"
    control={control}
    defaultValue={selectedBrochure ? selectedBrochure.categoryId : ''}
    render={({ field }) => (
      <Select
        {...field}
        onChange={(e) => field.onChange(e.target.value)}
        label="Category"
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    )}
  />
</FormControl>

<FormControl fullWidth margin="dense">
  <InputLabel>Mark</InputLabel>
  <Controller
    name="markId"
    control={control}
    defaultValue={selectedBrochure ? selectedBrochure.markId : ''}
    render={({ field }) => (
      <Select
        {...field}
        onChange={(e) => field.onChange(e.target.value)}
        label="Mark"
      >
        {marks.map((mark) => (
          <MenuItem key={mark.id} value={mark.id}>
            {mark.name}
          </MenuItem>
        ))}
      </Select>
    )}
  />
</FormControl>
            <Controller
              name="startDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start Date"
                  fullWidth
                  margin="dense"
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />

            <Controller
              name="endDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End Date"
                  fullWidth
                  margin="dense"
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />

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
    </LocalizationProvider>
  );
}

export default Brochure;
