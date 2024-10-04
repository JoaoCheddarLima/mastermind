import mongoose from 'mongoose';

const connection: { isConnected: boolean } = { isConnected: false };

async function connectToDb() {
    if (connection.isConnected) {
        return null;
    }

    const db = await mongoose.connect(process.env.MONGO_URI!, {
        autoIndex: true,
    });

    connection.isConnected = db.connections[0].readyState == 1;

    return db
}

export default connectToDb;