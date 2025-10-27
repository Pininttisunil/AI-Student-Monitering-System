const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Replace with your Neon connection string
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_5MmFYaglRPx8@ep-falling-dew-ad2h5idf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// ✅ Create Teachers table
pool.query(`
  CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    designation VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    mobile_no VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`).then(() => console.log("✅ Teachers table ready"))
  .catch(err => console.error(err));

// ✅ Create Students table
pool.query(`
  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    hall_ticket VARCHAR(50) UNIQUE,
    batch_no VARCHAR(50),
    father_name VARCHAR(50),
    mobile_no VARCHAR(15),
    password VARCHAR(255)
  )
`).then(() => console.log("✅ Students table ready"))
  .catch(err => console.error(err));

/* ------------------- Teacher Routes ------------------- */

// Teacher Registration
app.post("/register-teacher", async (req, res) => {
  try {
    const { designation, first_name, last_name, branch, subject, mobile_no, password } = req.body;

    await pool.query(
      `INSERT INTO teachers (designation, first_name, last_name, branch, subject, mobile_no, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [designation, first_name, last_name, branch, subject, mobile_no, password]
    );

    res.json({ success: true, message: "Teacher registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering teacher" });
  }
});

// Teacher Login
app.post("/teacher-login", async (req, res) => {
  const { mobile_no, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM teachers WHERE mobile_no=$1 AND password=$2",
      [mobile_no, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid Mobile Number or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error while logging in" });
  }
});

/* ------------------- Student Routes ------------------- */

// Student Registration
app.post("/register-student", async (req, res) => {
  try {
    const { first_name, last_name, hall_ticket, batch_no, father_name, mobile_no, password } = req.body;

    await pool.query(
      `INSERT INTO students (first_name, last_name, hall_ticket, batch_no, father_name, mobile_no, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [first_name, last_name, hall_ticket, batch_no, father_name, mobile_no, password]
    );

    res.json({ success: true, message: "Student registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering student" });
  }
});

// Student Login
app.post("/student-login", async (req, res) => {
  const { hall_ticket, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE hall_ticket=$1 AND password=$2",
      [hall_ticket, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid Hall Ticket or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error while logging in" });
  }
});

/* ------------------- Start Server ------------------- */
app.listen(5000, () => console.log("🚀 Server running at http://localhost:6000"));
