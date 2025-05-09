const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = class UserController {
    static async googleLogin(req, res) {
        try {
            const { googleToken } = req.body;

            if (!googleToken) {
                return res.status(400).json({ message: "Google token is required" });
            }

            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            let user = await User.findOne({ where: { email: payload.email } });
            console.log(user);

            if (!user) {
                user = await User.create({
                    fullName: payload.name,
                    email: payload.email,
                    googleToken: payload.sub,
                    profilePicture: payload.picture,
                    password: "from_google",
                    authType: "google"
                });
            }

            const access_token = signToken({ id: user.id });
            return res.status(200).json({ access_token });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async register(req, res) {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
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
                message: "User registered successfully"
            });

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
            const { email, password } = req.body;

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
