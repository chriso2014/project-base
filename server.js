const express = require('express')
  , logger = require('morgan')
  , app = express()
  , pug = require('pug')
  , template = pug.compileFile(`${__dirname}/src/templates/homepage.pug`)
  , favicon = require(`${__dirname}/src/scripts/components/config/favicon.json`)
  , config = require(`${__dirname}/config`)
  , pkg = require(`${__dirname}/package.json`)
  , openurl = require('openurl')

app.use(logger('dev'))
app.use(express.static(`${__dirname}/public`))

app.get('/', (req, res, next) => {
  try {
    const html = template({ title: pkg.name, description: pkg.description, favicon: favicon})
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  const setPort = process.env.PORT || 3000;
  openurl.open(`http://localhost:${setPort}`);
  console.log(`'Listening on http://localhost:'${setPort}`);
})
