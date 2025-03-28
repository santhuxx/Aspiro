"use client";

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Modal, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';

const TaskForm = ({ open, onClose, onSubmit, selectedDate }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: selectedDate,
    startTime: '',
    endTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask({
      title: '',
      description: '',
      priority: 'medium',
      date: selectedDate,
      startTime: '',
      endTime: ''
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" color='#14523D' gutterBottom >
          Add New Task for {selectedDate?.format('MMMM D, YYYY')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Task Title"
            name="title"
            value={task.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={task.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Start Time"
            name="startTime"
            type="time"
            value={task.startTime}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="End Time"
            name="endTime"
            type="time"
            value={task.endTime}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Task
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskForm;