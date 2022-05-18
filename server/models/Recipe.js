const mongoose=require('mongoose');
const recipeSchema=new mongoose.Schema({//create mongoose schema
  name:{
    type:String,
    required:'this is required.'
  },
  description:{
    type:String,
    required:'this is required.'
  },
  email:{
    type:String,
    required:'this is required.'
  },
  ingredients:{
    type:Array,
    required:'this is required.'
  },
  category:{
    type:String,
    enum:['Thai','American','Chinese','Mexican','Indian','Spanish'],
    required:'this is required.'
    },
    image:{
      type:String,
      required:'this is required.'
    },
});

recipeSchema.index({name:'text',description:'text'});//searchRecipe we are going to search comparing the searchTerm with name and description
module.exports=mongoose.model('Recipe',recipeSchema);
