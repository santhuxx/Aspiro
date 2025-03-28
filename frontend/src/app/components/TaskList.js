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
  Checkbox, 
  Paper, 
  Button 
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
  // Function to generate a task list report
  const handleGenerateReport = () => {
    const reportData = tasks.map(task => ({
      Title: task.title,
      Priority: task.priority,
      AllocatedTime: `${task.startTime} - ${task.endTime}`,
      Description: task.description,
    }));

    const reportContent = reportData.map(task => 
      `Task Name: ${task.Title}\nPriority: ${task.Priority}\nAllocated Time: ${task.AllocatedTime}\nDescription: ${task.Description}\n\n`
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
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {tasks.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          {emptyMessage}
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Allocated Time</TableCell>
                  <TableCell>Task Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{
                      textDecoration: showCompleted ? 'line-through' : 'none',
                      opacity: showCompleted ? 0.7 : 1,
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          edge="start"
                          checked={showCompleted}
                          onChange={() => onTaskToggle(task.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                        {task.title}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <PriorityChip priority={task.priority}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </PriorityChip>
                    </TableCell>
                    <TableCell>
                      {task.startTime} - {task.endTime}
                    </TableCell>
                    <TableCell>{task.description}</TableCell>
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