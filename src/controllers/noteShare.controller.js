const noteService = require("../services/noteShare.service");
const { printError, printLog } = require("../utils/logger");
const { verifySchema } = require("./validators/validations");

// Share a note with another user
async function share(req, res) {
    const FUNCTION_NAME = "noteController.share";
    printLog("ENTER", FUNCTION_NAME, { body: req.body, userId: req.user.userId });

    try {
        const payload = req.body;

        // Validate input
        const validation = verifySchema("SHARE_NOTE_SCHEMA", payload);
        if (!validation.success) {
            printLog("EXIT_VALIDATION_FAILED", FUNCTION_NAME, validation);
            return res.status(422).json(validation);
        }

        const result = await noteService.shareNote({
            userId: req.user.userId,
            noteId: payload.noteId,
            sharedWithUserId: payload.sharedWithId,
            permission: payload.permission,
        });

        printLog("EXIT_SUCCESS", FUNCTION_NAME, result);
        return res.status(200).json({ success: true, data: result, message: "Note shared successfully" });

    } catch (error) {
        printError({ event: "Share note failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(400).json({ success: false, message: error.message });
    }
}

// Get notes shared with the logged-in user
async function sharedNotes(req, res) {
    const FUNCTION_NAME = "noteController.sharedNotes";
    printLog("ENTER", FUNCTION_NAME, { userId: req.user.userId });

    try {
        const notes = await noteService.getSharedNotes(req.user.userId);
        printLog("EXIT_SUCCESS", FUNCTION_NAME, { count: notes.length });
        return res.status(200).json({ success: true, data: notes, message: "Shared notes fetched successfully" });

    } catch (error) {
        printError({ event: "Fetch shared notes failed", functionName: FUNCTION_NAME, error });
        printLog("EXIT_ERROR", FUNCTION_NAME);
        return res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    share,
    sharedNotes
};
