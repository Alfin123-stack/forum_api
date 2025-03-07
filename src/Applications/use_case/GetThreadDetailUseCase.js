const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    // Mendapatkan detail thread
    const threadDetail = await this._threadRepository.getThreadById(threadId);

    // Mendapatkan komentar terkait thread
    const rawComments = await this._commentRepository.fetchCommentsByThread(
      threadId
    );

    // Melakukan agregasi data di use case (bukan di repository)
    const aggregatedComments = rawComments.map(
      (comment) =>
        new DetailComment({
          id: comment.id,
          username: comment.username,
          date: new Date(comment.date).toISOString(),
          content: comment.is_delete
            ? "**komentar telah dihapus**"
            : comment.content,
        })
    );

    // Menggabungkan komentar teragregasi ke dalam detail thread
    threadDetail.comments = aggregatedComments;

    // Mengembalikan entitas DetailThread yang sudah lengkap dengan komentar
    return new DetailThread(threadDetail);
  }
}

module.exports = GetThreadDetailUseCase;
