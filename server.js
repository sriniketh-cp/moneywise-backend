import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config();

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
  const {name,email,address,phone,plans}=req.body||{};

  if(!name||!email||!Array.isArray(plans)){
    return res.status(400).json({
      sucess:false,
      message:"Invalid request body",
    });
  }

  try{
    const response=await fetch("https://api.brevo.com/v3/smtp/email",{
        method:"POST",
        headers:{
          "api-key":process.env.BREVO_API_KEY,
          "Content-Type":"application/json",
          "accept":"application/json",

        },
    body:JSON.stringify({
      sender:{
        name:"MoneyWise",
        email:"contact@moneywisemag.in",
      },
      to:[
        {
          email:"editor@moneywisemag.in",
          name:"chief-editor"
        },
        ],
      subject:`New Subscription from ${name}`,
      textContent:`
      Name:${name}
      Email:${email}
      Address:${address}
      Phone:${phone}
      Plans Selected:${plans.join(", ")}
    `,
    

}),
});

const result=await response.json();

if(!response.ok){
console.error("BREVO API ERROR:" ,result);
return res.status(500).json({
success:false,
message:"Email failed"
});
}
res.json({
success:true,
message:"Email sent sucessfully",
});
}catch(error){
console.error("EMAIL ERROR:",error);
res.status(500).json({
success:false,
message:"Email failed",
});
}
});
