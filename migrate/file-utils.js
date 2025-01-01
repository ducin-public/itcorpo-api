const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const dbPath = path.join(__dirname, '../', 'db.json');

function readDatabaseFile(filePath) {
    try {
        logger.info(`Reading database from ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        logger.info(`Database contains following keys: ${Object.keys(data).map(name => `\n- ${name}`).join('')}`);
        return data;
    } catch (error) {
        logger.error('Failed to read database:', error.message);
        throw error;
    }
}

function writeDatabaseFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.success('Database write completed successfully');
    } catch (error) {
        logger.error('Failed to write database:', error.message);
        throw error;
    }
}

module.exports = {
    dbPath,
    readDatabaseFile,
    writeDatabaseFile
};
