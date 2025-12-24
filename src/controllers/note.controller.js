const noteService = require("../services/note.service");
const { printError, printLog } = require("../utils/logger");
const { verifySchema } = require("./validators/validations");

// Create a new note
async function create(req, res) {
    const FUNCTION_NAME = "noteController.create";
    printLog("ENTER", FUNCTION_NAME, { body: req.body, userId: req.user.userId });

    try {
        const payload = req.body;
        const validation = verifySchema("CREATE_NOTE_SCHEMA", payload);
        if (!validation.success) {
            printLog("EXIT_VALIDATION_FAILED", FUNCTION_NAME, validation);
            return res.status(422).json({ success: false, ...validation });
        }

        const note = await noteService.createNote({
            userId: req.user.userId,
            title: payload.title,
            content: payload.content
        });

        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteId: note.id });
        return res.status(201).json({
            success: true,
            data: note,
            message: "Note created successfully"
        });
    } catch (error) {
        printError({ event: "Create note failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
    }
}

// Fetch all notes of a user
async function getAll(req, res) {
    const FUNCTION_NAME = "noteController.getAll";
    printLog("ENTER", FUNCTION_NAME, { userId: req.user.userId });

    try {
        const notes = await noteService.getAllNotes(req.user.userId);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteCount: notes.length });
        return res.status(200).json({ success: true, data: notes, message: "Records fetched successfully" });
    } catch (error) {
        printError({ event: "Fetch notes failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Fetch a single note by ID
async function getOne(req, res) {
    const FUNCTION_NAME = "noteController.getOne";
    printLog("ENTER", FUNCTION_NAME, { noteId: req.params.id, userId: req.user.userId });

    try {
        const note = await noteService.getNoteById(req.user.userId, req.params.id);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteId: note.id });
        return res.status(200).json({ success: true, data: note });
    } catch (error) {
        printError({ event: "Fetch note failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(404).json({ success: false, message: error.message });
    }
}

// Search notes by keyword
async function search(req, res) {
    const FUNCTION_NAME = "noteController.search";
    printLog("ENTER", FUNCTION_NAME, { query: req.query, userId: req.user.userId });

    try {
        const { q } = req.query;
        if (!q) {
            printLog("EXIT_VALIDATION_FAILED", FUNCTION_NAME);
            return res.status(422).json({ success: false, message: "Search keyword is required" });
        }

        const notes = await noteService.searchNotes(req.user.userId, q);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { resultCount: notes.length });
        return res.status(200).json({ success: true, data: notes, message: "Search results fetched successfully" });
    } catch (error) {
        printError({ event: "Search notes failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Update a note
async function update(req, res) {
    const FUNCTION_NAME = "noteController.update";
    printLog("ENTER", FUNCTION_NAME, { noteId: req.params.id, userId: req.user.userId, body: req.body });

    try {
        const payload = req.body;
        const validation = verifySchema("UPDATE_NOTE_SCHEMA", payload);
        if (!validation.success) {
            printLog("EXIT_VALIDATION_FAILED", FUNCTION_NAME, validation);
            return res.status(422).json({ success: false, ...validation });
        }

        const note = await noteService.updateNote(req.user.userId, req.params.id, payload.title, payload.content);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteId: note.id });
        return res.status(200).json({ success: true, data: note, message: "Note updated successfully" });
    } catch (error) {
        printError({ event: "Update note failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(409).json({ success: false, message: error.message });
    }
}

// Delete a note
async function remove(req, res) {
    const FUNCTION_NAME = "noteController.remove";
    const noteId = req.params.id;
    printLog("ENTER", FUNCTION_NAME, { noteId, userId: req.user.userId });

    try {
        await noteService.deleteNote(req.user.userId, noteId);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { noteId });
        return res.status(204).send();
    } catch (error) {
        printError({ event: "Delete note failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(404).json({ success: false, message: error.message });
    }
}

// Fetch all previous versions of a note
async function versions(req, res) {
    const FUNCTION_NAME = "noteController.versions";
    const noteId = req.params.id;
    printLog("ENTER", FUNCTION_NAME, { noteId, userId: req.user.userId });

    try {
        const history = await noteService.getNoteVersions(req.user.userId, noteId);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { versionCount: history.length });
        return res.status(200).json({ success: true, data: history });
    } catch (error) {
        printError({ event: "Fetch note versions failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(404).json({ success: false, message: error.message });
    }
}


module.exports = {
    create,
    getAll,
    getOne,
    search,
    update,
    remove,
    versions
};
