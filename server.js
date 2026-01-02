import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import nodemailer from 'nodemailer'

dotenv.config();

const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,

  }
})
const app=express();
const PORT=process.env.PORT||5000;

app.use(cors())
app.use(express.json())

app.get("/" ,(req,res)=>{
    res.send("Backend is running")
})

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})

app.post("/send-email",async (req,res) =>{
  const {name,email,address,phone,plans}=req.body

  try{
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:"sriniketh.sudheendra@gmail.com",
      subject:`New subscription from ${name}`,
      text:`
      Name:${name},
      email:${email},
      Address:${address},
      Phone:${phone},
      Plans Selected:${plans.join(",")}
      `
    })
    res.json({success:true,message:"Email sent sucessfully"
    })
  }catch(error) {
    console.error(error)
    res.status(500).json({sucess:false,message:"Email Failed"})
  }

  


})