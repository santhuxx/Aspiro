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

  const isPastDate = selectedDate.isBefore(dayjs(), 'day');

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: 'white' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#14523D' }}>Select a Date</Typography> {/* Dark green color */}
          <IconButton 
            color="primary" 
            onClick={() => onAddTaskClick(selectedDate)}
            aria-label="add task"
            sx={{ color: '#14523D' }}
            disabled={isPastDate}
          >
            <AddCircleOutlineIcon fontSize="large" sx={{ color: '#14523D' }}/>
          </IconButton>
        </Box>
        <DateCalendar 
          value={selectedDate}
          onChange={handleDateChange}
          sx={{ color: '#14523D' }} // Dark green color
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Calendar;