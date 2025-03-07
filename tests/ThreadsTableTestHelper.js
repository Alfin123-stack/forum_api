/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "A New Thread",
    body = "Thread body",
    date = new Date().toISOString(), // Added date field
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)", // Including date in the query
      values: [id, title, body, date, owner],
    };

    try {
      // Execute the insert query
      await pool.query(query);
      console.log("Thread added successfully!");
    } catch (error) {
      // Handle any errors that occur during the insert operation
      console.error("Error inserting thread:", error);
      throw error; // Optionally rethrow the error if needed
    }
  },
  async findThreadsById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
