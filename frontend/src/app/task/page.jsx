"use client";

import { useState } from 'react';
import { Typography, Container, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import Calendar from "../components/Calendar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import dayjs from 'dayjs';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTaskClick = () => {
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      date: selectedDate,
      completed: false
    };
    setTasks([...tasks, taskWithId]);
  };

  const handleTaskToggle = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const taskToComplete = tasks[taskIndex];
      setCompletedTasks([...completedTasks, { ...taskToComplete, completed: true }]);
      setTasks(tasks.filter(task => task.id !== taskId));
    } else {
      const completedTaskIndex = completedTasks.findIndex(task => task.id === taskId);
      if (completedTaskIndex !== -1) {
        const taskToReactivate = completedTasks[completedTaskIndex];
        setTasks([...tasks, { ...taskToReactivate, completed: false }]);
        setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
      }
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );
  const filteredCompletedTasks = completedTasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mt: 5 }}>
          <NavBar />
          <SideMenu />
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            Task Management
          </Typography>
          <Typography variant="h3" color='#14523D' fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            Task Management And Learning Journal
          </Typography>

          <Calendar 
            onDateSelect={handleDateSelect} 
            onAddTaskClick={handleAddTaskClick} 
          />
          
          <TaskForm
            open={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            onSubmit={handleTaskSubmit}
            selectedDate={selectedDate}
          />
          
          <TaskList
            tasks={filteredTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            title="Pending Tasks"
            emptyMessage="No tasks for this date. Click the + button to add one."
          />
          
          <TaskList
            tasks={filteredCompletedTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            title="Completed Tasks"
            emptyMessage="No completed tasks for this date."
            showCompleted={true}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default TaskPage;
