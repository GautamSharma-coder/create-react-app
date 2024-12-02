// src/components/DiscussionItem.js
import React, { useState } from 'react';
import DiscussionReply from './DiscussionReply';

const DiscussionItem = ({ discussion }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const addReply = (reply) => {
    setReplies([reply, ...replies]);
  };

  return (
    <div className="discussion-item">
      {discussion.userImage && (
        <img src={discussion.userImage} alt={discussion.username} className="user-image" />
      )}
      <div className="discussion-content">
        <h3 className="username">{discussion.username}</h3>
        <p className="content">{discussion.content}</p>
        <p className="timestamp">{discussion.timestamp}</p>
        <div className="interaction-buttons">
          <button onClick={toggleReplies}>
            {showReplies ? 'Hide Replies' : 'Show Replies'}
          </button>
          <button onClick={() => discussion.likes++}>
            Like {discussion.likes}
          </button>
        </div>
        {showReplies && (
          <div className="replies-section">
            <DiscussionReply addReply={addReply} />
            {replies.length > 0 && (
              <div className="replies-list">
                {replies.map((reply, index) => (
                  <div key={index} className="reply-item">{reply}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionItem;