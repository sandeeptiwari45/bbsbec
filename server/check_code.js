const mongoose = require('mongoose');
const RegistrationCode = require('./src/models/RegistrationCode');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkCode = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const codeStr = 'BBSBEC251201130045';
        const code = await RegistrationCode.findOne({ code: codeStr });

        if (!code) {
            console.log(`Code ${codeStr} not found.`);
        } else {
            console.log('isUsed:', code.isUsed);
            console.log('usedBy ID:', code.usedBy);

            if (code.usedBy) {
                const user = await User.findById(code.usedBy);
                console.log('User found:', user);
            } else {
                console.log('No usedBy ID found on code document.');
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkCode();
