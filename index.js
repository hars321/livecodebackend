const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const fetch=require("node-fetch")
const cors=require('cors');

const http = require('http').Server(app);
const io = require('socket.io')(http);


var port = process.env.PORT || 4000;
const dbconnect=require('./Database/dbconnect');
const Schema = require('./Database/Schema');
const { schema } = require("./Database/Schema");


app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  
  next();
});



app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false })


var socket = require('socket.io')
http.listen(port,()=>{
    console.log("Listening on port " + port)
})





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

app.get('/finduserbyid/:user_id',(req,res)=>{
  
  var {user_id}=req.params;
  console.log(user_id)
  Schema.findById(user_id)
  .then(data=>{
    console.log(data)
    res.status(200).send(data);
  })
  .catch(err=>{
    console.log(err)
    res.status(404).send(err);
  })

})

//find the given user code with id
app.get('/findcodebyid/:code_id',(req,res)=>{
  var {code_id}=req.params;

  Schema.findOne({"projects.directories.subdirectories._id":code_id}
  ,{ "projects.directories.subdirectories.$":true }
  )
  .then(data=>{
    
    if(data!=undefined){
      let directories=data.projects[0].directories;

      for(let i=0 ; i<directories.length ; i++){
        let subdirectory=directories[i].subdirectories;
        
        for(let j=0 ; j<subdirectory.length ; j++){
          
          if(subdirectory[j]._id==code_id){
            console.log(subdirectory[j].code)
            return res.json({"code":subdirectory[j].code});
          }

        }
      }
    }
  
  })
  .catch(err=>{
    return res.status(404).json(err);
  })
})

app.get('/findDirectory/:project_id',(req,res)=>{

  var {project_id}=req.params;
  
  Schema.find({'projects._id':project_id})
  .then(data=>{
    console.log(data)
    res.status(200).send(data);
  })
  .catch(err=>{
    console.log(err)
    res.status(404).send(err);
  })

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
insertCodeWithId=(data)=>{
  console.log(data)
  let subd_id = data.room;
  let dir_id = data.directory;
  let code = data.code;
  // console.log(dir_id)
  // console.log(subd_id)
  let new_obj={
    "_id":subd_id,
    "code":code
  }

  Schema.updateOne( 

    {"projects.directories.subdirectories._id":subd_id } 
    , 
    {$set : {"projects.$[].directories.$[].subdirectories.$[second].code":code} }
    ,
    {
      "arrayFilters": [
        { "second._id": subd_id }
      ]
     
    }
    
    )
    .then(data=>{
      console.log(data);
      // return res.send(data);
    })
    .catch(err=>{
      console.log(err);
    })

}

app.post('/updatecode',(req,res)=>{
  // insertCodeWithId(req.body);
  var subd_id=req.body.room;
  
  var code=req.body.code
  Schema.updateOne( 

    {"projects.directories.subdirectories._id":subd_id } 
    , 
    {$set : {"projects.$[].directories.$[].subdirectories.$[second].code":code} }
    ,
    {
      "arrayFilters": [
        { "second._id": subd_id }
      ]
     
    }
    
    )
    .then(data=>{
      console.log(data);
      return res.send(data);
    })
    .catch(err=>{
      console.log(err);
    })
  // res.send("done")
  
})
app.get('/getuserprojects',(req,res)=>{
  Schema.findOne({"name":"H123"})
  .then(data=>{
    return res.send(data);
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
        socket.in(data.room).emit('coordinates',data);
    })


    
    socket.on('code',(data)=>{
      console.log(data)

      //save data on the database
      insertCodeWithId(data);
      //broadcast the data to other clients
      console.log(data.room)
      socket.in(data.room).emit('code',data);
    })

    
  });
  




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

