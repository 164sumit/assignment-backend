import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    await mongoose.connect("mongodb+srv://sumit1234:m0xgYzhhOyHhiOCT@atlascluster.wke8xpi.mongodb.net/Databasetodo").then((data) => {
        console.log(`Mongodb connected with server : ${data.connection.host}`);

    })
  
};

export default connectDB;