const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');

// Verify Firebase ID token
router.post('/verify-token', async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile
router.post('/update-profile', async (req, res) => {
  const { uid, name, email, birthDate, sex, country, mobileNumber, photoURL } = req.body;
  try {
    await db.collection('users').doc(uid).set({
      name,
      email,
      birthDate,
      sex,
      country,
      mobileNumber,
      photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
