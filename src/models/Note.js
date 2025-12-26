const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false // owner
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true // last editor
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
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: "notes",
    timestamps: true,
    paranoid: true,
    version: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["updatedBy"] },
      { fields: ["updatedAt"] },
      {
        type: "FULLTEXT",
        name: "ft_notes_title_content",
        fields: ["title", "content"]
      }
    ]
  }
);


module.exports = Note;
