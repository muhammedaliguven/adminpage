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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Brochure = () => {
  const [brochures, setBrochures] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const [open, setOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null); // PDF dosyasını takip etmek için
  const { register, handleSubmit, reset, setValue, control } = useForm();

  useEffect(() => {
    fetchBrochures();
    fetchMarks();
  }, []);

  const fetchBrochures = () => {
    axios.get('/api/brochure/getAll')
      .then((response) => setBrochures(response.data))
      .catch((error) => console.error("Error fetching brochures:", error));
  };

  const fetchMarks = () => {
    axios.get('/api/mark/getAll')
      .then((response) => setMarks(response.data))
      .catch((error) => console.error("Error fetching marks:", error));
  };

  const handleOpenForm = (brochure = null) => {
    setSelectedBrochure(brochure);
    if (brochure) {
      setValue('brochureImage', brochure.brochureImage);
      setValue('markId', brochure.markId);
      setValue('startDate', dayjs(brochure.startDate));
      setValue('endDate', dayjs(brochure.endDate));
      setValue('description', brochure.description); // Description alanını dolduruyoruz
      setPdfFile(null); // Yeni dosya yüklendiğinde eskiyi sıfırla
    } else {
      reset();
      setPdfFile(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBrochure(null);
    setPdfFile(null);
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('startDate', dayjs(data.startDate).format('YYYY-MM-DD'));
    formData.append('endDate', dayjs(data.endDate).format('YYYY-MM-DD'));
    formData.append('markId', data.markId);
    formData.append('description', data.description);
    if (pdfFile) {
      formData.append('pdfData', pdfFile);
    }

    if (selectedBrochure) {
      axios.put(`/api/brochure/update/${selectedBrochure.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          const updatedBrochures = brochures.map((brochure) =>
            brochure.id === selectedBrochure.id ? response.data : brochure
          );
          setBrochures(updatedBrochures);
          handleClose();
        })
        .catch((error) => console.error("Error updating brochure:", error));
    } else {
      axios.post('/api/brochure/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          setBrochures([...brochures, response.data]);
          handleClose();
        })
        .catch((error) => console.error("Error adding brochure:", error));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ height: 400, width: '100%' }}>
        <h1>Brochure List</h1>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Add Brochure
        </Button>
        <DataGrid rows={brochures} columns={[
          { field: 'id', headerName: 'ID', width: 90 },
          { field: 'startDate', headerName: 'Start Date', width: 200 },
          { field: 'endDate', headerName: 'End Date', width: 200 },
          { field: 'description', headerName: 'Description', width: 200 },
          {
            field: 'markId',
            headerName: 'Mark',
            width: 200,
            valueGetter: (params) => {
              const mark = marks.find((m) => m.id === params);
              return mark ? mark.name : '';
            },
          },
          {
            field: 'pdfData',
            headerName: 'PDF',
            width: 200,
            renderCell: (params) => {
              if (params.value) {
                const pdfDataUri = `data:application/pdf;base64,${params.value}`;
                return (
                  <a
                    href={pdfDataUri}
                    download="brochure.pdf" // Dosya indirme özelliği
                    onClick={(e) => e.stopPropagation()} // Tıklamayı izole et
                  >
                    Download PDF
                  </a>
                );
              }
              return 'No PDF';
            },
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
                  onClick={() =>
                    axios.delete(`/api/brochure/delete/${params.row.id}`)
                      .then(() => setBrochures(brochures.filter((b) => b.id !== params.row.id)))
                      .catch((error) => console.error("Error deleting brochure:", error))
                  }
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]} pageSize={5} checkboxSelection  disableSelectionOnClick />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedBrochure ? 'Update Brochure' : 'Add Brochure'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('description', { required: true })}
                label="Description"
                fullWidth
                margin="dense"
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Mark</InputLabel>
                <Controller
                  name="markId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Mark">
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
                render={({ field }) => (
                  <DatePicker {...field} label="Start Date" renderInput={(params) => <TextField {...params} />} />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} label="End Date" renderInput={(params) => <TextField {...params} />} />
                )}
              />
              <Button
                variant="contained"
                component="label"
                style={{ marginTop: '10px' }}
              >
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  {selectedBrochure ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default Brochure;
