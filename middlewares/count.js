const baseUrl = url => url.split('?')[0]
const queryParams = url => url.split('?')[1]
const isCountRequest = (req) =>
  queryParams(req.originalUrl).includes('mode=count')

module.exports = () =>
  (req, res) => {
    if (isCountRequest(req)){
      if (res.locals.data instanceof Array) {
        res.jsonp(res.getHeader('x-total-count').value())
      } else {
        res.status(400)
        res.end('Count unavailable on a non-array', 'utf-8')
      }
    } else {
      res.jsonp(res.locals.data)
    }
  }
