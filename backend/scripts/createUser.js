import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createUser = async (name, email, phone, password) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone');
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            console.log('❌ User already exists with this email or phone!');
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            status: 'Available',
        });

        console.log('✅ User created successfully!');
        console.log('📋 User Details:');
        console.log('   Name:', user.name);
        console.log('   Email:', user.email);
        console.log('   Phone:', user.phone);
        console.log('   ID:', user._id);
        console.log('\n🔐 Login Credentials:');
        console.log('   Email:', email);
        console.log('   Password:', password);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
    }
};

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
    console.log('Usage: node createUser.js <name> <email> <phone> <password>');
    console.log('Example: node createUser.js "John Doe" john@example.com 9876543210 password123');
    process.exit(1);
}

const [name, email, phone, password] = args;

createUser(name, email, phone, password);
