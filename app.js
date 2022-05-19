//step1 creating file app.js and add dependencies
const express=require('express');
const expressLayouts=require('express-ejs-layouts');//very useful when we create templates for our website creates different layouts for different scenarios
const path = require('path');
const fileUpload=require('express-fileupload');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');


const app=express();  //initialize a new express application
const port= process.env.PORT || 3000;  //port number


require('dotenv').config();//storing all database details
app.use(express.urlencoded({extended:true}));//allows to pass encoded bodies
app.use(express.static('public'));//set up a static folder, no need to list the whole folder for images etc.
app.use(expressLayouts);//for expressLayouts

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret:'CookingBlogSecretSession',
  saveUninitialized:true,
  resave:true
}));

app.use(flash());
app.use(fileUpload());


app.set('layout','./layouts/main');//for the layout we have to set a main folder all layouts are stored here and main layout is called main
app.set('view engine','ejs');
const routes=require('./server/routes/recipeRoutes.js')//create some route
app.use('/',routes);//use routes
app.listen(port,()=> console.log('Listening to port ${port}'));//all app is listening on port number ()=> this is narrow function
//step2 create a folder public and create folders css,img,js,uploads inside public folder
//step3 create a server folder and inside this create a controllers folder in which we are going to do all the queries and control the functionalities of every single page
//step4 create a folder models inside server folder and these are going to be the way we structure our database
//step5 create routes folder in server folder
//step6 crfeate a views folder here we stores all html, ejs files
//step7 create a folder called layouts in views folder and inside that create main.ejs which is the main layout
 //step8 just to test create a recipeRoutes.js inside routes
