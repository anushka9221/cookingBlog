const mongoose=require('mongoose');
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true});//connect your project
const db=mongoose.connection;//database connection
db.on('error',console.error.bind(console,'connection error:'));//if error is there
db.once('open',function(){//whether connection was successful
  console.log('connected');
})

require('./Category');//require Category
require('./Recipe');
