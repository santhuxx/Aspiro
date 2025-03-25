"use client";

import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import dayjs from 'dayjs';

const Calendar = ({ onDateSelect, onAddTaskClick }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Select a Date</Typography>
          <IconButton 
            color="primary" 
            onClick={() => onAddTaskClick(selectedDate)}
            aria-label="add task"
          >
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Box>
        <DateCalendar 
          value={selectedDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Calendar;