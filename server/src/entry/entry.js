const Express = require('express')
const dotenv = require('dotenv')
const AppRouter = require('../routes/index')
const Cors = require('cors')
const App = Express()

dotenv.config()
App.use(Express.json())
App.use(Cors())

App.use('/picter/api/', AppRouter)

// if (process.env.NODE_ENV === 'production') {
//   App.use(Express.static(path.join(__dirname, '../../../client/dist')))
//   App.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../../client/dist/index.html'))
//   })
// }

module.exports = App;