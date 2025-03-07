const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const Thread = require("../../Domains/threads/entities/Thread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // Verifies if a thread with the given ID exists
  async verifyAvailableThread(id) {
    const query = {
      text: "SELECT 1 FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError(`thread tidak ditemukan`);
    }
  }

  async addThread(userId, thread) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString(); // Add the current date in ISO format

    const query = {
      text: "INSERT INTO threads (id, title, body, date, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, date, owner",
      values: [id, title, body, date, userId], // Include the date here
    };

    const result = await this._pool.query(query);
    return new Thread({ ...result.rows[0], date });
  }

  // Fetches thread details by its ID and includes the username of the owner and the date
  async getThreadById(id) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.date::text, users.username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
