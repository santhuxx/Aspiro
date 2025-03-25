"use client";

import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  IconButton, 
  Chip,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

const PriorityChip = styled(Chip)(({ priority }) => ({
  marginLeft: '8px',
  backgroundColor: 
    priority === 'high' ? '#ffcdd2' : 
    priority === 'medium' ? '#fff9c4' : '#c8e6c9',
  color: '#000',
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
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <>
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
                </>
              }
              sx={{
                textDecoration: showCompleted ? 'line-through' : 'none',
                opacity: showCompleted ? 0.7 : 1,
              }}
            >
              <Checkbox
                edge="start"
                checked={showCompleted}
                onChange={() => onTaskToggle(task.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {task.title}
                    <PriorityChip 
                      label={task.priority} 
                      priority={task.priority} 
                      size="small" 
                    />
                  </Box>
                }
                secondary={task.description}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TaskList;