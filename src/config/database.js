const { Sequelize } = require("sequelize");

let sequelize;

function getSequelizeInstance() {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false
      }
    );
  }
  return sequelize;
}

module.exports = getSequelizeInstance();
