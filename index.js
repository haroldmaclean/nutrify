// const express = require('express')
// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const cors = require('cors')

// // importing models
// const userModel = require('./models/userModel')
// const foodModel = require('./models/foodModel')
// const trackingModel = require('./models/trackingModel')
// const verifyToken = require('./verifyToken')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

// importing models
const userModel = require('./models/userModel')
const foodModel = require('./models/foodModel')
const trackingModel = require('./models/trackingModel')
const verifyToken = require('./verifyToken')

// database connection
mongoose
  .connect('mongodb://localhost:27017/nutrify')
  .then(() => {
    console.log('Database connection successful') // ⭐️ FIX: COMMENTED OUT! The update script has run and should not run again. // updateFoodImages()
  })
  .catch((err) => {
    console.log('err')
  })

// =======================================================
// ONE-TIME SCRIPT TO UPDATE EXISTING FOOD RECORDS (LOGIC KEPT BUT NOT CALLED)
// =======================================================

async function updateFoodImages() {
  try {
    console.log('Starting concurrent image update...')

    const foodUpdates = [
      // Replace these URLs with actual links or keep them as placeholders for now
      {
        name: 'Apple',
        imageUrl:
          'https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg',
      },
      {
        name: 'Banana',
        imageUrl:
          'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
      },
      {
        name: 'Chicken Breast',
        imageUrl:
          'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      }, // Assuming this food exists
      {
        name: 'Broccoli',
        imageUrl:
          'https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg',
      },
      {
        name: 'Almonds',
        imageUrl:
          'https://images.pexels.com/photos/86649/pexels-photo-86649.jpeg',
      },
      {
        name: 'Salmon',
        imageUrl:
          'https://images.pexels.com/photos/29748127/pexels-photo-29748127.jpeg',
      },
      {
        name: 'Oats',
        imageUrl:
          'https://images.pexels.com/photos/4725726/pexels-photo-4725726.jpeg',
      },
      {
        name: 'Egg',
        imageUrl:
          'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
      },
      {
        name: 'Spinach',
        imageUrl:
          'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg',
      },
      {
        name: 'Sweet Potato',
        imageUrl:
          'https://images.pexels.com/photos/3233282/pexels-photo-3233282.jpeg',
      },
    ] // Create an array of update promises to run concurrently

    const updatePromises = foodUpdates.map((food) => {
      return foodModel.updateOne(
        { name: food.name },
        { $set: { imageUrl: food.imageUrl } }
      )
    }) // Execute all promises

    await Promise.all(updatePromises)

    console.log('Food images updated successfully using Promise.all!')
  } catch (error) {
    // Log the error if the update fails, but let the server continue running otherwise
    console.error('Error updating food images:', error)
  }
}

const app = express()
app.use(express.json())
app.use(cors())

//endpoint for register user

app.post('/register', (req, res) => {
  let user = req.body

  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (!err) {
          user.password = hpass
          try {
            let doc = await userModel.create(user)
            res.status(201).send({ message: 'User Registered' })
          } catch (err) {
            console.log(err)
            res.status(500).send({ message: 'Some Problem' })
          }
        }
      })
    }
  })
})

//endpoint for login

app.post('/login', async (req, res) => {
  let userCred = req.body

  try {
    const user = await userModel.findOne({ email: userCred.email })
    if (user !== null) {
      bcrypt.compare(userCred.password, user.password, (err, success) => {
        if (success == true) {
          jwt.sign({ email: userCred.emal }, 'nutrifyapp', (err, token) => {
            if (!err) {
              res.send({
                message: 'Login Successful',
                token: token,
                userid: user._id, // Added user ID
                name: user.name, // Added user name
              })
            }
          })
        } else {
          res.status(403).send({ message: 'Incorrect password ' })
        }
      })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Some Problem' })
  }
})

// endpoint to fetch all foods

app.get('/foods', verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find()

    res.send(foods)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Some Problem while getting info' })
  }
})

// endpoint to search food by name

app.get('/foods/:name', verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find({
      name: { $regex: req.params.name, $options: 'i' },
    })
    if (foods.length !== 0) {
      res.send(foods)
    } else {
      res.status(404).send({ message: 'Food Item Not Fund' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Some Problem while getting food' })
  }
})

//endpoint to track a food

app.post('/track', verifyToken, async (req, res) => {
  let trackData = req.body

  try {
    let data = await trackingModel.create(trackData)
    res.status(201).send({ message: 'Food added' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Some Problem while tracking food' })
  }
})

//endpoint to fetch all foods eaten by a person

app.get('/track/:userid/:date', verifyToken, async (req, res) => {
  let userid = req.params.userid
  let date = new Date(req.params.date)
  let strDate =
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

  try {
    let foods = await trackingModel
      .find({ userId: userid, eatenDate: strDate })
      .populate('userId')
      .populate('foodId')
    res.send(foods)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Some Problem while getting info' })
  }
})

app.listen(8000, () => {
  console.log('Server is up and running')
})
