const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const Comment = require("../../../Domains/comments/entities/Comment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isCommentExists function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.isCommentExists("comment-123", "thread-123")
      ).rejects.toThrowError(new NotFoundError("komentar tidak ditemukan"));
    });

    it("should throw NotFoundError when comment is deleted", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
        is_delete: true, // comment is soft deleted
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.isCommentExists(commentId, threadId)
      ).rejects.toThrowError(new NotFoundError("komentar telah dihapus"));
    });

    it("should throw NotFoundError when comment is not found in thread", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.isCommentExists("comment-123", "other-thread")
      ).rejects.toThrowError(
        new NotFoundError("komentar tidak milik thread yang diberikan")
      );
    });

    it("should not throw NotFoundError when comment available", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.isCommentExists(commentId, threadId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkCommentAuthor function", () => {
    it("should throw AuthorizationError when comment owner not authorized", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.checkCommentAuthor(commentId, "user-other")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment owner authorized", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.checkCommentAuthor(commentId, userId)
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("createComment function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
    });

    it("should persist new comment", async () => {
      const createComment = new CreateComment({ content: "A comment" });
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.createComment(
        "user-123",
        "thread-123",
        createComment
      );

      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      const createComment = new CreateComment({ content: "A comment" });
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedComment = await commentRepositoryPostgres.createComment(
        "user-123",
        "thread-123",
        createComment
      );

      expect(addedComment).toStrictEqual(
        new Comment({
          id: "comment-123",
          content: "A comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("fetchCommentsByThread function", () => {
    it("should return thread comments correctly", async () => {
      const userId = "user-123";
      const otherUserId = "user-456";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "johndoe",
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      await CommentsTableTestHelper.addComment({
        id: "comment-new",
        content: "A new comment",
        date: new Date("2023-09-10T00:00:00.000Z"),
        thread: threadId,
        owner: userId,
        is_delete: false,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-old",
        content: "An old comment",
        date: new Date("2023-09-09T00:00:00.000Z"),
        thread: threadId,
        owner: otherUserId,
        is_delete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.fetchCommentsByThread(
        threadId
      );

      expect(comments).toHaveLength(2);

      expect(comments[0]).toEqual(
        expect.objectContaining({
          id: "comment-old",
          username: "johndoe",
          content: "An old comment",
          date: new Date("2023-09-09T00:00:00.000Z"),
          is_delete: true,
        })
      );

      expect(comments[1]).toEqual(
        expect.objectContaining({
          id: "comment-new",
          username: "foobar",
          content: "A new comment",
          date: new Date("2023-09-10T00:00:00.000Z") ,
          is_delete: false,
        })
      );
    });
  });

  describe("removeComment function", () => {
    it("should soft delete comment and update is_delete field", async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const commentId = "comment-123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: "thread-123",
        owner: "user-123",
      });

      await commentRepositoryPostgres.removeComment(commentId);

      const comments = await CommentsTableTestHelper.findCommentsById(
        commentId
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toBeTruthy();
    });
  });
});
