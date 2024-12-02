// src/components/DiscussionReply.js
import React, { useState } from 'react';

const DiscussionReply = ({ addReply }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      addReply(replyContent);
      setReplyContent('');
    }
  };

  return (
    <form onSubmit={handleReplySubmit}>
      <textarea
        placeholder="Write a reply..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        required
      />
      <button type="submit">Reply</button>
    </form>
  );
};

export default DiscussionReply;