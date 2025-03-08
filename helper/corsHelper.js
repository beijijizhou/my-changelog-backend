import cors from 'cors';
const allowedOrigins = ['http://localhost:5173', 'https://my-changelog-app.vercel.app'];
export const corsOption = cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies if needed
})