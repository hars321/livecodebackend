const mongoose=require('mongoose');

// const comment=mongoose.Schema({
//     id:mongoose.Schema.Types.ObjectId,
//     comment_data:String,
//     likes:Number
// })
// const post=mongoose.Schema({
//     data:String,
//     like_count:Number,
//     likes:[mongoose.Schema.Types.ObjectId],
//     comment_count:Number,
//     comments:[comment]
    
// })
// const PostSchema=mongoose.Schema({
//     user:{
//         name:String,
//         email:String,
//         image:String,
//         password:String,
//         phone:String
//     },
//     posts:[post],


// });
const subdirectory=mongoose.Schema({
    name:String,
    code:String
})
const directory=mongoose.Schema({
    name:String,
    subdirectories:[subdirectory]
})
const project=mongoose.Schema({
    owner:String,
    name:String,
    description:String,
    directories:[directory]
})
const user=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    projects:[project]
})
// projects:[{project}]
module.exports=mongoose.model('user',user);