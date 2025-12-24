const { User } = require("../models");
const {
    hashPassword,
    comparePassword,
    hashToken,
    compareToken
} = require("../utils/password");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require("../utils/jwt");
const { printError, printLog } = require("../utils/logger");

async function register(payload) {
    const FUNCTION_NAME = "authService.register";

    try {
        const { email, password, name } = payload;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            passwordHash
        });

        printLog("User persisted in database", FUNCTION_NAME, {
            userId: user.id
        });

        return user;
    } catch (error) {
        printError({
            event: "User registration error",
            functionName: FUNCTION_NAME,
            error
        });
        throw error;
    }
}

async function login(payload) {
    const FUNCTION_NAME = "authService.login";

    try {
        const { email, password } = payload;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const tokenPayload = { userId: user.id };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        user.refreshTokenHash = await hashToken(refreshToken);
        await user.save();

        printLog("JWT access & refresh tokens generated", FUNCTION_NAME, {
            userId: user.id
        });

        return { accessToken, refreshToken };
    } catch (error) {
        printError({
            event: "Login error",
            functionName: FUNCTION_NAME,
            error
        });
        throw error;
    }
}

async function refreshToken(refreshToken) {
    const FUNCTION_NAME = "authService.refreshToken";
    printLog("inside the authServie.refreshToken")

    try {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new Error("Invalid refresh token");
        }

        const user = await User.findByPk(payload.userId);
        if (!user || !user.refreshTokenHash) {
            throw new Error("Refresh token revoked");
        }

        const isValid = await compareToken(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isValid) {
            throw new Error("Refresh token mismatch");
        }

        const newAccessToken = generateAccessToken({ userId: user.id });
        const newRefreshToken = generateRefreshToken({ userId: user.id });

        user.refreshTokenHash = await hashToken(newRefreshToken);
        await user.save();

        printLog("Refresh token rotated successfully", FUNCTION_NAME, {
            userId: user.id
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        printError({
            event: "Refresh token error",
            functionName: FUNCTION_NAME,
            error
        });
        throw error;
    }
}

module.exports = {
    register,
    login,
    refreshToken
};
