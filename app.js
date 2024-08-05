const express=require("express")
const app=express()
app.use(express.json())
const sqlite3=require("sqlite3")
const {open} =require("sqlite")
const path=require("path")
const { request } = require("http")
const cors=require("cors")
app.use(cors())

const dbPath=path.join(__dirname,"user.db")
let db=null
const initializeDBAndServer=async ()=>{
       try{

        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3008,()=>{
            console.log("port running")
        })
        
       }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
       }
       

}

initializeDBAndServer()

app.get("/",async(request,response)=>{
    const selectQuery=`select * from user`
    const responsedata=await db.all(selectQuery)
    response.send(responsedata)
    
})



app.post("/login",async(request,response)=>{
    const {username,password}=request.body
    const selectQuery=`select * from user where username='${username}';`;
    const responsedata=await db.get(selectQuery)
    console.log(responsedata)
    if(responsedata===undefined){
        const createQuery=`insert into user (username,password) values ('${username}','${password}');`;

        await db.run(createQuery)
        response.send("user created succeefully")
    }else{
        response.status(400)
        response.send("user already exists")
    }
})

