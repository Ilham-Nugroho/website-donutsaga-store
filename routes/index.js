const express = require('express');
const router = express.Router();
const Donut = require ('../models/donut')

router.get('/', async (req,res) => {
  let donuts = []
  try {
    donuts = await Donut.find()
    // .sort({ createAt: 'desc'}).limit(10).exec()
  }catch {
    donuts = []
  }
  res.render('index', {donuts: donuts})
})

module.exports = router
