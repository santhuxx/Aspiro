"use client";

import { useState } from 'react';
import { Typography, Container, Box } from "@mui/material";
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

  // Calculate task completion progress
  const calculateTaskCompletionProgress = () => {
    const totalTasks = tasks.length + completedTasks.length;
    const completedPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
    const pendingPercentage = totalTasks > 0 ? (tasks.length / totalTasks) * 100 : 0;

    return [
      { name: 'Completed', value: completedPercentage },
      { name: 'Pending', value: pendingPercentage },
    ];
  };

  const taskCompletionData = calculateTaskCompletionProgress();

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mt: 5 }}>
          <NavBar />
          <SideMenu />
          <Typography variant="h4" color='#14523D' mt={15} fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            Task Management
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

          {/* Task Completion Progress Section */}
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: "#F0F4F8", // Light gray background for the chart section
              borderRadius: 2, // Rounded corners
              boxShadow: 2, // Subtle shadow for better appearance
              textAlign: "center" 
            }}
          >
            <Typography variant="h5" color="#133429" fontWeight="bold" gutterBottom>
              Task Completion Progress
            </Typography>

            <PieChart width={300} height={300}>
              <Pie
                data={taskCompletionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {taskCompletionData.map((entry, index) => (
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