const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined in environment variables.');
}

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        return {
            googleId: payload.sub,
            email: payload.email,
            fullName: payload.name
        };

    } catch (err) {
        console.error('Error during Google token verification:', err);
        throw new Error('Invalid or expired Google token');
    }
}

module.exports = verifyGoogleToken;
