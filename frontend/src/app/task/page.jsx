"use client";

import { useState, useEffect } from 'react';
import { Typography, Container, Box, CircularProgress, Alert } from "@mui/material";
import NavBar from "../../components/NavBar";
import SideMenu from "../../components/SideMenu";
import Calendar from "../../components/Calendar";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const COLORS = ['#0088FE', '#FFBB28'];

const TaskPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("TaskPage: Current user", currentUser?.email || "none", "Auth loading", authLoading);
    const fetchTasks = async () => {
      if (!currentUser || authLoading) {
        console.log("No current user or auth loading:", { currentUser, authLoading });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        console.log("Fetching tasks for user:", currentUser.email);
        const tasksRef = collection(db, "tasks", currentUser.email, "userTasks");
        const q = query(tasksRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedTasks = [];
        querySnapshot.forEach((doc) => {
          const taskData = doc.data();
          fetchedTasks.push({
            ...taskData,
            date: dayjs(taskData.date.toDate()),
          });
        });

        setTasks(fetchedTasks.filter(task => !task.completed));
        setCompletedTasks(fetchedTasks.filter(task => task.completed));
        console.log("Fetched tasks:", fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error, { code: error.code, message: error.message });
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser, authLoading]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTaskClick = () => {
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (newTask) => {
    if (!currentUser) {
      console.log("No current user for task submission");
      setError("Please log in to add tasks.");
      return;
    }

    const taskWithId = {
      ...newTask,
      id: Date.now().toString(),
      date: Timestamp.fromDate(newTask.date.toDate()),
      completed: false,
      createdAt: Timestamp.now(),
    };

    try {
      console.log("Saving task to Firestore:", taskWithId, { userEmail: currentUser.email });
      const taskRef = doc(db, "tasks", currentUser.email, "userTasks", taskWithId.id);
      await setDoc(taskRef, taskWithId);
      console.log("Task successfully saved to Firestore:", taskWithId);
      setTasks([...tasks, { ...taskWithId, date: newTask.date }]);
    } catch (error) {
      console.error("Error saving task:", error, { code: error.code, message: error.message });
      setError("Failed to save task. Please try again.");
    }
  };

  const handleTaskToggle = async (taskId) => {
    if (!currentUser) {
      console.log("No current user for task toggle");
      setError("Please log in to update tasks.");
      return;
    }

    try {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        const taskToComplete = tasks[taskIndex];
        const updatedTask = { ...taskToComplete, completed: true, date: Timestamp.fromDate(taskToComplete.date.toDate()) };
        const taskRef = doc(db, "tasks", currentUser.email, "userTasks", taskId);
        await setDoc(taskRef, updatedTask);
        console.log("Task marked as completed:", updatedTask);
        setCompletedTasks([...completedTasks, { ...taskToComplete, completed: true }]);
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        const completedTaskIndex = completedTasks.findIndex(task => task.id === taskId);
        if (completedTaskIndex !== -1) {
          const taskToReactivate = completedTasks[completedTaskIndex];
          const updatedTask = { ...taskToReactivate, completed: false, date: Timestamp.fromDate(taskToReactivate.date.toDate()) };
          const taskRef = doc(db, "tasks", currentUser.email, "userTasks", taskId);
          await setDoc(taskRef, updatedTask);
          console.log("Task marked as incomplete:", updatedTask);
          setTasks([...tasks, { ...taskToReactivate, completed: false }]);
          setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
        }
      }
    } catch (error) {
      console.error("Error toggling task:", error, { code: error.code, message: error.message });
      setError("Failed to update task status. Please try again.");
    }
  };

  const handleTaskEdit = async (updatedTask) => {
    if (!currentUser) {
      console.log("No current user for task edit");
      setError("Please log in to edit tasks.");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", currentUser.email, "userTasks", updatedTask.id);
      const taskToSave = {
        ...updatedTask,
        date: Timestamp.fromDate(updatedTask.date.toDate()),
        createdAt: updatedTask.createdAt || Timestamp.now(),
      };
      await setDoc(taskRef, taskToSave);
      console.log("Task updated in Firestore:", taskToSave);
      if (updatedTask.completed) {
        setCompletedTasks(completedTasks.map(task => task.id === updatedTask.id ? { ...updatedTask, date: updatedTask.date } : task));
        setTasks(tasks.filter(task => task.id !== updatedTask.id));
      } else {
        setTasks(tasks.map(task => task.id === updatedTask.id ? { ...updatedTask, date: updatedTask.date } : task));
        setCompletedTasks(completedTasks.filter(task => task.id !== updatedTask.id));
      }
    } catch (error) {
      console.error("Error updating task:", error, { code: error.code, message: error.message });
      setError("Failed to update task. Please try again.");
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!currentUser) {
      console.log("No current user for task deletion");
      setError("Please log in to delete tasks.");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", currentUser.email, "userTasks", taskId);
      await deleteDoc(taskRef);
      console.log("Task deleted from Firestore:", taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error, { code: error.code, message: error.message });
      setError("Failed to delete task. Please try again.");
    }
  };

  const filteredTasks = tasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );
  const filteredCompletedTasks = completedTasks.filter(task => 
    dayjs(task.date).isSame(selectedDate, 'day')
  );

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

  if (authLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#14523D" }} />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Please log in to manage tasks.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mt: 5 }}>
          <NavBar />
          <SideMenu />
          <Typography variant="h4" color='#14523D' mt={8} fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
            <br/>Task Management
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Alert>
          )}

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
            onTaskEdit={handleTaskEdit}
            title="Pending Tasks"
            emptyMessage="No tasks for this date. Click the + button to add one."
          />
          
          <TaskList
            tasks={filteredCompletedTasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            title="Completed Tasks"
            emptyMessage="No completed tasks for this date."
            showCompleted={true}
          />

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