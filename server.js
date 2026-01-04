import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import nodemailer from 'nodemailer'

dotenv.config();


const app=express();
const PORT=process.env.PORT||5000;

app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: "stmp-relay.brevo.com",
  port: 587,
  secure: false, // required for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls:{
    rejectUnauthorized:false
},
 connectionTimeout:2000,
 greetingTimeout:2000,
 socketTimeout;20000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP VERIFY FAILED:", err);
  } else {
    console.log("SMTP SERVER READY");
  }
});



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
      from:"contact@moneywisemag.in",
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
