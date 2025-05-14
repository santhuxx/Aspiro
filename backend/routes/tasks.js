const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// CREATE a new task
router.post('/', async (req, res) => {
  try {
    const { uid, ...task } = req.body;
    const docRef = await db.collection('users').doc(uid).collection('tasks').add(task);
    res.status(201).json({ id: docRef.id, ...task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// READ all tasks for a user
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const snapshot = await db.collection('users').doc(uid).collection('tasks').get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// UPDATE a task
router.put('/:uid/:taskId', async (req, res) => {
  try {
    const { uid, taskId } = req.params;
    const task = req.body;
    await db.collection('users').doc(uid).collection('tasks').doc(taskId).set(task, { merge: true });
    res.status(200).json({ id: taskId, ...task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:uid/:taskId', async (req, res) => {
  try {
    const { uid, taskId } = req.params;
    await db.collection('users').doc(uid).collection('tasks').doc(taskId).delete();
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;