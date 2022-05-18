const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({//create mongoose schema
  name:{
    type:String,
    reuired:'this is required.'
  },
  image:{
    type:String,
    reuired:'this is required.'
  },
});
module.exports=mongoose.model('Category',categorySchema);//export this module as category and collection naem is categorySchema
//move to recipeController.js
