const mongoose=require('mongoose');

let username="harshit"
let password="AJ0L5ct55rxyHrni"
let dbname="Livecode"
let url=`mongodb+srv://${username}:${password}@cluster0.zavqg.mongodb.net/${dbname}?retryWrites=true&w=majority`
//const uri = "mongodb+srv://harshitgargbtech:gboubSpJK4s5N9Ly@cluster0.a2dsg.mongodb.net/newdb?retryWrites=true&w=majority";

let dbconnect=mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
.then(data=>{
    console.log("connected to Data Base");
})
.catch(err=>{
    console.log(err.message);
});

module.exports=dbconnect;