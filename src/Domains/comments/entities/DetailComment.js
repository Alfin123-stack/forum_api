/* eslint-disable camelcase */
class DetailComment {
    constructor(payload) {
      this._verifyPayload(payload);
  
      const {
        id, username, content, date,is_delete,
      } = payload;
  
      this.id = id;
      this.username = username;
      this.content = is_delete ? '**komentar telah dihapus**' : content;
      this.date = date;
    }
  
    _verifyPayload(payload) {
      const {
        id,
        username,
        content,
        date,
      } = payload;
  
      if (!id || !username || !content || !date ) {
        throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if (
        typeof id !== 'string'
        || typeof username !== 'string'
        || typeof content !== 'string'
        || (typeof date !== 'string' && typeof date !== 'object')
      ) {
        throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = DetailComment;
  