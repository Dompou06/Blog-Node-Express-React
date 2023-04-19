'use strict'
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const Sequelize = require('sequelize')
const process = require('process')

const basename = path.basename(__filename)
//https://www.bezkoder.com/node-js-express-sequelize-mysql/
let dbConfig = {
    HOST: '',
    USER: '',
    PASSWORD: '',
    DB: '',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
if(process.env.STATE === 'production') {
    dbConfig.HOST = process.env.DBHOST
    dbConfig.USER = process.env.DBUSER
    dbConfig.PASSWORD = process.env.DBPASSWORD
    dbConfig.DB = process.env.DB
} else {
    dbConfig.HOST = process.env.DBHOST_DEV
    dbConfig.USER = process.env.DBUSER_DEV
    dbConfig.PASSWORD = process.env.DBPASSWORD_DEV
    dbConfig.DB = process.env.DB_DEV
}
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}

fs
    .readdirSync(__dirname)
    .filter(file => {

        return (
            file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
        )
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.Sequelize = Sequelize
db.sequelize = sequelize


module.exports = db