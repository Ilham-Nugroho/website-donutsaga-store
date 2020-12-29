const express = require('express');
const router = express.Router();
const donut = require ('../models/donut')

router.get('/', async (req,res) => {
  let donuts = []
  try {
    donuts = await donut.find().sort({ createAt: 'desc'}).limit(10).exec()
  }catch {
    donuts = []
  }
  res.render('index', {donuts: donuts})
})

module.exports = router
