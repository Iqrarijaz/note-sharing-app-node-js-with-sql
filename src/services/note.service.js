const { Note, NoteVersion, sequelize, NoteShare, User } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { printLog, printError } = require("../utils/logger");
const { getCache, setCache, deleteCache } = require("../utils/cache");

/**
 * Create a new note and its initial version
 */
async function createNote(payload) {
    const FUNCTION_NAME = "noteService.createNote";
    const transaction = await sequelize.transaction();

    try {
        printLog("Creating note", FUNCTION_NAME, payload);

        // Create the note
        const note = await Note.create(payload, { transaction });

        // Save initial version within the same transaction
        await NoteVersion.create(
            {
                noteId: note.id,
                title: payload.title,
                content: payload.content,
                version: note.version
            },
            { transaction }
        );

        // Commit transaction after both succeed
        await transaction.commit();

        // Invalidate user's notes cache
        await deleteCache(`notes:user:${payload.userId}`);

        return note;
    } catch (error) {
        // Rollback if anything fails
        await transaction.rollback();

        printError({
            event: "Create note failed",
            functionName: FUNCTION_NAME,
            payload,
            error
        });
        throw error;
    }
}


/**
 * Get all notes of a user (cached)
 */
async function getAllNotes(userId) {
    const FUNCTION_NAME = "noteService.getAllNotes";
    const cacheKey = `notes:user:${userId}`;

    try {
        const cached = await getCache(cacheKey);
        if (cached) return cached;

        const notes = await Note.findAll({
            where: { userId },
            order: [["updatedAt", "DESC"]]
        });

        await setCache(cacheKey, notes);
        return notes;
    } catch (error) {
        printError({
            event: "Fetch all notes failed",
            functionName: FUNCTION_NAME,
            userId,
            error
        });
        throw error;
    }
}

/**
 * Get a single note by ID (cached)
 */
async function getNoteById(userId, noteId) {
    const FUNCTION_NAME = "noteService.getNoteById";
    const cacheKey = `note:${noteId}`;

    try {
        const cached = await getCache(cacheKey);
        if (cached) return cached;

        const note = await Note.findOne({
            where: { id: noteId, userId }
        });

        if (!note) throw new Error("Note not found");

        await setCache(cacheKey, note);
        return note;
    } catch (error) {
        printError({
            event: "Fetch note failed",
            functionName: FUNCTION_NAME,
            userId,
            noteId,
            error
        });
        throw error;
    }
}

/**
 * Full-text search notes (cached with short TTL)
 */
async function searchNotes(userId, keyword) {
    const FUNCTION_NAME = "noteService.searchNotes";
    const cacheKey = `notes:search:${userId}:${keyword}`;

    try {
        const cached = await getCache(cacheKey);
        if (cached) return cached;

        const notes = await Note.findAll({
            where: {
                userId,
                deletedAt: null,
                [Op.and]: Sequelize.literal(
                    `MATCH (title, content) AGAINST (${sequelize.escape(keyword)} IN NATURAL LANGUAGE MODE)`
                )
            },
            order: [["updatedAt", "DESC"]]
        });

        // Short TTL to minimize stale results
        await setCache(cacheKey, notes, 60);

        return notes;
    } catch (error) {
        printError({
            event: "Search notes failed",
            functionName: FUNCTION_NAME,
            userId,
            keyword,
            error
        });
        throw error;
    }
}

/**
 * Update note with optimistic locking + version history
 */
async function updateNote(userId, noteId, title, content) {
    const FUNCTION_NAME = "noteService.updateNote";
    const transaction = await sequelize.transaction();

    try {
        const note = await Note.findOne({
            where: { id: noteId, userId },
            transaction
        });

        if (!note) throw new Error("Note not found");

        await NoteVersion.create(
            {
                noteId: note.id,
                title: note.title,
                content: note.content,
                version: note.version
            },
            { transaction }
        );

        note.title = title;
        note.content = content;

        await note.save({ transaction });
        await transaction.commit();

        await deleteCache(`note:${noteId}`);
        await deleteCache(`notes:user:${userId}`);

        return note;
    } catch (error) {
        await transaction.rollback();

        if (error.name === "SequelizeOptimisticLockError") {
            throw new Error("Note was updated by another user");
        }

        printError({
            event: "Update note failed",
            functionName: FUNCTION_NAME,
            userId,
            noteId,
            error
        });
        throw error;
    }
}

/**
 * Soft delete note
 */
async function deleteNote(userId, noteId) {
    const FUNCTION_NAME = "noteService.deleteNote";

    try {
        const note = await Note.findOne({
            where: { id: noteId, userId }
        });

        if (!note) throw new Error("Note not found");

        await note.destroy();

        await deleteCache(`note:${noteId}`);
        await deleteCache(`notes:user:${userId}`);
    } catch (error) {
        printError({
            event: "Delete note failed",
            functionName: FUNCTION_NAME,
            userId,
            noteId,
            error
        });
        throw error;
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    searchNotes,
    updateNote,
    deleteNote,
};
