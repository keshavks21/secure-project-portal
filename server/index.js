import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('PixelForge Nexus API is running');
});

db()
.then(()=>{
    console.log("db connection is successful");
    app.listen(process.env.PORT,()=>{
        console.log("server running on port "+ process.env.PORT);
        
    });
})
.catch((err)=>{
    console.error("database connection error")
    
})

