import express from 'express'
import type {Reqest,Response} from 'express'
import { errorMiddleware } from './middlewares/error.middleware'
import menuRouter from './modules/menu/menu.router'
const app = express()

app.use(express.json())

app.get('/health',(_req:Reqest,res:Response)=>{
    res.json({
        status:200,
        message:"alive"
    })

})

app.use('/menu',menuRouter)

app.use(errorMiddleware)

export default app