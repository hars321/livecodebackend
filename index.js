const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const fetch=require("node-fetch")
const cors=require('cors');
var socket = require('socket.io');

const dbconnect=require('./Database/dbconnect');
const Schema = require('./Database/Schema');

app.use(bodyParser.json());

app.use(cors());
 app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  
  next();
});

var server=app.listen(4000,()=>{
    console.log("Listening on port 4000")
})


var io=socket(server, {
    cors: {
      origin: '*',
    }
});


app.post('/newuser',(req,res)=>{
  const user =new Schema(req.body);
  user.save()
            .then(data=>{
              console.log(data)
               return res.status(200).send(data);
            }).catch(err=>{
              return res.status(404).send(err);
            })
})

app.post('/finduserbyid',(req,res)=>{
  var id=req.body.id;
  Schema.findById(id).then(data=>{
    console.log(data)
    res.status(200).send(data);
  }).catch(err=>{console.log(err)})
})

app.get('/findusers',(req,res)=>{
  
  Schema.find()
  .then(data=>{
    res.status(200).send(data)
  })
  .catch(err=>{
    res.status(404).send(err);
  })
  
})

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);


    //join room 
    socket.on("join_room", (data)=>{
      console.log(data)

      socket.join(data.room);
    })


    //listen for emits from client
    socket.on('coordinates',(data)=>{
        console.log(data)
    
        //broadcast the data to other clients
        socket.to(data.room).broadcast.emit('coordinates',data);
    })


    
    socket.on('code',(data)=>{
      console.log(data)
      //broadcast the data to other clients
      console.log(data.room)
      socket.to(data.room).broadcast.emit('code',data);
    })

    
  });
  


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

