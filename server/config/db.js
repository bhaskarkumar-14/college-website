import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS servers to Google and Cloudflare Public DNS to bypass Render's SRV resolution issues
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log("DNS Servers set to Public DNS (8.8.8.8, 1.1.1.1) to resolve SRV records");
} catch (err) {
    console.warn("Could not set custom DNS servers:", err.message);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pce_db', {
            family: 4
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
