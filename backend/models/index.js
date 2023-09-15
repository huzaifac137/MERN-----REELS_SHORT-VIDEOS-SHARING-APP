const SequelizeObj  = require("sequelize");
const  dbConfig = require("../config/db.config.js");

const sequelize = new SequelizeObj(dbConfig.database , dbConfig.username , dbConfig.password , {
    host : dbConfig.host ,
    dialect : dbConfig.dialect ,
    pool : {
        max : dbConfig.pool.max ,
        min : dbConfig.pool.min ,
        acquire : dbConfig.pool.acquire
    }
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = SequelizeObj;
db.USER = require("./user.model.js")(sequelize , SequelizeObj);
db.VIDEO = require("./video.model.js")(sequelize , SequelizeObj);

db.USER.hasMany(db.VIDEO , {as :"videos"});
db.VIDEO.belongsTo(db.USER , { as :"creator" , foreignKey :"userId"});



module.exports =db;