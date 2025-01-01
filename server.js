const jsonServer = require('json-server')
// const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const countMiddleware = require('./middlewares/count')
const logsMiddleware = require('./middlewares/logs')
const authMiddleware = require('./middlewares/auth')
const tenantMiddleware = require('./middlewares/tenant')
const pagingMiddleware = require('./middlewares/paging')
const delayingMiddleware = require('./middlewares/delaying')
const failingMiddleware = require('./middlewares/failing')
const errorMiddleware = require('./middlewares/error')
const employeeNameMiddleware = require('./middlewares/employee_name')
const swaggerRouter = require('./middlewares/swagger')

const app = jsonServer.create()
const jsonServerMiddlewares = jsonServer.defaults()
const jsonParser = bodyParser.json()

const router = jsonServer.router('db.json')
router.render = countMiddleware()
const db = router.db

const { argv } = require('./lib/cli')
const { logInfo } = require('./lib/util')

app.use(cors())
app.use(jsonParser, logsMiddleware)
app.use(jsonServer.rewriter(require('./routes.json')))
app.use(jsonServerMiddlewares)

app.use(authMiddleware(argv.jwtAuth))
app.use(delayingMiddleware(() => 500 + Math.random() * argv.delay))
app.use(tenantMiddleware(argv.tenantRequired))
app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }))
app.use(failingMiddleware(argv.fail, argv.failUrls))
app.use(employeeNameMiddleware(db))

const additionalResources = require('./resources')
app.use('/banking', require('./middlewares/banking'))
app.use(swaggerRouter)
app.use(additionalResources)
app.use(router)
app.use(errorMiddleware())

app.listen(argv.port, () => {
  logInfo(`JSON Server is running on http://localhost:${argv.p}`)
})
