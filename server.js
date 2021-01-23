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

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
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
    //if(isValid(req.body.username) && isValid(req.body.password)){
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
   /* }
      else{
        res.render('register.ejs', { message: 'No special characters.'})
      }*/
  } catch(err) {
    console.log('an error occured: ' + err)
    res.render('register.ejs', { message: 'An Error Occured'})
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
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

app.listen(3000)
