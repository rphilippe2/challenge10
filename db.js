const { Pool } = require("pg");
const fs = require("fs");

require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Function to create a database if it doesn't exist
async function createDatabaseIfNotExists(dbName) {
  const client = await pool.connect();

  try {
    // Check if the database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      // Database does not exist, create it
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    client.release();
  }
}

async function createTables() {
  const client = await pool.connect();
  try {
    // Read the SQL file
    const sql = fs.readFileSync("create_tables.sql", "utf8");

    // Execute the SQL commands
    await client.query(sql);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    client.release();
  }
}

createTables();

// Call the function with the desired database name
createDatabaseIfNotExists(process.env.PGDATABASE);

module.exports = {
  query: (text, params) => pool.query(text, params),
};

