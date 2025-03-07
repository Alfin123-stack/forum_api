const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const Comment = require("../../Domains/comments/entities/Comment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // Mengubah nama fungsi sesuai dengan yang ada di interface
  async isCommentExists(commentId, threadId) {
    const query = {
      text: "SELECT id, is_delete, thread FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError("komentar telah dihapus");
    }

    if (result.rows[0].thread !== threadId) {
      throw new NotFoundError("komentar tidak milik thread yang diberikan");
    }
  }

  async checkCommentAuthor(commentId, userId) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    if (comment.owner !== userId) {
      throw new AuthorizationError("Access forbidden");
    }
  }

  async createComment(userId, threadId, content) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments (id, content, date, thread, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner, date",
      values: [id, content.content, date, threadId, userId], // Ensure content is accessed correctly
    };

    const result = await this._pool.query(query);

    // Return a Comment instance with id, content, and owner
    return new Comment({
      id: result.rows[0].id, // Use the returned id from the database
      content: result.rows[0].content, // Use the returned content
      owner: result.rows[0].owner, // Use the returned owner
    });
  }

  async fetchCommentsByThread(threadId) {
    const query = {
      text: `
            SELECT comments.id, users.username, comments.content, comments.date, comments.is_delete
            FROM comments
            JOIN users ON users.id = comments.owner
            WHERE comments.thread = $1
            ORDER BY comments.date ASC
        `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async removeComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
