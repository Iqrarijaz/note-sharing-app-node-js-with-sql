const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NoteShare = sequelize.define(
    "NoteShare",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        noteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sharedWithUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permission: {
            type: DataTypes.ENUM("read", "edit"),
            allowNull: false,
            defaultValue: "read",
        },
    },
    {
        tableName: "note_shares",
        timestamps: true,
    }
);

module.exports = NoteShare;
