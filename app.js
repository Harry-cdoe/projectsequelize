const express = require("express");
const { connectSequelize } = require("./db");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Sequelize Connection
connectSequelize();

app.use(express.json());
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Serve running on port ${PORT}`);
});