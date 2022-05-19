require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
//this is a get page homepage
//step14 export homepage
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({
      _id: -1
    }).limit(limitNumber);
    const thai = await Recipe.find({
      'category': 'Thai'
    }).limit(limitNumber);
    const american = await Recipe.find({
      'category': 'American'
    }).limit(limitNumber);
    const chinese = await Recipe.find({
      'category': 'Chinese'
    }).limit(limitNumber);

    const food = {
      latest,
      thai,
      american,
      chinese
    };
    // console.log(food);
    res.render('index', {
      title: 'Cooking Blog-Home',
      categories,
      food
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }

  //async means asynchronous function
}

//Categories page(http://localhost:3000/categories)
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', {
      title: 'Cooking Blog-Categories',
      categories
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}

//explore-categories-recipe page
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id; //gets id from this router.get('/recipe/:id',recipeController.exploreRecipe);
    const limitNumber = 5;
    const categoryById = await Recipe.find({
      'category': categoryId
    }).limit(limitNumber); //query on db
    res.render('categories', {
      title: 'Cooking Blog-Categories',
      categoryById
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}

//recipe page
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id; //gets id from this router.get('/recipe/:id',recipeController.exploreRecipe);
    const recipe = await Recipe.findById(recipeId); //query on db
    res.render('recipe', {
      title: 'Cooking Blog-Categories',
      recipe
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}



//post searchRecipe
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm; //req.body becoz its a form and we use searchTerm bcoz thats the name in main layout for the form
    let recipe = await Recipe.find({
      $text: {
        $search: searchTerm,
        $diacriticSensitive: true
      }
    });
    res.render('search', {
      title: 'Cooking Blog-Search',
      recipe
    });

  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 5;
    const recipe = await Recipe.find({}).sort({
      _id: -1
    }).limit(limitNumber);
    res.render('explore-latest', {
      title: 'Cooking Blog-Exploere latest',
      recipe
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments(); //count number of documents
    let random = Math.floor(Math.random() * count); //make a random number
    let recipe = await Recipe.findOne().skip(random).exec(); //query in which we find only one recipe and jump to the number generated and execute
    // res.json(recipe);

    res.render('explore-random', {
      title: 'Cooking Blog-Explore random',
      recipe
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}


exports.submitRecipe = async (req, res) => {
  //flash messages
  const infoErrorsObj = req.flash('infoErrors'); //holds all errors we want to display to the user and infoErrors is the name
  const infoSubmitObj = req.flash('infoSubmit'); //this is for success messgaes
  res.render('submit-recipe', {
    title: 'Cooking Blog- Submit recipe',
    infoErrorsObj,
    infoSubmitObj
  });

}

exports.submitRecipeOnPost = async (req, res) => {
  //post flash messages
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no files uploaded");
    } else {
      imageUploadFile = req.files.image; //get the name of the input from submit-recipe
      newImageName = Date.now() + imageUploadFile.name; //unique name of every image

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName; //set directory
      imageUploadFile.mv(uploadPath, function(err) { //imageUploadFile upload to the uploadPath
        if (err) return res.status(500).send(err);
      });
    }


    //submit some data to database
    const newRecipe = new Recipe({ //Recipe model at top
      //when we add data to form it gets into database through this
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    await newRecipe.save(); //saves in database
    req.flash('infoSubmit', 'Recipe has been added.') //this message is shown by submit-recipe.ejs infoSubmitObj
    res.redirect('/submit-recipe');
  } catch (error) {
    req.flash('infoErrors', error); //this message is shown by submit-recipe.ejs infoErrorsObj
    res.redirect('/submit-recipe');
  }

}


exports.contact= async (req, res) => {
  try {

    res.render('contact', {
      title: 'Contact-Me'
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured"
    });
  }
}

// a921492a5e96ba8651040e4bee7a2285-us20



//update newrecipe but comment this so that it doesnt get updated always
//async function updateRecipe(){
//try{
//const res=await Recipe.updateOne({name:'New Recipe'},{name:'New recipe updated'});
//res.n;//number of documents matched
//res.nModified;//number of documents modified
//}catch(error){console.log(error)};
//}
//updateRecipe();



//delete newrecipe but comment this so that it doesnt get deleted always
//async function deleteRecipe(){
//try{
//await Recipe.deleteOne({name:'New Recipe'});
//}catch(error){console.log(error)};
//}
//deleteRecipe();








// async function insertDummyCategoryData(){
//   try{
//     await Category.insertMany([
//       {
//         "name":"Thai",
//         "image":"thai-food.jpg"
//       },
//       {
//         "name":"American",
//         "image":"american-food.jpg"
//       },
//       {
//         "name":"Chinese",
//         "image":"chinese-food.jpg"
//       },
//       {
//         "name":"Mexican",
//         "image":"mexican-food.jpg"
//       },
//       {
//         "name":"Indian",
//         "image":"indian-food.jpg"
//       },
//       {
//         "name":"Spanish",
//         "image":"spanish-food.jpg"
//       },
//     ]);
//   }catch(error){
//   console.log('err',+error)
// }
// }
//
// insertDummyCategoryData();
//
//
//
//
//
//
//
//
//
// async function insertDummyRecipeData() {
//   try {
//     await Recipe.insertMany([{
//         "name": "Khao-pad",
//         "description": `This is a very famous rice dish of Thailand which is flavoured with herbs and spices. The herbs along with egg, chicken and drizzle of lemon juice makes it an exotic platter to enjoy.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "11/2 cup Jasmine rice cooked",
//           "400 grams Chicken boneless cut into small pieces",
//           "1 table spoon Corn flour",
//           "eggs beaten",
//           "1 tbsp Finely chopped garlic",
//           "1/2 cup Onion slice half cup",
//           "5 table spoon Oil",
//           "1/4 cup thai chilli pepper",
//           "1/2 tsp thai pepper powder",
//           "2 tbsp fish sauce",
//           "1 tbsp soy sauce",
//           "to taste Salt",
//           "1 tbsp Lime juice",
//           "1 tsp Sugar",
//           "1 Tomato chopped",
//           "as required Spring onion chopped",
//           "handful Coriander leaves for garnishing",
//         ],
//         "category": "Thai",
//         "image": "khao-pad.jpg"
//       },
//       {
//         "name": "Moo-satay",
//         "description": `A dish of seasoned, skewered and grilled meat, usually served with a sauce. Its origins are from Indonesia and is popular in many other Southeast Asian countries including Thailand, Malaysia, Singapore and Vietnam. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "2 Pounds Pork tenderloin, sliced into 1/4",
//           "4 Tablespoons Lemongrass water",
//           "5 Tablespoons Thin soy sauce",
//           "1/2 Teaspoon Salt",
//           "1 Tablespoon Sugar",
//           "14 Ounces Coconut milk",
//           "1 Teaspoon Turmeric powder",
//           "1/2 Tablespoon Thai curry powder",
//           "1 Teaspoon Baking Soda",
//         ],
//         "category": "Thai",
//         "image": "moo-satay.jpg"
//       },
//       {
//         "name": "Pad-kra-pao-moo",
//         "description": `Pad Kra Pao is a very popular Thai food dish between local people in Thailand. When people don't know what to order, they just order Pad Kra Pao! This dish is quick and delicious. "Pad" means "fried" and "Kra Pao" is the Thai name of Holy basil that is one of the main ingredients.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 tablespoon olive oil",
//           "1 tablespoon garlic",
//           "100 grams Ground pork ((1/4 cup))",
//           "red pepper or thai chile to taste (optional)",
//           "1 tablespoon fish sauce (i used 3 crabs)",
//           "1 teaspoon black soy sauce",
//           "1 dash sugar",
//           "2–3 tablespoons water",
//           "1 large handful holy basil leaves (rinsed)",
//         ],
//         "category": "Thai",
//         "image": "pad-kra-pao-moo.jpg"
//       },
//       {
//         "name": "Pad-thai",
//         "description": `Pad thai, phat thai, or phad thai, is a stir-fried rice noodle dish commonly served as a street food in Thailand as part of the country's cuisine. It is typically made with rice noodles, shrimp, peanuts, a scrambled egg, and bean sprouts, among other vegetables `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           " 10 ounces thin rice noodles",
//           "3 tablespoons oil, divided",
//           "1 pound boneless skinless chicken breasts, thinly sliced and cut into bite-sized pieces",
//           "1 cup fresh bean sprouts",
//           "1/2 cup shredded carrots",
//           "4 cloves garlic, minced",
//           "3 eggs, whisked",
//           "3 green onions, sliced into 1-inch pieces",
//         ],
//         "category": "Thai",
//         "image": "pad-thai.jpg"
//       },
//       {
//         "name": "Tom-kha-gai",
//         "description": `Tom kha kai, tom kha gai, or Thai coconut soup is a spicy and sour hot soup with coconut milk in Thai cuisine. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 can (14 oz.) coconut milk",
//           "1 can (14 oz.) reduced-sodium chicken broth",
//           "6 quarter-size slices fresh ginger",
//           "1 stalk fresh lemongrass, cut in 1-in. pieces",
//           "1 pound boned, skinned chicken breast or thighs, cut into 1-in. chunks",
//           "1 cup sliced mushrooms",
//           "1 tablespoon fresh lime juice",
//           "1 tablespoon Thai or Vietnamese fish sauce (nuoc mam or nam pla)",
//           "1 teaspoon sugar",
//           "1 teaspoon Thai chili paste",
//           "¼ cup fresh basil leaves",
//           "¼ cup fresh cilantro",
//         ],
//         "category": "Thai",
//         "image": "tom-kha-gai.jpg"
//       },
//
//
//
//       {
//         "name": "Cheeseburger",
//         "description": `A cheeseburger is a hamburger topped with cheese. Traditionally, the slice of cheese is placed on top of the meat patty. The cheese is usually added to the cooking hamburger patty shortly before serving, which allows the cheese to melt. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "2 pounds freshly ground chuck, (at least 80% lean, a.k.a. 80/20)",
//           "1 tablespoon onion powder",
//           "1 teaspoon salt",
//           "1 teaspoon freshly ground black pepper",
//           "12 slices deli-counter American cheese",
//           "6 large burger buns, preferably homemade, toasted if desired",
//         ],
//         "category": "American",
//         "image": "cheeseburger.jpg"
//       },
//       {
//         "name": "Reuban sandwich",
//         "description": `The Reuben sandwich is a North American grilled sandwich composed of corned beef, Swiss cheese, sauerkraut, and Thousand Island dressing or Russian dressing, grilled between slices of rye bread. It is associated with kosher-style delicatessens, but is not kosher because it combines meat and cheese. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "2 tsp Unsalted butter softened",
//           "2 slices Rye Bread",
//           "4 tbsp Thousand Island Dressing",
//           "2 tbsp Sauerkraut drained",
//           "2 slices Boar's Head Foodservice Imported Switzerland Swiss",
//           "Cheese - sliced thin ¼ lb",
//           "1st Cut Cooked Corned Beef Brisket thin",
//         ],
//         "category": "American",
//         "image": "reuben-sandwich.jpg"
//       },
//       {
//         "name": "Hot Dogs",
//         "description": `A hot dog is a food consisting of a grilled or steamed sausage served in the slit of a partially sliced bun. The term hot dog can also refer to the sausage itself. The sausage used is a wiener or a frankfurter. The names of these sausages also commonly refer to their assembled dish.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1/4 cup very finely minced onion",
//           "1 small clove garlic, finely chopped",
//           "1 teaspoon ground coriander",
//           "1 teaspoon sweet paprika",
//           "1/2 teaspoon ground mustard seed",
//           "1/4 teaspoon dried marjoram",
//           "1/4 teaspoon ground mace",
//           "1/4 cup milk",
//           "1 large egg white",
//           "1 1/2 teaspoons sugar",
//           "1 teaspoon salt, or to taste",
//           "1 teaspoon freshly ground white pepper",
//           "1 pound lean pork, cubed",
//           "3/4 pound lean beef, cubed",
//           "1/4 pound pork fat, cubed",
//         ],
//         "category": "American",
//         "image": "hot-dogs.jpg"
//       },
//       {
//         "name": "Philly cheese steak",
//         "description": `A cheesesteak is a sandwich made from thinly sliced pieces of beefsteak and melted cheese in a long hoagie roll. A popular regional fast food, it has its roots in the U.S. city of Philadelphia, Pennsylvania.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "10 to 12 ounces ribeye steak",
//           "1/2 teaspoon kosher salt",
//           "1/2 teaspoon black pepper",
//           "2 tablespoons olive oil",
//           "1/2 medium sweet onion, sliced",
//           "1/2 green bell pepper, sliced",
//           "1/2 red bell pepper, sliced",
//           "2 ounces (3 slices) provolone cheese",
//           "2 hoagie rolls, toasted",
//           "1/4 cup Cheez Whiz, warmed",
//         ],
//         "category": "American",
//         "image": "philly-cheese-steak.jpg"
//       },
//       {
//         "name": "Nachos",
//         "description": `Nachos are a Tex-Mex food consisting of fried tortilla chips or totopos covered with melted cheese or cheese sauce, as well as a variety of other toppings, often including meats, vegetables, and condiments such as salsa or sour cream.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 cup Corn flour",
//           "1/4 cup Whole Wheat Flour",
//           "Oil , as required",
//           "Water , to knead the flour",
//           "Salt , Salt as required",
//           "Barbeque masala , to garnish",
//         ],
//         "category": "American",
//         "image": "nachos.jpg"
//       },
//
//
//
//       {
//         "name": "Shrimp dumplings",
//         "description": `Originated from Guangzhou, China, these dainty shrimp dumplings have won the world over and become a staple Chinese food in Chinatown. Har gau dumpling can also be found in many Chinese-Cantonese dim sum restaurants in Hong Kong, Vancouver, Toronto, Singapore, Malaysia, Sydney, London and more! `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 pound shrimp, peeled, deveined and diced",
//           "8 ounces ground pork",
//           "1 cup shredded green cabbage",
//           "2 green onions, thinly sliced",
//           "1 tablespoon freshly grated ginger",
//           "1 teaspoon sesame oil",
//           "1 teaspoon mirin",
//           "Kosher salt and freshly ground black pepper, to taste",
//           "36 2-inch won ton wrappers",
//           "2 tablespoons vegetable oil",
//           "Soy sauce, for serving",
//         ],
//         "category": "Chinese",
//         "image": "shrimp-dumplings.jpg"
//       },
//       {
//         "name": "Dim sum",
//         "description": `Dim sum is a large range of small Chinese dishes that are traditionally enjoyed in restaurants for brunch. Most modern dim sum dishes originated in China and are commonly associated with Cantonese cuisine, although dim sum dishes also exist in other Chinese cuisines.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 pound ground pork",
//           "1 large onion, chopped",
//           "½ bunch cilantro, chopped",
//           "½ teaspoon crushed red pepper flakes",
//           "2 teaspoons red curry paste",
//           "½ teaspoon garam masala",
//           "½ teaspoon chili powder",
//           "¼ teaspoon onion powder",
//           "¼ teaspoon garlic powder",
//           "1 cup all-purpose flour",
//           "¼ cup water as needed",
//           "3 tablespoons peanut butter",
//           "½ teaspoon cayenne pepper",
//           "1 teaspoon white sugar",
//           " 1 teaspoon vegetable oil",
//         ],
//         "category": "Chinese",
//         "image": "dim-sum.jpg"
//       },
//       {
//         "name": "Char siu",
//         "description": `Char siu is a Cantonese style of barbecued pork. It is eaten with rice, or used as an ingredient for noodle dishes or stir fries, or as a filling for chasiu baau.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "½ cup soy sauce",
//           "⅓ cup honey",
//           "⅓ cup ketchup",
//           "⅓ cup brown sugar",
//           "¼ cup Chinese rice wine",
//           "2 tablespoons hoisin sauce",
//         ],
//         "category": "Chinese",
//         "image": "char-siu.jpg"
//       },
//       {
//         "name": "Hot pot",
//         "description": `Hot pot or hotpot, also known as soup-food or steamboat, is a cooking method that originated in China, prepared with a simmering pot of soup stock at the dining table, containing a variety of Chinese foodstuffs and ingredients.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "2 lb beef flank",
//           "1 lb chicken breast",
//           "1 lb pork chop",
//           "2 lb tilapia fish fillets",
//           "1.5 lb shrimp (size 31-35)",
//           "1.5 lb squid",
//           "1 lb firm tofu",
//           "4 oz dried vermicelli noodles",
//           "1 lb spinach",
//           "1 lb Chinese broccoli",
//           "0.50 lb seafood mushroom",
//           " 0.50 lb king oyster mushroom",
//           "1.5 lb daikon (used as soup base)",
//         ],
//         "category": "Chinese",
//         "image": "hot-pot.jpg"
//       },
//       {
//         "name": "Kung pao chicken",
//         "description": `Kung Pao chicken, also transcribed Gong Bao or Kung Po, is a spicy, stir-fried Chinese dish made with cubes of chicken, peanuts, vegetables, and chili peppers. The classic dish in Sichuan cuisine originated in the Sichuan Province of south-western China and includes Sichuan peppercorns. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "Boneless skinless chicken breast",
//           "Soy sauce (or tamari)",
//           "Vinegar (rice vinegar or sherry vinegar)",
//           "Cornstarch",
//           "Granulated sugar",
//           "Toasted sesame oil",
//           "Red & green bell peppers",
//           "Green onions",
//           "Cashews",
//           "Dried red chili peppers",
//           "Fresh garlic & ginger",
//         ],
//         "category": "Chinese",
//         "image": "kung-pao-chicken.jpg"
//       },
//
//
//
//       {
//         "name": "Chilaquiles",
//         "description": `chilaquiles, a Mexican dish consisting of strips or pieces of corn tortillas that are fried, then sautéed with green or red salsa, and topped with cheese, crema (a sweet, thin cream sauce), and onion. Pulled chicken may also be added during the cooking process, and casserole versions of the dish are popular. Beans, eggs, beef, and avocado are among the foods often served with chilaquiles. It is typically eaten for breakfast or brunch, much like the Tex-Mex dish migas, which is made with scrambled eggs and tortilla strips. Chilaquiles was originally created as a way to use slightly stale leftover tortillas.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "12 corn tortillas, preferably stale, or left out overnight to dry out a bit, quartered or cut into 6 wedges",
//           "Corn oil, or other neutral oil for frying",
//           "Kosher salt",
//           "1 1/2 to 2 cups red chile sauce or salsa verde, store-bought or homemade",
//         ],
//         "category": "Mexican",
//         "image": "chilaquiles.jpg"
//       },
//       {
//         "name": " Huevos Rancheros",
//         "description": ` These represent the hats of two ranchmen. It´s made with two fried corn tortillas, topped with fried beans, and two sunny side up eggs all bathed in red hot sauce and decorated with coriander and freshly ground black pepper. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 tablespoon extra virgin olive oil",
//           "1/2 medium onion, chopped",
//           "1 (15-ounce) can whole or crushed tomatoes (preferably fire-roasted), or 1 to 2 large fresh tomatoes, when in season",
//           "1/2 (6 ounce) can diced green Anaheim chiles",
//           "Chipotle chili powder, adobo sauce, or ground cumin to taste",
//           "4 corn tortillas",
//           "Butter",
//           "4 large eggs",
//
//         ],
//         "category": "Mexican",
//         "image": "huevos-rancheros.jpg"
//       },
//       {
//         "name": "Machaca",
//         "description": `This is one of the most popular dishes on the northern side of México. Machaca is very versatile; you can either eat it in a taco, a stuffed burrito, flautas, or just as a stew with some tortillas, beans, or rice on the side. Machaca is simply a shredded version of dried beef with a proper seasoning. It´s delicious!  `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 (4 pound) boneless beef chuck roast, trimmed and cut into 8 portions",
//           "½ cup olive oil",
//           "¼ cup Worcestershire sauce",
//           "2 limes, juiced",
//           "1 (14 ounce) can diced tomatoes, undrained",
//           "1 large sweet onion, diced",
//           "½ green bell pepper, diced",
//           "4 cloves garlic, minced",
//           "1 jalapeno pepper, seeded and minced",
//           "½ cup beef broth",
//           "1 tablespoon dried oregano",
//           "1 tablespoon ground cumin",
//           "1 teaspoon chili powder",
//           "½ teaspoon salt, or more to taste",
//           "½ teaspoon ground black pepper",
//
//         ],
//         "category": "Mexican",
//         "image": "machaca.jpg"
//       },
//       {
//         "name": "Discada",
//         "description": ` A northern meaty dish, yes… it´s full of meat: sausage, chorizo, ground meat, ham, bacon, lard, jalapeño pepper, onion. And it is all seasoned with thyme, celery, cumin, oregano, bay leaf, black pepper, black sauces, salt, rosemary, a bit of dark beer, etc. This dish is cooked on a plow disc previously cured over some wood. It is a traditional dish for family reunions.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "2 tablespoon Vegetable Oil",
//           "2 thick slices bacon ",
//           "1 Chorizo crumbled ",
//           "½ Lb. Pork meat",
//           "1 Lb. sirloin",
//           "1 cup white onion",
//           "1 green bell pepper",
//           "2 serrano peppers",
//           "2 hot dog sausages",
//           "4 cups tomatoes",
//           "1 cup beer",
//           "Salt and pepper",
//           "⅓ cup cilantro",
//
//         ],
//         "category": "Mexican",
//         "image": "discada.jpg"
//       },
//       {
//         "name": "Tacos",
//         "description": `Recognized as the most popular Mexican dish worldwide, the taco has become an art. Some say is the “art of eating with tortilla” and, of course, Mexicans would never deny a taco to anybody. Hundreds of fillings can be put on a corn tortilla! The most common are beef steak, flank steak, chorizo, offal, “al pastor”, hot and sweet marinated pork. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 lb. 90% to 93% lean ground beef",
//           "1 Tablespoon chili powder",
//           "1 teaspoon ground cumin",
//           "3/4 teaspoon salt",
//           "1/2 teaspoon dried oregano",
//           "1/2 teaspoon garlic powder",
//           "1/4 teaspoon ground black pepper",
//           "1/2 cup tomato sauce",
//           "1/4 cup water",
//           "12 taco shells - either hard shells or small 6-inch soft flour tortillas will work",
//         ],
//         "category": "Mexican",
//         "image": "tacos.jpg"
//       },
//
//
//
//
//       {
//         "name": "Biryani",
//         "description": ` If there’s one dish that almost everyone knows in Indian cuisine, it’s biryani. The origin of this aromatic mixture of rice, spices and meat is usually credited to the Mughal kings who once ruled the subcontinent, but it’s now a popular dish all over the country. The meat (and vegetables, if used) and rice are cooked separately before being layered and cooked together with a mixture of spices. The type of meat used varies; goat, chicken, beef, lamb, fish or prawns are used according to the region, with eggs and potatoes sometimes added as well.States across India all cook this quintessential main dish in different styles, with Delhi biryani and Hyderabadi biryani being popular varieties. It is also served with a regional twist in countries such as Pakistan, Bangladesh, Afghanistan and Burma. You can learn how to make biryani at home.`,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1 cup boiled basmati rice",
//           "1/2 teaspoon mint leaves",
//           "salt as required",
//           "2 tablespoon refined oil",
//           "3 green cardamom",
//           "2 clove",
//           "2 onion",
//           "1 teaspoon turmeric",
//           "1 tablespoon garlic paste",
//           "1 cup hung curd",
//           "2 tablespoon coriander leaves",
//           "water as required",
//           "1 tablespoon ghee",
//           "600 gm chicken",
//           "1 tablespoon garam masala powder",
//           "1 teaspoon saffron",
//           "1 tablespoon bay leaf",
//           "1 black cardamom",
//           "1 teaspoon cumin seeds",
//           "4 green chillies",
//           "1 tablespoon ginger paste",
//           "1 teaspoon red chilli powder",
//           "1/2 tablespoon ginger",
//           "2 drops kewra",
//           "1 tablespoon rose water",
//         ],
//         "category": "Indian",
//         "image": "biryani.jpg"
//       },
//       {
//         "name": "Lamb Saag",
//         "description": `Saag is a term widely used in the northern region of Punjab for any leafy green vegetable dish, and in several regions nearby, including Bengal and Assam in the east. Lamb saag (also known as saag gosht) is usually made with pureed spinach and tender, juicy chunks of lamb with aromatic spices like cumin, cardamom, coriander seeds, ginger and garlic. It gets its signature creaminess from the addition of cream or yogurt. Serve this with naan (leavened, oven-baked flatbread), roti (unleavened flatbread) or parantha (flaky fried flatbread). Learn more about Indian bread. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "500 gm. good cut of lamb, cut into cubes. Lean meat like leg or shoulder is better",
//           "250-300 gm. spinach leaves",
//           "A bunch of methi or fenugreek leaves. 2 tbsp. dry, kasoori methi can be used instead.",
//           "2 medium onions (about 300 gm.), peeled",
//           "1 inch piece of ginger, peeled",
//           "2-3 cloves of garlic, peeled",
//           "2 green chillies",
//           "3 tbsp. oil or ghee",
//           "1 tsp. turmeric powder",
//           "1 1/2 tsp. coriander powder",
//           "Salt to taste",
//           "2 heaped tbsp. tomato purée or 1 1/2 cup of chopped/tinned tomatoes",
//           "1 level tsp. Garam Masala",
//           "Water, as required",
//         ],
//         "category": "Indian",
//         "image": "lamb-saag.jpg"
//       },
//       {
//         "name": "Curry",
//         "description": `If you ask any Indian about a curry, chances are they’ll reply, “Which one?” “Curry” was a blanket term used by the British during the era of colonization for the wide variety of foreign dishes they couldn’t identify, and while you might find a generic version of curry in the UK, Indian cuisine simply doesn’t have one singular dish called curry. The word generally refers to a spicy gravy preparation—for example, South Indian-style egg curry, which uses curry leaves and coconut milk, or Konkan fish curry, a coastal preparation heavy on coconut milk and tamarind popular in the states of Maharashtra and Goa. You might also find variations like the Sindhi kadai, a version made from garbanzo bean flour originating in the neighboring country of Pakistan. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "3 tablespoons olive oil",
//           "1 small onion, chopped",
//           "2 cloves garlic, minced",
//           "3 tablespoons curry powder",
//           "1 teaspoon ground cinnamon",
//           "1 teaspoon paprika",
//           "1 bay leaf",
//           "½ teaspoon grated fresh ginger root",
//           "½ teaspoon white sugar",
//           "salt to taste",
//           "2 skinless, boneless chicken breast halves - cut into bite-size pieces",
//           "1 tablespoon tomato paste",
//           "1 cup plain yogurt",
//           "¾ cup coconut milk",
//           "½ lemon, juiced",
//           "½ teaspoon cayenne pepper",
//         ],
//         "category": "Indian",
//         "image": "curry.jpg"
//       },
//       {
//         "name": "Korma",
//         "description": `Like biryani, korma can be traced back to Mughlai cuisine, which specialized in meat-heavy, creamy dishes, though the current milder version most likely originated in the UK. The word comes from the Persian word qorma, which means “braise.” For this preparation, meat (usually chicken) or vegetables are braised over high heat with yogurt or cream, and then cooked long and slow. The dish’s spices are usually tempered by the dairy to make it milder, and much like curry, it has variations in different regions. For example, in South India, dried coconut is often added to the dish. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "4 British chicken breast fillets (around 600g)",
//           "2 tbsp sunflower or vegetable oil",
//           "40g butter",
//           "2 brown onions, coarsely grated or very finely chopped",
//           "4 tsp ginger and garlic paste",
//           "2 tsp ground cumin",
//           "2 tsp ground coriander",
//           "1 tsp ground turmeric",
//           "¼ tsp mild chilli powder",
//           "2 tbsp mango chutney or 2 tsp caster sugar",
//           "300ml hot chicken stock",
//           "100ml double cream",
//         ],
//         "category": "Indian",
//         "image": "korma.jpg"
//       },
//       {
//         "name": "Rogan josh",
//         "description": `Made for the cold climate of Kashmir, the northernmost state in India, the name rogan josh likely comes from the Urdu words for “red meat.” This spicy braised dish usually uses lamb or mutton and gets its signature color from a large amount of lal mirch (Kashmiri red chilis). Milder than the usual Indian chilis, their paprika-like taste makes this dish a great starting point for anyone new to Indian cuisine. Garlic, ginger, cardamom, bay leaves, cinnamon and cloves make up the rest of the flavor profile, with the spice usually being tempered at the end with a generous helping of yogurt. `,
//         "email": "anushkaghorpade0921@gmail.com",
//         "ingredients": [
//           "1/2 tsp. hot chilli powder",
//           "1 tsp. ground coriander",
//           "1 tsp. ground cumin",
//           "1/2 tsp. ground black pepper",
//           "2 tsp. sweet paprika",
//           "1 tsp. turmeric",
//           "2 tsp. garam masala",
//           "1/2 tsp. ground cardamom",
//           "3 tbsp. tomato puree",
//         ],
//         "category": "Indian",
//         "image": "rogan-josh.jpg"
//       },
//
//             {
//             "name": "Paella Valenciana",
//             "description": `Paella is perhaps the most famous Spanish dish of all, and certainly one of the most abused. Authentic paella originates from the region around Valencia, and comes in two varieties: Paella Valenciana, with rabbit and chicken; and seafood paella.Saffron gives the rice its color, and the base should be left to crisp into a mouth-watering black crust, called the socarrat. Always eaten at lunchtime.`,
//             "email": "anushkaghorpade0921@gmail.com",
//             "ingredients": [
//               "1 tablespoon olive oil",
//               "½ (4 pound) whole chicken, cut into 6 pieces",
//               "½ (2 pound) rabbit, cleaned and cut into pieces",
//               "1 head garlic, cloves separated and peeled",
//               "1 tomato, finely chopped",
//               "1 (15.5 ounce) can butter beans",
//               "½ (10 ounce) package frozen green peas",
//               "½ (10 ounce) package frozen green beans",
//               "salt to taste",
//               "1 teaspoon mild paprika, or to taste",
//               "1 pinch saffron threads",
//               "1 pinch dried thyme to taste",
//               "1 pinch dried rosemary to taste",
//               "4 cups short-grain white rice, such as bomba, Valencia or arborio",
//             ],
//             "category": "Spanish",
//             "image": "paella-valenciana.jpg"
//           },
//           {
//             "name": "Paella Valenciana",
//             "description": `Paella is perhaps the most famous Spanish dish of all, and certainly one of the most abused. Authentic paella originates from the region around Valencia, and comes in two varieties: Paella Valenciana, with rabbit and chicken; and seafood paella.Saffron gives the rice its color, and the base should be left to crisp into a mouth-watering black crust, called the socarrat. Always eaten at lunchtime.`,
//             "email": "anushkaghorpade0921@gmail.com",
//             "ingredients": [
//               "1 tablespoon olive oil",
//               "½ (4 pound) whole chicken, cut into 6 pieces",
//               "½ (2 pound) rabbit, cleaned and cut into pieces",
//               "1 head garlic, cloves separated and peeled",
//               "1 tomato, finely chopped",
//               "1 (15.5 ounce) can butter beans",
//               "½ (10 ounce) package frozen green peas",
//               "½ (10 ounce) package frozen green beans",
//               "salt to taste",
//               "1 teaspoon mild paprika, or to taste",
//               "1 pinch saffron threads",
//               "1 pinch dried thyme to taste",
//               "1 pinch dried rosemary to taste",
//               "4 cups short-grain white rice, such as bomba, Valencia or arborio",
//             ],
//             "category": "Spanish",
//             "image": "paella-valenciana.jpg"
//           },
//           {
//           "name": "Patatas bravas",
//           "description": `A staple among the small dishes that make up a classic tapas menu, patatas bravas -- "brave potatoes" -- is named for its spicy sauce, rare in a land that generally shuns fiery food.The potatoes are cubed and shallow fried and served the same everywhere. The sauce can come in any number of ways, from spicy ketchup to garlic mayonnaise with a dusting of pimiento (smoked paprika), or both.One theory holds that the dirtier the bar, the better the bravas."Tapas originated in southern Spain and is an adaptation to the social culture of eating and drinking outside the home, and fulfills the same social function as the English public house and other similar institutions," explains Shawn Hennessey, who runs tapas tours of Seville."It's important to note that the tapeo (tapas crawl) is not primarily a 'drinking culture' thing -- it's oriented to friends and family with a communal atmosphere."Intoxication and rowdiness are rare. Key factors are the social sharing of food, and the opportunity to try a lot of different things in one meal. In short, tapas are a way of life.".`,
//           "email": "anushkaghorpade0921@gmail.com",
//           "ingredients": [
//             "Dipping Sauce",
//             "1 clove garlic, minced, or more to taste",
//             "½ teaspoon smoked paprika",
//             "1 pinch salt",
//             "1 cup mayonnaise",
//             "1 tablespoon sherry vinegar, or more to taste",
//             "1 teaspoon tomato paste",
//             "¼ teaspoon ground chipotle peppers",
//             "1 pinch cayenne pepper, or more to taste",
//             "Spice Blend",
//             "1 tablespoon salt",
//             "½ teaspoon ground black pepper",
//             "½ teaspoon paprika",
//             "½ teaspoon ground chipotle peppers",
//             "2 quarts cold water",
//             "1 tablespoon salt",
//             "1 teaspoon smoked paprika",
//             "1 teaspoon ground cumin",
//             "2 bay leaves",
//             "2 pounds russet potatoes, peeled and cut into 1-inch cubes",
//             "2 cups vegetable oil for frying",
//
//           ],
//           "category": "Spanish",
//           "image": "patatas-bravas.jpg"
//         }, {
//           "name": "Gazpacho",
//           "description": `This tomato-based Andalusian soup is most famous for being served cold. This can be quite a shock for those who aren't expecting it, but in the searing heat of a Seville summer, the attraction becomes clear.Its principal ingredients, aside from tomato, are peppers, garlic, bread and lots of olive oil.`,
//           "email": "anushkaghorpade0921@gmail.com",
//           "ingredients": [
//             "2 lb. tomatoes, quartered",
//             "2 Persian cucumbers, peeled and chopped",
//             "1/2 red bell pepper, chopped",
//             "1 clove garlic, roughly chopped",
//             "2 tbsp. red wine vinegar or sherry vinegar",
//             "1/2 c. water",
//             "1/3 c. extra-virgin olive oil, plus more for pan and garnish",
//             "Kosher salt",
//             "Freshly ground black pepper",
//             "2 slices country bread, cubed",
//             "2 tbsp. thinly sliced basil",
//           ],
//           "category": "Spanish",
//           "image": "gazpacho.jpg"
//         }, {
//           "name": "Pimientos de Padron",
//           "description": `A common dish on tapas menus, pimientos de Padron are green peppers that hail originally from the town of that name in Galicia, in Spain's lush, rainy northwest.Pimientos de Padron are fried and served with a deep sprinkling of salt. Though generally sweet and mild, their fame stems from the fact that the occasional pepper will be fiery hot -- lending a Russian Roulette element of surprise to eating them.`,
//           "email": "anushkaghorpade0921@gmail.com",
//           "ingredients": [
//             "20 Pimientos de Padron",
//             "2 Cloves of Garlic",
//             "1 Tablespoon of Extra Virgin Spanish Olive Oil",
//             "Sea Salt Flakes",
//           ],
//           "category": "Spanish",
//           "image": "pimientos-de-padron.jpg"
//         }, {
//           "name": "Fideuà",
//           "description": `Less well known to tourists, fideuà is a type of Spanish pasta similar to vermicelli. It's popular in Catalonia and Valencia in seafood dishes that rival paella for their taste and intricacy. Fideuà is typically cooked in a paella dish.`,
//           "email": "anushkaghorpade0921@gmail.com",
//           "ingredients": [
//             "400g mussels , cleaned",
//             "8 large prawns , in their shells",
//             "2 good pinches of saffron",
//             "350g vermicelli pasta, or Spanish fideo pasta if you can find it",
//             "5 tbsp olive oil",
//             "1 large onion , finely chopped",
//             "3 garlic cloves , crushed",
//             "2 tsp smoked paprika",
//             "1 monkfish tail, cut into 2-3cm chunks",
//             "1 large squid , or 4 baby squid (about 400g), cleaned and cut into rings (keep the tentacles)",
//             "650ml hot good-quality fish stock",
//             "2 large tomatoes , chopped into small pieces",
//             "juice 1 large lemon , plus 1 lemon cut into wedges to serve",
//             "small bunch parsley , chopped",
//           ],
//           "category": "Spanish",
//           "image": "fideuà.jpg"
//         },
//
//     ]);
//   } catch (error) {
//     console.log('err', +error)
//   }
// }
//       insertDummyRecipeData();
