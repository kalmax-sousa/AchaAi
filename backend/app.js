const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const database = require('./config/db');

dotenv.config();

// Migrate database to the latest version
(async () => {
    try {
        const resultado = await database.sync();
        console.log(resultado);
    } catch (error) {
        console.log(error);
    }
})();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
