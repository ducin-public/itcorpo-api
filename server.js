const jsonServer = require('json-server')

const app = jsonServer.create()
const jsonServerMiddlewares = jsonServer.defaults()

const router = jsonServer.router('db.json')
const countMiddleware = require('./mw/count')
router.render = countMiddleware()

const db = router.db

const { argv } = require('./lib/cli')
const { logInfo } = require('./lib/util')

const authMiddleware = require('./mw/auth')
const tenantMiddleware = require('./mw/tenant')
const pagingMiddleware = require('./mw/paging')
const delayingMiddleware = require('./mw/delaying')
const failingMiddleware = require('./mw/failing')
const errorMiddleware = require('./mw/error')
const employeeNameMiddleware = require('./mw/employee_name')

app.use(jsonServer.rewriter(require('./routes.json')))
app.use(jsonServerMiddlewares)

app.use(authMiddleware(argv.jwtAuth))
app.use(delayingMiddleware(argv.delay))
app.use(tenantMiddleware(argv.tenantRequired))
app.use(pagingMiddleware(50, { excludePatterns: ['/log'] }))
app.use(failingMiddleware(argv.fail, argv.failUrls))
app.use(employeeNameMiddleware(db))

const additionalResources = require('./resources')
app.use(additionalResources)
app.use(router)
app.use(errorMiddleware())

app.listen(argv.port, () => {
  logInfo(() => `JSON Server is running on http://localhost:${argv.p}`)
})
