import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import nodemailer from 'nodemailer'
import {generaterecipt} from "./recipt_generator.js";
import path from "path";


dotenv.config();

const app=express();
const PORT=process.env.PORT||5000;

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use(cors())
app.use(express.json())

app.use("/receipts", express.static(path.join(process.cwd(), "receipts")));


app.get("/" ,(req,res)=>{
    res.send("Backend is running")
})

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

app.post("/send-email",async (req,res) =>{
  const {name,email,address,phone,TransactionId,plans}=req.body
  
  try{
    const reciptfile=generateReceipt(req.body)
    
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:"sriniketh.sudheendra@gmail.com",
      subject:`New subscription from ${name}`,
      text:`
      Name: ${name}
      Email: ${email}
      Address: ${address}
      Phone: ${phone}
      Transaction ID: ${TransactionId}
      Plans Selected: ${plans.join(", ")}
      `
    })
    res.json({success:true,message:"Email sent sucessfully",
      reciptUrl:`https://moneywisemag.in/recipts/${reciptfile}`
    })
  }catch(error) {
    console.error("Email Error:", error)
    res.status(500).json({success:false,message:"Email Failed", error: error.message})
  }
})
