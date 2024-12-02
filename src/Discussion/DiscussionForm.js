// src/components/DiscussionForm.js
import React, { useState } from 'react';

const DiscussionForm = ({ addDiscussion }) => {
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !content) {
      setError('Username and content are required.');
      return;
    }

    const newDiscussion = {
      username,
      userImage,
      content,
      id: Date.now(),
      timestamp: new Date().toLocaleString(), // Adding timestamp
      likes: 0,
    };
    addDiscussion(newDiscussion);
    setUsername('');
    setUserImage('');
    setContent('');
    setError('');
  };

  return (
    <form className="discussion-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="form-input"
      />
      <input
        type="text"
        placeholder="User Image URL"
        value={userImage}
        onChange={(e) => setUserImage(e.target.value)}
        className="form-input"
      />
      <textarea
        placeholder="Discussion Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="form-textarea"
      />
      <button type="submit" className="submit-button">Post Discussion</button>
    </form>
  );
};

export default DiscussionForm;