const sequelize = require("../config/database");

const User = require("./User");
const Note = require("./Note");
const NoteVersion = require("./NoteVersion");
const NoteShare = require("./NoteShare")

// Associations
User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

Note.hasMany(NoteVersion, { foreignKey: "noteId" });
NoteVersion.belongsTo(Note, { foreignKey: "noteId" });

Note.hasMany(NoteShare, { foreignKey: "noteId" });
NoteShare.belongsTo(Note, { foreignKey: "noteId" });

module.exports = {
  sequelize,
  User,
  Note,
  NoteShare,
  NoteVersion
};
