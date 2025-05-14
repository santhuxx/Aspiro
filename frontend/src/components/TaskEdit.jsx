"use client";

import TaskForm from "./TaskForm";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const TaskEdit = ({ open, onClose, onSubmit, task }) => {
  // Ensure the date is a dayjs object
  const [selectedDate, setSelectedDate] = useState(dayjs(task?.date) || dayjs());

  // Update selectedDate if task changes
  useEffect(() => {
    if (task?.date) {
      setSelectedDate(dayjs(task.date));
    }
  }, [task]);

  // Prepare the task object for TaskForm
  const taskToEdit = task
    ? {
        ...task,
        date: selectedDate,
      }
    : null;

  return (
    <TaskForm
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      selectedDate={selectedDate}
      taskToEdit={taskToEdit}
      isEdit // Optional: you can use this prop in TaskForm to change button text
    />
  );
};

export default TaskEdit;