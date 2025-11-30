const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { connectDB } = require('./db');
const { seedData } = require('./seedData');
const apiRoutes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'BBSBEC API is running' });
});

app.use('/api', apiRoutes);

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  await seedData();
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
};

startServer();

