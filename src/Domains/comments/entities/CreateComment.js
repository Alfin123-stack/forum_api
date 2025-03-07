class CreateComment {
    constructor(payload) {
      this._verifyPayload(payload);
  
      const { content } = payload;
  
      this.content = content;
    }
  
    _verifyPayload({ content }) {
      if (!content ) {
        throw new Error("CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
      }
    }
  }
  
  module.exports = CreateComment;
  