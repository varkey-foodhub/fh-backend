import express from 'express'
import type {Reqest,Response} from 'express'
import { errorMiddleware } from './middlewares/error.middleware'
import menuRouter from './modules/menu/menu.router'
import restaurantRouter from './modules/restaurant/restaurant.route'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors());
  

app.get('/health',(_req:Reqest,res:Response)=>{
    res.json({
        status:200,
        message:"alive"
    })

})

app.use('/menu',menuRouter)
app.use('/restaurant',restaurantRouter)
app.use(errorMiddleware)

export default app