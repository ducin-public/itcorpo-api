const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, '../contract/swagger.yml'));

router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument));

module.exports = router;
