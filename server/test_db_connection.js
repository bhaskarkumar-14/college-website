import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Determine if running directly or via another script
const isMain = process.argv[1] === import.meta.filename;

const testConnection = async (uri) => {
    console.log(`\nTesting Connection to: ${uri.replace(/:([^:@]+)@/, ':****@')} ...`); // Mute password in log
    try {
        await mongoose.connect(uri);
        console.log("✅ SUCCESS! This connection string is VALID.");
        console.log("   You can use this string in Render.");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ CONNECTION FAILED:", error.message);
        if (error.codeName === 'BadValue' || error.message.includes('EBADNAME')) {
            console.error("   -> The Connection String format is likely wrong or has typos/spaces.");
        } else if (error.message.includes('authentication failed')) {
            console.error("   -> Username or Password is incorrect.");
        } else if (error.message.includes('ETIMEDOUT') || error.message.includes('time out')) {
            console.error("   -> Network Error. Check IP Whitelist (0.0.0.0/0) in MongoDB Atlas.");
        }
    }
};

if (isMain) {
    const uri = process.argv[2];
    if (!uri) {
        console.log("Usage: node test_db_connection.js <your_connection_string>");
        console.log("Example: node test_db_connection.js \"mongodb+srv://admin:pass@cluster0...\"");
    } else {
        testConnection(uri);
    }
}
