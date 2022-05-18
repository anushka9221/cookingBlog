let addIngredientsBtn=document.getElementById('addIngredientsBtn');
let ingredientList=document.querySelector('.ingredientList');//grab ingredient list
let ingredientDiv=document.querySelectorAll('.ingredientDiv')[0];//grab first ingredient div

addIngredientsBtn.addEventListener('click',function(){
  let newIngredients=ingredientDiv.cloneNode(true);
  let input=newIngredients.getElementsByTagName('input')[0];
  input.value='';//reset value
  ingredientList.appendChild(newIngredients);
});
