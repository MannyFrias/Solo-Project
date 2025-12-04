import mongoose from "mongoose"; 


// connecting to db and healthcheck
export const connectDB = async () => {
    try {
			const connect = await mongoose.connect(process.env.MONGODB_URI, {
				dbName: process.env.dbName, 
			})
			console.log("connected to MongoDB")
			return connect;
    } catch (err) {
      console.error("Db connection failed", err);
		process.exitCode(1);
    }
}; 

// closing DB connection 
export const disconnectDB = async () => {
	try {
		await mongoose.connection.close(); 
		console.log("disconnected from DB")
	} catch (err) {
		console.error("error disconnecting from DB", err); 
	}
};