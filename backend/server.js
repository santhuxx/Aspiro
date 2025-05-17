const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobMatchRouter = require('./routes/jobMatch');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobMatch', jobMatchRouter);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});