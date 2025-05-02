const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const verifyGoogleToken = require("../helpers/verifyGoogleToken");

module.exports = class UserController {
    static async register(req, res) {
        try {
            const { fullName, email, password, googleToken, authType } = req.body;

            if (!authType) {
                return res.status(400).json({ message: "authType is required ('manual' or 'google')" });
            }

            // Manual Register
            if (authType === "manual") {
                if (!password || !email || !fullName) {
                    return res.status(400).json({ message: "Full name, email, and password are required" });
                }

                const user = await User.create({
                    fullName,
                    email,
                    password,
                    authType: "manual"
                });

                return res.status(201).json({
                    id: user.id,
                    email: user.email,
                    message: "User registered manually"
                });

            } else if (authType === "google") {
                // Google Register
                if (!googleToken) {
                    return res.status(400).json({ message: "Google token is required" });
                }

                const payload = await verifyGoogleToken(googleToken);

                let user = await User.findOne({ where: { googleId: payload.googleId } });

                if (!user) {
                    user = await User.create({
                        fullName: payload.fullName,
                        email: payload.email,
                        googleId: payload.googleId,
                        password: "from_google",
                        authType: "google"
                    });
                }

                return res.status(201).json({
                    id: user.id,
                    email: user.email,
                    message: "User registered with Google"
                });
            } else {
                return res.status(400).json({ message: "authType must be 'manual' or 'google'" });
            }
        } catch (err) {
            console.error(err);
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password, googleToken } = req.body;

            // Google Login
            if (googleToken) {
                const payload = await verifyGoogleToken(googleToken);

                let user = await User.findOne({ where: { googleId: payload.googleId } });

                if (!user) {
                    user = await User.create({
                        fullName: payload.fullName,
                        email: payload.email,
                        googleId: payload.googleId,
                        password: "from_google",
                        authType: "google"
                    });
                }

                const access_token = signToken({ id: user.id });
                return res.status(200).json({ access_token });
            }

            // Manual Login
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ where: { email } });

            if (!user || user.authType !== "manual") {
                return res.status(401).json({ message: "Invalid email/password" });
            }

            const isValid = comparePassword(password, user.password);

            if (!isValid) {
                return res.status(401).json({ message: "Invalid email/password" });
            }

            const access_token = signToken({ id: user.id });
            return res.status(200).json({ access_token });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async profile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ["password"] }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async editProfile(req, res) {
        try {
            const { nik, fullName, gender, phoneNumber, address, profilePicture } = req.body;

            const [updated] = await User.update(
                { nik, fullName, gender, phoneNumber, address, profilePicture },
                { where: { id: req.user.id } }
            );

            if (!updated) {
                return res.status(404).json({ message: "User not found or no changes made" });
            }

            const updatedUser = await User.findByPk(req.user.id, {
                attributes: { exclude: ["password"] }
            });

            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
