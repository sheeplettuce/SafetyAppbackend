import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // Usuario default de XAMPP
  password: "",      
  database: "safetyappdb" 
});
