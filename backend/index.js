const express=require("express");
const app=express();
const cors=require("cors");


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:"*",
}))

app.post("/api/upload",(req,res)=>{
    if(!req.file){
        return res.json({error:"file not found"});
    }
    const file=req.file;


})

app.post("/api/chat",(req,res)=>{
    
})

app.listen(3000,(req,res)=>{
    console.log("app is listening on port 3000");
})