import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import nodemailer from 'nodemailer'
import {Resend} from "resend"
import {generaterecipt} from "./receipt_generator.js";
import path from "path";


dotenv.config();

const app=express();
const PORT=process.env.PORT||5000;

const resend=new Resend(process.env.RESEND_API_KEY)

app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "https://moneywisemag.in"
    ],
    methods:["GET","POST"]
  }))
app.use(express.json())

app.use("/receipts", express.static(path.join(process.cwd(), "receipts")));


app.get("/" ,(req,res)=>{
    res.send("Backend is running")
})

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

app.post("/send-email",async (req,res) =>{
  try{
    const receiptFile=generaterecipt(req.body)
    const receiptUrl=`https://moneywisemag.in/receipts/${receiptFile}`

    await resend.emails.send({
      from:"Moneywise <onborading@resend.dev>",
      to:"contact@moneywisemag.in",
      subject:`New subscription from ${req.body.name};`,
      html:`
      <h2>New Subscription</h2>
      <p><strong>Name:</strong>${req.body.name}</p>
      <p><strong>Email:</strong>${req.body.email}</p>
      <p><strong>Transaction ID:</strong>${req.body.TransactionId}</p>
      <p><strong>Plans:</strong>${req.body.plans.join(",")}</p>
      <p>
      <a href="${receiptUrl}">Download Recipt</a>
      </p>
      `
    })
    res.json({
      success:"true",
      message:"Email sent sucessfully",
      receiptUrl
    })
  }catch(error) {
    console.error("Email Error: ",error)
    res.status(500).json({
      success:false,
      message:"Email Failed"
    })
  }
});
