const mongoose=require("mongoose");
const config=require("config");


mongoose.connect(`${config.get("MONGODB_URI")}/Scatch`).then(()=>{
    console.log("database connected successfully")
}).catch((err)=>{
    console.log("database connection failed",err);
});

module.exports=mongoose.connection;