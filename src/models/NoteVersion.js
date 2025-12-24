const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NoteVersion = sequelize.define(
  "NoteVersion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    noteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "note_versions",
    timestamps: true,
    updatedAt: false
  }
);

module.exports = NoteVersion;
