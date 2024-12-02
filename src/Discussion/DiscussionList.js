// src/components/DiscussionList.js
import React from 'react';
import DiscussionItem from './DiscussionItem';

const DiscussionList = ({ discussions }) => {
  return (
    <div className="discussion-list">
      {discussions.length > 0 ? (
        discussions.map((discussion) => (
          <DiscussionItem key={discussion.id} discussion={discussion} />
        ))
      ) : (
        <p>No discussions yet. Be the first to start a conversation!</p>
      )}
    </div>
  );
};

export default DiscussionList;