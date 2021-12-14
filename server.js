if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const sendUser = require('./sendUser'); 
const getUsers = require('./getUsers')
const addSpot = require('./addSpot');
const getSpots = require('./getSpots');

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

//CRUD FUNCTIONS
async function pushUsers(){
const tempUser = await getUsers();
users.splice(0, users.length);
tempUser.forEach(user => users.push(user));
//console.log(users);
}

pushUsers();

const grabbedSpots = []

async function retrieveSpots(username){
const tempSpots = await getSpots(username);
grabbedSpots.splice(0, grabbedSpots.length);
tempSpots.forEach(spot => grabbedSpots.push(spot));
}

async function addUser(id, name, email, password){
  await sendUser(id, name, email, password);
    const tempUser = await getUsers();
    users.splice(0, users.length)
  tempUser.forEach(user => users.push(user));  
  console.log(users);
}
// prevents repeat email from being added
function doesEmailExist(email){
let check = false;
users.forEach(user => {
console.log(user.email);
if (user.email === email){
    check = true;
}
})
    return check;
}
function isEmail(email){
let hasCharacters = false;
let hasBadChars = false;
const badChars = ['[',']', '=', '^', '$', '?', '!', '\\', '"', "'", ';',
 ':', '(', ')', '/', '*', '|', '#', '%', '>', '<', ',', ' ']
for(let i = 0; i < badChars.length; i++){
 if(email.includes(badChars[i]) || email.length < 1){
   hasBadChars = true;
   break;
 }
}
  if(hasBadChars){
   return false;
  }
if(!email.includes('@') && !email.includes('.')){
  return false;
} else {
  hasCharacters = true;
}
if (email.length > 7 && hasCharacters){
 return true;
}
return false;
}

function isValid(string){
  if (string.length > 20 || string.length < 1){
   return false;
  }
    const badChars =['[',']', '=', ' ', '^', '$', '?', '!', '\\', '"', "'",
 ':', '(', ')', '/', '*', '|', '#', '%', '>', '<', ','];
  let hasBadChars = false;
  for (let i = 0; i < badChars.length; i++){
   if (string.includes(badChars[i])){
     hasBadChars = true;
     break;
   }
  }
    return !hasBadChars;
}
//test function 
/*
async function getUsers2(){
await pushUsers();
console.log(doesEmailExist('bob@bob.com'));
}
getUsers2();*/
/* add fictional spot to database
async function testAdd(){
	const trash = await addSpot('bob', 'some place', 89.99876, 89.77654);
	const itworked = await getSpots();
	console.log(itworked);
} 
testAdd();
*/
//end test function
app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, async (req, res) => {
  res.render('index.ejs', { name: req.user.name, spots: grabbedSpots, users: users })
	
})

app.get('/profile', checkAuthenticated, (req, res) =>{
  res.render('profile.ejs', {name: req.user.name, profilePic: '/clearbackgroundlogo.png'})
}) 

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', { message: ''})
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    if(isValid(req.body.name) && isValid(req.body.password)){
     if(!doesEmailExist(req.body.email) && isEmail(req.body.email)){
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      await addUser(Date.now().toString(),req.body.name, req.body.email, hashedPassword);
      res.redirect('/login')
     }else if(doesEmailExist(req.body.email)){
      res.render('register.ejs', { message: 'Email in use'})
    }
      else{
        res.render('register.ejs', { message: 'Please enter a valid email'})
      }
    }
      else{
        res.render('register.ejs', { message: 'No special characters.'})
      }
  } catch(err) {
    console.log('an error occured: ' + err)
    res.render('register.ejs', { message: 'An Error Occured'})
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.post("/addSpot", checkAuthenticated, async (req, res) =>{
	try{
	let coordinates = JSON.parse(req.body.lngLat);
	const locationTrash = await addSpot(req.user.name, req.body.spotName, coordinates.lng, coordinates.lat);
		let spotTrash = await retrieveSpots(req.user.name);
	res.render('index.ejs', {name: req.user.name, spots: grabbedSpots});
	}catch(err){
	console.log(`an error occcured: ${err}`);
	res.render('index.ejs', {name: req.user.name});
	}
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
