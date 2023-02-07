const matchUnicase = (phrase, data) =>
  {
    console.log(data.toLocaleUpperCase())
    console.log(phrase.toLocaleUpperCase())
    console.log(data.toLocaleUpperCase().includes(phrase.toLocaleUpperCase()))
    return data.toLocaleUpperCase().includes(phrase.toLocaleUpperCase())
  }

const getEmployees = (phrase, employees) =>
  employees.filter(e => matchUnicase(phrase, e.firstName) || matchUnicase(phrase, e.lastName))

module.exports = (db) => {
  return function employeesByName(req, res, next) {
    if (req.path == "/employees" && req.query['name_like']){
      const name = req.query['name_like']
      const result = getEmployees(name, db.getState().employees)
      res.status(200)
      res.send(result)
    } else {
      next()
    }
  }
}
