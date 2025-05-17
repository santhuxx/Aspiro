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
import dayjs from 'dayjs';

const TaskForm = ({ open, onClose, onSubmit, selectedDate, taskToEdit }) => {
  const isEditing = !!taskToEdit;
  const [task, setTask] = useState(
    taskToEdit || {
      title: '',
      description: '',
      priority: 'medium',
      date: selectedDate,
      startTime: '',
      endTime: ''
    }
  );
  const [error, setError] = useState({ startTime: '', endTime: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({ ...prev, [name]: '' }));
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("TaskForm submit:", { task, selectedDate: selectedDate.format('YYYY-MM-DD') });

    const now = dayjs();
    const isToday = selectedDate.isSame(now, 'day');

    // Validate start time
    if (isToday && task.startTime) {
      const startDateTime = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${task.startTime}`, 'YYYY-MM-DDTHH:mm');
      const timeDiff = startDateTime.diff(now, 'minute');
      if (timeDiff < -5) { // Allow start time up to 5 minutes in the past
        setError((prev) => ({ ...prev, startTime: 'Start time cannot be more than 5 minutes in the past.' }));
        console.log("Start time validation failed:", { 
          startTime: task.startTime, 
          now: now.format('HH:mm'), 
          timeDiff 
        });
        return;
      }
    }

    // Validate end time
    if (task.startTime && task.endTime) {
      const startDateTime = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${task.startTime}`, 'YYYY-MM-DDTHH:mm');
      const endDateTime = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${task.endTime}`, 'YYYY-MM-DDTHH:mm');
      if (endDateTime.isBefore(startDateTime)) {
        setError((prev) => ({ ...prev, endTime: 'End time must be after start time.' }));
        console.log("End time validation failed:", { startTime: task.startTime, endTime: task.endTime });
        return;
      }
    }

    console.log("TaskForm validation passed, submitting:", task);
    onSubmit(task);
    if (!isEditing) {
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        date: selectedDate,
        startTime: '',
        endTime: ''
      });
    }
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
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Task' : 'Add New Task'} {selectedDate?.format('MMMM D, YYYY')}
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
            rows={4}
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
            error={!!error.startTime}
            helperText={error.startTime}
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
            error={!!error.endTime}
            helperText={error.endTime}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskForm;