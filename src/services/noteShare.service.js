const { Note, NoteShare, User, sequelize } = require("../models");
const { printLog, printError } = require("../utils/logger");
const { getCache, setCache, deleteCache } = require("../utils/cache");

/**
 * Share a note with another user
 */
async function shareNote(payload) {
    const FUNCTION_NAME = "noteService.shareNote";
    printLog("ENTER", FUNCTION_NAME, payload);

    const { userId, noteId, sharedWithUserId, permission = "read" } = payload;
    const transaction = await sequelize.transaction();

    try {
        // Check target user exists
        const userExists = await User.findOne({ where: { id: sharedWithUserId }, transaction });
        if (!userExists) throw new Error("Target user does not exist");

        // Check note exists and belongs to owner
        const note = await Note.findOne({ where: { id: noteId, userId }, transaction });
        if (!note) throw new Error("Note not found or access denied");

        // Check if already shared
        const existingShare = await NoteShare.findOne({ where: { noteId, sharedWithUserId }, transaction });

        if (existingShare) {
            existingShare.permission = permission;
            await existingShare.save({ transaction });
        } else {
            await NoteShare.create({ noteId, sharedWithUserId, permission }, { transaction });
        }

        await transaction.commit();

        // Invalidate caches
        await deleteCache(`notes:user:${sharedWithUserId}`);
        await deleteCache(`note:${noteId}`);

        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteId, sharedWithUserId, permission });
        return { noteId, sharedWithUserId, permission };

    } catch (error) {
        await transaction.rollback();
        printError({ event: "Share note failed", functionName: FUNCTION_NAME, error });
        throw error;
    }
}

/**
 * Get notes shared with a user (cached)
 */
async function getSharedNotes(userId) {
    const FUNCTION_NAME = "noteService.getSharedNotes";
    const cacheKey = `notes:shared:${userId}`;
    printLog("ENTER", FUNCTION_NAME, { userId });

    try {
        const cached = await getCache(cacheKey);
        if (cached) {
            printLog("EXIT_SUCCESS_CACHE", FUNCTION_NAME, { count: cached.length });
            return cached;
        }

        const shares = await NoteShare.findAll({
            where: { sharedWithUserId: userId },
            include: [{ model: Note, where: { deletedAt: null }, required: true }]
        });

        const result = shares.map(s => {
            const note = s.Note.toJSON(); // convert Sequelize instance to plain object
            note.permission = s.permission;
            return note;
        });

        await setCache(cacheKey, result, 60);
        printLog("EXIT_SUCCESS_DB", FUNCTION_NAME, { count: result.length });
        return result;

    } catch (error) {
        printError({ event: "Fetch shared notes failed", functionName: FUNCTION_NAME, error });
        throw error;
    }
}


module.exports = {
    shareNote,
    getSharedNotes
};
