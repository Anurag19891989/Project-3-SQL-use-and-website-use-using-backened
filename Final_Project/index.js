const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database:'delta_app',
        password:'Anurag@1989@',

  });
  let getRandomUser=()=> {
    return [
     faker.string.uuid(),
     faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),

    ];
  };

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// let data=[];
// for(let i=0;i<100;i++){
// data.push(getRandomUser());

// }



// connection.end();

app.get("/",(req,res)=>{
let q=`SELECT count(*) from user`;
try{
connection.query(q,(err,result)=>{
if(err){
    throw err;
}
let r=result[0]["count(*)"];
res.render("home.ejs",{r});
});}


catch(err){
console.log(err);
res.send("some error in database"); 
};


});



app.get("/user",(req,res)=>{
  let q="SELECT * FROM user";
  try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    }
 //console.log(result);
 res.render("showusers.ejs",{result});
    });}
    
    
    catch(err){
    console.log(err);
    res.send("some error in database"); 
    };
  
});

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT *from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    }
let user=result[0];
 res.render("edit.ejs",{user}); 
    });}
    
    
    catch(err){
    console.log(err);
    res.send("some error in database"); 
    };


});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formPass,username:newUsername}=req.body;
  let q=`SELECT *from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
    if(err){
        throw err;
    }
let user=result[0];
if(formPass!=user.password){
  res.send("WRONG PASSWORD");

}else{
let q2=`UPDATE user SET username ='${newUsername}' WHERE id='${id}'`; 
try{
  connection.query(q2,(err,result)=>{
  if(err){
      throw err;
  }

res.redirect("/user"); 
  });}
  
  
  catch(err){
  console.log(err);
  res.send("some error in database"); 
  };


}

    });}
    
    
    catch(err){
    console.log(err);
    res.send("some error in database"); 
    };

});
  



app.listen("8080",()=>{

console.log("Server is listening to port 8080");


})


