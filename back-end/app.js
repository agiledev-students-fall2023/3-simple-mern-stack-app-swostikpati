require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle sending JSON for the About us section
app.get('/about', (req, res) => {
  // send back some JSON
  res.json({
    name: 'Swostik Pati',
    imageUrl: 'https://avatars.githubusercontent.com/u/67205637?s=96&v=4',
    description: "Hey there! I'm Swostik Pati, currently soaking up knowledge and experiences at New York University.While I'm majoring in Computer Science & Interactive Media and dabbling a bit in Economics & Design, what I truly love is the journey of learning and meeting incredible folks along the way. At NYU, I've had the chance to help fellow students as a Teaching Assistant, and it's been such a rewarding experience to see those 'aha!' moments. I've also spent some time exploring the fascinating world of research, trying to understand muscle functionality and even dipping my toes into the vast universe of Metaverse. \nOn the side, I've enjoyed collaborating on some tech projects and have also been fortunate enough to work with some wonderful teams at places like Ámaxa and Quizzio. Organizing events at HackAD has been a fun ride, bringing together passionate individuals and seeing ideas come to life. Outside the tech bubble, I find joy in video editing, designing logos, and strumming a tune on my guitar. Life's been a mix of challenges and celebrations, and I'm excited about the road ahead!"
  })
})

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})



// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
