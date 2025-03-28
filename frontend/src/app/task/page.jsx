"use client";

import { useState } from 'react';
import { Typography, Container, Box, Button } from "@mui/material";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import Calendar from "../components/Calendar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; // Import recharts for the pie chart
import dayjs from 'dayjs';

// Colors for the pie chart
const COLORS = ['#0088FE', '#FFBB28']; // Blue for completed, yellow for pending

const TaskPage = () => {
  // State to manage tasks and completed tasks
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
<<<<<<< Updated upstream
  
=======

  // Function to handle date selection
>>>>>>> Stashed changes
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to open the task form
  const handleAddTaskClick = () => {
    setIsTaskFormOpen(true);
  };

  // Function to handle task submission
  const handleTaskSubmit = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      date: selectedDate,
      completed: false
    };
    setTasks([...tasks, taskWithId]);
  };

  // Function to toggle task completion
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

  // Function to delete a task
  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };

  // Function to calculate task percentages for the pie chart
  const calculateTaskPercentages = () => {
    const totalTasks = tasks.length + completedTasks.length; // Total tasks
    const completedPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0; // Completed percentage
    const pendingPercentage = totalTasks > 0 ? (tasks.length / totalTasks) * 100 : 0; // Pending percentage

    return [
      { name: 'Completed', value: completedPercentage },
      { name: 'Pending', value: pendingPercentage },
    ];
  };

  // Filter tasks based on the selected date
  const filteredTasks = tasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );
  const filteredCompletedTasks = completedTasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );

  // Get the data for the pie chart
  const taskPercentages = calculateTaskPercentages();

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mt: 5 }}>
          {/* Navigation Bar */}
          <NavBar />
          
          {/* Side Menu */}
          <SideMenu />
          
          {/* Page Title */}
          <Typography
            variant="h3"
            mt={10}
            color="#133429"
            fontWeight="bold"
            gutterBottom
            sx={{
              textAlign: "center",
              position: "sticky", // Makes the element sticky
              top: 0, // Sticks to the top of the page
              zIndex: 1000, // Ensures it stays above other elements
              backgroundColor: "#DFF6DE", // Matches the page background
              padding: "10px 0", // Adds padding for better appearance
            }}
          >
            Task Management
          </Typography>
          <Typography variant="h3" color='#14523D' fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            Task Management And Learning Journal
          </Typography>

          {/* Calendar Component */}
          <Calendar 
            onDateSelect={handleDateSelect} 
            onAddTaskClick={handleAddTaskClick} 
          />
          
          {/* Task Form */}
          <TaskForm
            open={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            onSubmit={handleTaskSubmit}
            selectedDate={selectedDate}
          />
          
          {/* Pending Tasks List */}
          <TaskList
            tasks={filteredTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            title="Pending Tasks"
            emptyMessage="No tasks for this date. Click the + button to add one."
          />
          
          {/* Completed Tasks List */}
          <TaskList
            tasks={filteredCompletedTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            title="Completed Tasks"
            emptyMessage="No completed tasks for this date."
            showCompleted={true}
          />

          {/* Pie Chart Section */}
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: "white", // Light gray background for the chart section
              borderRadius: 2, // Rounded corners
              boxShadow: 2, // Subtle shadow for better appearance
              textAlign: "center" 
            }}
          >
            {/* Section Title */}
            <Typography variant="h5" color="#133429" fontWeight="bold" gutterBottom>
              Task Progress
            </Typography>

            {/* Pie Chart */}
            <PieChart width={300} height={300}>
              <Pie
                data={taskPercentages}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {taskPercentages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TaskPage;