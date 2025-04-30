import express from 'express'
import cors from 'cors'
import errorHandling from './middlewares/errorHandler.js'


import competanceRoutes from './routes/competenceRoutes.js'

const app = express() 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())

app.use('/api/competences', competanceRoutes)
app.use(errorHandling)

export default app;