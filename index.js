import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"







const app= express();
app.use(cors({
    //whitelisting domain name
      origin:"http://localhost:5173",
      credentials:true
  }));


app.use(express.json());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("Hello world Gemini");
})


dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Explain how AI works";




const generate= async (prompt)=>{
    try{
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text()


    }catch(err){
        console.log(err);
    }
}
// 
// generate();

app.get("/api/content", async (req,res)=>{
    try{
        
        const data = req?.query?.question;
       
        const result= await generate(data)
        res.send({
            "result": result
        })

    }catch(err){
        console.log(err)
    }
})



app.listen(4012,()=>{
    console.log("server is running on 4012");
    
})
