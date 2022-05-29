const env = process.env.NODE_ENV;

export const MONGO_DB_CONNECTION =
  env === "dev"
    ? "mongodb://localhost:27017/notafiscal"
    : env === "prod"
    ? "mongodb+srv://biot_admin:biot_admin@cluster0.jcts2.mongodb.net/notafiscal?retryWrites=true&w=majority"
    : "mongodb://socketio_dashboard-mongo:27017/notafiscal";


    //banco ORIGINAL ---------- //
   
    