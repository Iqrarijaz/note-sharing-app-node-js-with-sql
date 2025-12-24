require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error("DB Sync Error:", err));
});
