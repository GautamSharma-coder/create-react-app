// src/components/DiscussionPage.js
import React, { useState } from 'react';
import DiscussionForm from './DiscussionForm';
import DiscussionList from './DiscussionList';
import './DiscussionPage.css'; // Updated styling

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([]);

  const addDiscussion = (discussion) => {
    setDiscussions([discussion, ...discussions]);
  };

  return (
    <div className="discussion-page">
      <h1 className="page-title">Code Art Discussion</h1>
      <DiscussionForm addDiscussion={addDiscussion} />
      <DiscussionList discussions={discussions} />
    </div>
  );
};

export default DiscussionPage;