const express = require('express');
const router = express.Router();
const Donut = require('../models/donut');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];




// COBA MASUKIN ANTARA DI ROUTER OR SERVER
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')



const User = require('../models/user')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => User.findOne({email: email}),
  id => User.findOne({id: id})
)
// -----------------------------------------

// AAAAAAAAAAAAAAAAAAAAAAAAAAAA
router.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('./login.ejs')
})


router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/donuts/login',
  failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req,res) => {
  res.render('./register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req,res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const users = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    users.save()
    res.redirect('/donuts/login')
  } catch {
    res.redirect('/donuts/register')
  }
})

router.delete('/logout', (req,res) => {
  req.logOut()
  res.redirect('/donuts/login')
})
// ---------------------------------------








// All donuts Route
router.get('/', checkAuthenticated, async (req, res) => {
  let query = Donut.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }

  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore, 'i')
  }

  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter, 'i')
  }
  try {
    const donuts = await query.exec()
    res.render('donuts/index', {
      donuts: donuts,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})



// New donuts Route
router.get('/new', checkAuthenticated, async (req, res) => {
  renderNewPage(res, new Donut())

})


//Create donut Route
router.post('/', async (req, res) => {
    const donut = new Donut({
      title: req.body.title,
      // publishDate: new Date(req.body.publishDate),
      // pageCount: req.body.pageCount,
      description: req.body.description
    })
    saveCover(donut, req.body.cover)

    try {
      const newdonut = await donut.save()
      res.redirect(`donuts/${newdonut.id}`)

    } catch {
      renderNewPage(res, donut, true)
    }
  }
);


//SHOW donut ROUTE
router.get('/:id', checkAuthenticated, async (req, res) => {
  try {
    const donut = await Donut.findById(req.params.id)
    res.render('donuts/show', {
      donut: donut
    })
  } catch {
    res.redirect('/')
  }
})


//EDIT donut ROUTE
router.get('/:id/edit', checkAuthenticated, async (req, res) => {
  try {
    const donut = await Donut.findById(req.params.id)
    renderEditPage(res, donut)
  } catch {
    res.redirect('/')
  }
})


//Update donut Route
router.put('/:id/',
  async (req, res) => {
    let donut
    try {
      donut = await Donut.findById(req.params.id)
      donut.title = req.body.title
      // donut.publishDate = new Date(req.body.publishDate)
      // donut.pageCount = req.body.pageCount
      donut.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(donut, req.body.cover)
      }
      await donut.save()
      res.redirect(`/donuts/${donut.id}`)

    } catch {

      if (donut != null) {
        renderEditPage(res, donut, true)
      } else {
        redirect('/')
      }

    }
  });


//Route Delete donut
router.delete('/:id', async (req, res) => {
  let donut
  try {
    donut = await Donut.findById(req.params.id)
    await donut.remove()
    res.redirect('/donuts')
  } catch {
    if (donut != null) {
      res.render('donuts/show', {
        donut: donut,
        errorMessage: 'Could not remove donut'
      })
    } else {
      res.redirect('/')
    }

  }
})

function saveCover(donut, coverEncoded) {
  if(coverEncoded == null || coverEncoded.length < 1) return
  const cover = JSON.parse(coverEncoded)

  if (cover != null && imageMimeTypes.includes(cover.type)) {
    donut.coverImage = new Buffer.from(cover.data, 'base64')
    donut.coverImageType = cover.type
  }
}

async function renderNewPage(res, donut, hasError = false) {
  renderFormPage(res, donut, 'new', hasError)
}

async function renderEditPage(res, donut, hasError = false) {
  renderFormPage(res, donut, 'edit', hasError)
}

async function renderFormPage(res, donut, form, hasError = false) {
  try {
    const params = {
      donut: donut
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = "Error Updating donut"
      } else {
        params.errorMessage = "Error Creating donut"
      }
    }
    res.render(`donuts/${form}`, params)
  } catch {
    res.redirect('/donuts')
  }
}


// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
function checkAuthenticated(req,res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/donuts/login')
}

function checkNotAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/donuts/')
  }
  next ()
}


// ---------------------------------------------



module.exports = router
