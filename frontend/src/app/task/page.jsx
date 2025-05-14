"use client";

import { useEffect, useState } from 'react';
import { Typography, Container, Box } from "@mui/material";
import NavBar from "../../components/NavBar";
import SideMenu from "../../components/SideMenu";
import Calendar from "../../components/Calendar";
import TaskForm from "../../components/TaskForm";
import TaskEdit from "../../components/TaskEdit";
import TaskList from "../../components/TaskList";
import dynamic from "next/dynamic";
import { getTasks, createTask, updateTask, deleteTask } from "@/api/taskApi";
import dayjs from 'dayjs';

const uid = "USER_UID_FROM_AUTH"; // Replace with actual user id

const COLORS = ['#0088FE', '#FFBB28'];
const TaskPieChart = dynamic(() => import("../../components/TaskPieChart"), { ssr: false });

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks from backend on mount
  useEffect(() => {
    getTasks(uid).then(setTasks);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTaskClick = () => {
    setIsTaskFormOpen(true);
  };

  // CREATE
  const handleTaskSubmit = async (task) => {
    const newTask = await createTask(uid, task);
    setTasks((prev) => [...prev, newTask]);
    setIsTaskFormOpen(false);
  };

  // UPDATE
  const handleTaskEditSubmit = async (updatedTask) => {
    await updateTask(uid, updatedTask.id, updatedTask);
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setIsEditOpen(false);
    setTaskToEdit(null);
  };

  // DELETE
  const handleTaskDelete = async (taskId) => {
    await deleteTask(uid, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleTaskEdit = (task) => {
    setTaskToEdit(task);
    setIsEditOpen(true);
  };

  const filteredTasks = tasks.filter(task =>
    dayjs(task.date).isSame(selectedDate, 'day') && !task.completed
  );
  const filteredCompletedTasks = tasks.filter(task =>
    dayjs(task.date).isSame(selectedDate, 'day') && task.completed
  );

  const calculateTaskCompletionProgress = () => {
    const totalTasks = filteredTasks.length + filteredCompletedTasks.length;
    const completedPercentage = totalTasks > 0 ? (filteredCompletedTasks.length / totalTasks) * 100 : 0;
    const pendingPercentage = totalTasks > 0 ? (filteredTasks.length / totalTasks) * 100 : 0;

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

          {/* Add Task Modal */}
          <TaskForm
            open={isTaskFormOpen}
            onClose={() => setIsTaskFormOpen(false)}
            onSubmit={handleTaskSubmit}
            selectedDate={selectedDate}
          />

          {/* Edit Task Modal */}
          <TaskEdit
            open={isEditOpen}
            onClose={() => { setIsEditOpen(false); setTaskToEdit(null); }}
            onSubmit={handleTaskEditSubmit}
            task={taskToEdit}
          />

          <TaskList
            tasks={filteredTasks}
            onTaskToggle={async (taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                await updateTask(uid, taskId, { ...task, completed: true });
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
              }
            }}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            title="Pending Tasks"
            emptyMessage="No tasks for this date. Click the + button to add one."
          />

          <TaskList
            tasks={filteredCompletedTasks}
            onTaskToggle={async (taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                await updateTask(uid, taskId, { ...task, completed: false });
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: false } : t));
              }
            }}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            title="Completed Tasks"
            emptyMessage="No completed tasks for this date."
            showCompleted={true}
          />

          {/* Task Completion Progress Section */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: "#F0F4F8",
              borderRadius: 2,
              boxShadow: 2,
              textAlign: "center"
            }}
          >
            <Typography variant="h5" color="#133429" fontWeight="bold" gutterBottom>
              Task Completion Progress
            </Typography>
            <TaskPieChart data={taskCompletionData} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TaskPage;