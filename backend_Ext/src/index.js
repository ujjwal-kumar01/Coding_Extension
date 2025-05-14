import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './db/index.js';
import cors from "cors"
import Questions from './routes/questions.routes.js';

dotenv.config({path:"./.env"})

const app=express();
const port=process.env.PORT || 8000;

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(cookieParser())

app.use(express.json( {limit: '20mb'} ));
app.use(express.urlencoded({extended:true, limit:'20mb'}))

app.use("/question-ext/v1",Questions)


app.get('/', (req, res) => {
  res.send('Coding Extension Backend Running!');
});

connectDB().then(()=>{
    app.listen(port, () =>
        console.log(`Server is running on port ${port}`)
    );
}
).catch((error)=>{
    console.log("Error connecting to database", error.message)
}
)
import userRoutes from "./routes/user.routes.js";

app.use("/api/users", userRoutes);

export default app;
