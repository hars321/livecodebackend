const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const fetch=require("node-fetch")



app.use(bodyParser.json())


app.post('/compiler',(req,res)=>{
    let client_id="9edc05a256539bd4f82b68fb24e3bec9"
    let client_secret="423bca08a7523e5ffe651b9c1a43caa1c31b6f9074a33395cf9b623e9207619a"

    let data=
    {
        "clientId": client_id,
        "clientSecret": client_secret,
        "versionIndex": "0",
        "language": req.body.language,
        "script": req.body.script
      }
    
    console.log(data)
    fetch('https://api.jdoodle.com/v1/execute',{
            method:'POST',
            body:JSON.stringify(data),
            mode: "cors",
            
            headers:{'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':""},
            
            }).then((response=>response.json())).then(data=>{

                res.status(200).json(data);
            })

    
    


})

app.listen(4000,()=>{
    console.log("Listening on port 4000")
})