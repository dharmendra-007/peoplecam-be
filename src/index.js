import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import deptRouter from "./routes/dept.route.js";
import fundRouter from "./routes/fund.route.js";
import issueRouter from "./routes/issue.route.js";

dotenv.config()
cors()

const app = express()
const PORT = process.env.PORT || 8000

// middlewares
app.use(express.json())
app.use(express.urlencoded())

// routes
app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/admin" , adminRouter)
app.use("/api/v1/dept" , deptRouter)
app.use("/api/v1/fund" , fundRouter)
app.use("/api/v1/issue" , issueRouter)

// app.use("/" , (req , res) => {
//     return res.status(200).json({
//         status : true,
//         message : "Welcome to PeopleCam Backend",
//         author: "Eco Guardians"
//     })
// })

// global error handler
app.use(globalErrorHandler)

app.listen(PORT , () => {
    console.log(`App is listening at PORT : ${PORT}`)
})