const dotenv = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const stripe = require('stripe')(process.env.SECRET_KEY)


const app = express()


app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())



app.get('/', (req, res) => {
  res.json('poop')
})

app.post('/charge', (req, res) => {
  const token = req.body.stripeToken
  charge(
    req.body.amount * 100,
    req.body.service,
    req.body.stripeToken
  )
  .then(charge => {
    res.render('../client/success.html')
  })
  .catch(error => {
    console.log(error)
  })
})

function charge(amount, service, token){
  return new Promise((resolve, reject) => {
      stripe.charges.create({
          amount,
          currency: "usd",
          description: service,
          source: token
      }, (error, charge) => {
          if (error){
              reject(error)
          } else {
              resolve(charge)
          }
      })
  })
}

app.use((err, req, res, next) => {
  res.status(404)
  const error = new Error('Not Found. 🔍')
  next(error)
})

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500)
  res.json({
    message: err.message,
    error: err.stack
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
