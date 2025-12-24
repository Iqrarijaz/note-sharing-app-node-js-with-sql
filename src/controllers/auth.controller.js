import * as authService from "../services/auth.service.js";
import { verifySchema } from "./validators/validations.js";
import { printError, printLog } from "../utils/logger.js";

export async function register(req, res) {
    const FUNCTION_NAME = "register";

    try {
        const payload = req.body;

        printLog("Register payload received", FUNCTION_NAME, payload);

        const validation = verifySchema("USER_REGISTRATION_SCHEMA", payload);
        if (!validation.success) {
            return res.status(422).json(validation);
        }

        printLog("Validation successful", FUNCTION_NAME);

        await authService.register(payload);

        printLog("User successfully created", FUNCTION_NAME);

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        printError({
            event: "User registration failed",
            functionName: FUNCTION_NAME,
            error
        });

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong during registration"
        });
    }
}

export async function login(req, res) {
    const FUNCTION_NAME = "login";

    try {
        const payload = req.body;

        printLog("Login payload received", FUNCTION_NAME, payload);

        const validation = verifySchema("USER_LOGIN_SCHEMA", payload);
        if (!validation.success) {
            return res.status(422).json(validation);
        }

        const data = await authService.login(payload);

        printLog("User logged in successfully", FUNCTION_NAME);

        return res.json({
            success: true,
            data
        });
    } catch (error) {
        printError({
            event: "Login failed",
            functionName: FUNCTION_NAME,
            error
        });

        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials"
        });
    }
}

export async function refreshToken(req, res) {
    const FUNCTION_NAME = "refreshToken";

    try {
        const { token } = req.body;
        printLog("Refresh token request received", FUNCTION_NAME);

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const data = await authService.refreshToken(token);

        printLog("Access token refreshed successfully", FUNCTION_NAME);

        return res.json({
            success: true,
            data
        });
    } catch (error) {
        printError({
            event: "Refresh token failed",
            functionName: FUNCTION_NAME,
            error
        });

        return res.status(401).json({
            success: false,
            message: error.message || "Invalid refresh token"
        });
    }
}
