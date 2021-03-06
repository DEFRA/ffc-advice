const express = require('express')
const { get } = require('browser-sync')
const router = express.Router()
const fs = require('fs')



var folder = "v1-3/_find-adviser/v4"
var versionServiceName = "Check protected food and drink names"
router.use(function (req, res, next) {
  // store in locals this can then be used in pages as {{folder}} etc
  res.locals.folder=folder
  res.locals.versionServiceName=versionServiceName
  next()
})


var searchColumn = 'DEF_SearchTextAll'



router.get('/landing-guide-page/:type', function(req, res) {
    if (req.params.type == "nodejs"){
      res.render(folder + '/landing-guide-page', { linkAction: "search-results_nodejs" })
    } else if (req.params.type == "default"){
      res.render(folder + '/landing-guide-page', { linkAction: "search-results_spec_pub-default" })
    } else if (req.params.type == "tbl"){
      res.render(folder + '/landing-guide-page', { linkAction: "search-results_spec_pub-tbl" })
    } else if (req.params.type == "tbl-simple"){
      res.render(folder + '/landing-guide-page', { linkAction: "search-results_spec_pub-tbl-simple" })
    } else if (req.params.type == "lst"){
        res.render(folder + '/landing-guide-page', { linkAction: "search-results_spec_pub-lst" })
    } else {
    res.render(folder + '/landing-guide-page', { linkAction: "search-results_spec_pub-lst" })
  }
})



// Routes

// Search
// Variant nodejs
router.get('/search_nodejs', function(req, res) {
    res.render(folder + '/search_nodejs', { formAction: "search-results_nodejs" })
})

// Results
// Variant nodejs
router.get('/search-results_nodejs', function(req, res) {
    res.render(folder + '/search-results_nodejs', { results: filterRegister(req.query.name, req.query.registers, req.query.statuses, req.query.country, req.query.category), url: req.url })
})



// Variant Specialist publisher
router.get('/search-results_spec_pub-default', function(req, res) {
    res.render(folder + '/search-results_spec_pub-default', { results: filterRegister(req.query.name, req.query.registers, req.query.statuses, req.query.country, req.query.category), url: req.url  })
})

router.get('/search-results_spec_pub-tbl', function(req, res) {
    res.render(folder + '/search-results_spec_pub-tbl', { results: filterRegister(req.query.name, req.query.registers, req.query.statuses, req.query.country, req.query.category), url: req.url  })
})

router.get('/search-results_spec_pub-tbl-simple', function(req, res) {
    res.render(folder + '/search-results_spec_pub-tbl-simple', { results: filterRegister(req.query.name, req.query.registers, req.query.statuses, req.query.country, req.query.category), url: req.url  })
})

router.get('/search-results_spec_pub-lst', function(req, res) {
    res.render(folder + '/search-results_spec_pub-lst', { results: filterRegister(req.query.name, req.query.registers, req.query.statuses, req.query.country, req.query.category), url: req.url  })
})


// Others
router.get('/product-details/:giNumber', function(req, res) {
    res.render(folder + '/product-details', findGi(req.params.giNumber))
})

router.get('/product-details-default/:giNumber', function(req, res) {
    res.render(folder + '/product-details-default', findGi(req.params.giNumber))
})



// Functions
function findGi(giNumber) {
    return getRegisterData('register').find(element => element.EA_FileNumber === giNumber)
}

function filterRegister(name, registers, statuses, country, category) {
    name = name.toLowerCase()

    let registerData = getRegisterData('register')

    if (name) {
        registerData = registerData.filter(element => element[searchColumn].includes(name))
    }

    if (registers != '_unchecked') {
        registerData = registerData.filter(element => registers.includes(element.DEF_Register))
    }

    if (statuses != '_unchecked') {
        registerData = registerData.filter(element => statuses.includes(element.EA_Status))
    }

    if (country) {
        registerData = registerData.filter(element => element.EA_Country === country)
    }

    if (category) {
        registerData = registerData.filter(element => element.EA_ProductCategory === category)
    }

    return registerData
}

function getRegisterData(registerName) {
    return require('./views/' + folder + '/data/registers/register.json')
}

module.exports = router
