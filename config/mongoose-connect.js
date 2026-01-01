const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Mongodb database connected successful')
}).catch((err)=>{
    console.log("database connection failed", err.message);
})