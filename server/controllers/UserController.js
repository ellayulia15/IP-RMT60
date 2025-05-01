const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require('../helpers/jwt')
const { User } = require("../models")
module.exports = class UserController {
    static async register(req, res, next) {
        try {
            const { fullName, email, password, googleId, authType } = req.body;

            if (!authType) {
                return res.status(400).json({ message: "AuthType is required! ('manual' or 'google')" });
            }

            if (authType === 'manual') {
                if (!password) {
                    return res.status(400).json({ message: "Password is required for manual registration!" });
                }

                const user = await User.create({
                    fullName,
                    email,
                    password,
                    authType: 'manual'
                });

                return res.status(201).json({
                    id: user.id,
                    email: user.email,
                    message: 'User registered manually'
                });

            } else if (authType === 'google') {
                if (!googleId || !email) {
                    return res.status(400).json({ message: "googleId and email are required for Google registration" });
                }

                let user = await User.findOne({ where: { googleId } });

                if (!user) {
                    user = await User.create({
                        fullName,
                        email,
                        googleId,
                        password: 'default_google',
                        authType: 'google'
                    });
                }

                return res.status(201).json({
                    id: user.id,
                    email: user.email,
                    message: 'User registered with Google'
                });

            } else {
                return res.status(400).json({ message: "authType must be 'manual' or 'google'" });
            }

        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: error.errors[0].message });
            } else {
                return res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password, googleId } = req.body;

            if (googleId) {
                const ticket = await client.verifyIdToken({
                    idToken: googleId,
                    audience: process.env.GOOGLE_CLIENT_ID
                });

                const payload = ticket.getPayload();
                const [user, created] = await User.findOrCreate({
                    where: { email: payload.email },
                    defaults: {
                        fullName: payload.name,
                        email: payload.email,
                        googleId: payload.sub,
                        password: 'from_google',
                        authType: 'google'
                    }
                });

                const access_token = signToken({ id: user.id });
                return res.status(200).json({ access_token });
            }

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await User.findOne({ where: { email } });
            if (!user || user.authType !== 'manual') {
                return res.status(401).json({ message: 'Invalid email/password' });
            }

            const validPassword = comparePassword(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid email/password' });
            }

            const access_token = signToken({ id: user.id });
            res.status(200).json({ access_token });
        } catch (err) {
            next(err);
        }
    }

    static async profile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async editProfile(req, res) {
        try {
            const {
                nik,
                fullName,
                gender,
                phoneNumber,
                address,
                profilePicture
            } = req.body;

            const [updated] = await User.update(
                { nik, fullName, gender, phoneNumber, address, profilePicture },
                { where: { id: req.user.id } }
            );

            if (!updated) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            const updatedUser = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: err.errors[0].message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}