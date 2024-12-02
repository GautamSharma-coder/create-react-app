// src/components/DiscussionItem.js
import React from 'react';

const DiscussionItem = ({ discussion }) => {
  const { username, userImage, content, timestamp } = discussion;

  return (
    <div className="discussion-item">
      <div className="discussion-header">
        <img src={userImage || 'default-avatar-url'} alt="User Avatar" className="user-avatar" />
        <div>
          <p className="username">{username}</p>
          <p className="timestamp">{new Date(timestamp?.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
      <div className="discussion-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default DiscussionItem;