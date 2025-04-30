"use client";

import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Paper, 
  Button, 
  Checkbox 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

const PriorityChip = styled(Box)(({ priority }) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  color: '#000',
  backgroundColor: 
    priority === 'high' ? '#ffcdd2' : 
    priority === 'medium' ? '#fff9c4' : '#c8e6c9',
  fontWeight: 'bold',
  fontSize: '0.875rem',
}));

const TaskList = ({ 
  tasks, 
  onTaskToggle, 
  onTaskDelete, 
  onTaskEdit,
  title,
  emptyMessage,
  showCompleted = false 
}) => {
  // Function to generate a task report
  const handleGenerateReport = () => {
    const reportData = tasks.map(task => ({
      TaskID: task.id,
      Description: task.description,
      StartTime: task.startTime,
      EndTime: task.endTime,
      Priority: task.priority,
    }));

    const reportContent = reportData.map(task => 
      `Task ID: ${task.TaskID}\nDescription: ${task.Description}\nStart Time: ${task.StartTime}\nEnd Time: ${task.EndTime}\nPriority: ${task.Priority}\n\n`
    ).join('');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'TaskListReport.txt';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* Title */}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* If no tasks are available */}
      {tasks.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          {emptyMessage}
        </Typography>
      ) : (
        <>
          {/* Task Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Task Priority</TableCell>
                  <TableCell align="center">Completed</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.7 : 1,
                    }}
                  >
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.startTime}</TableCell>
                    <TableCell>{task.endTime}</TableCell>
                    <TableCell>
                      <PriorityChip priority={task.priority}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </PriorityChip>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={task.completed}
                        onChange={() => onTaskToggle(task.id)}
                        inputProps={{ 'aria-label': 'Mark task as completed' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        edge="end" 
                        onClick={() => onTaskEdit(task)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        onClick={() => onTaskDelete(task.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Generate Report Button */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGenerateReport}
            >
              Generate Report 
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TaskList;