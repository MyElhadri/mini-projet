import express from 'express'
import cors from 'cors'
<<<<<<< Updated upstream
import errorHandling from './middlewares/errorHandler.js'


import competanceRoutes from './routes/competenceRoutes.js'

=======
import personneRoutes from './routes/personneRoutes.js'
import errorHandling from './middlewares/errorHandler.js'

>>>>>>> Stashed changes
const app = express() 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())

<<<<<<< Updated upstream
app.use('/api/competences', competanceRoutes)
app.use(errorHandling)

=======

app.use('/api/personnes',  personneRoutes)
app.use(errorHandling)


>>>>>>> Stashed changes
export default app;