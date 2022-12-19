const port = process.env.PORT || 5500
App = require('./src/entry');

App.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
