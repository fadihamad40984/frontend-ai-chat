import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Box
} from "@mui/material";
import { Delete, Edit, Refresh } from "@mui/icons-material";
import { fetchTrainingData, addTrainingPair, retrainModel, deleteTrainingPair } from "../api/adminApi";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { loadData(); }, []);

  const showMessage = (message, severity="success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const trainingData = await fetchTrainingData();
      setData(trainingData || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleAdd = async () => {
    if (!newInput || !newOutput) return showMessage("Provide both question and answer", "warning");
    try {
      await addTrainingPair(newInput, newOutput);
      setNewInput(""); setNewOutput("");
      showMessage("Q&A added successfully");
      loadData();
    } catch (err) {
      console.error(err);
      showMessage("Failed to add Q&A", "error");
    }
  };

  const handleRetrain = async () => {
    try {
      await retrainModel();
      showMessage("Retraining started!");
    } catch (err) {
      console.error(err);
      showMessage("Retraining failed", "error");
    }
  };

  const handleDelete = async (idx) => {
    if (!window.confirm("Are you sure to delete this pair?")) return;
    try {
      await deleteTrainingPair(idx);
      showMessage("Deleted successfully");
      loadData();
    } catch (err) {
      console.error(err);
      showMessage("Delete failed", "error");
    }
  };

  const filtered = data.filter(item => item.input.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      {/* Search & Retrain */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <TextField label="Search..." value={filter} onChange={e => setFilter(e.target.value)} sx={{ flex: 1 }} />
        <Button variant="contained" color="primary" startIcon={<Refresh />} onClick={handleRetrain}>
          Retrain Model
        </Button>
      </Box>

      {/* Add Q&A */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Add New Q&A</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Question"
            value={newInput}
            onChange={e => setNewInput(e.target.value)}
            fullWidth
          />
          <TextField
            label="Answer"
            value={newOutput}
            onChange={e => setNewOutput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="success" onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      {loading ? <CircularProgress /> : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx+1}</TableCell>
                  <TableCell>{item.input}</TableCell>
                  <TableCell>{item.output}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(idx)}><Delete /></IconButton>
                    {/* Future: <IconButton color="primary"><Edit /></IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open:false})}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
