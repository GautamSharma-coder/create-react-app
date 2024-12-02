// src/components/DiscussionForm.js
import React, { useState } from 'react';
import { auth ,firestore} from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const DiscussionForm = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setError('Discussion content is required.');
      return;
    }

    if (!user) {
      setError('You must be logged in to post a discussion.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'discussions'), {
        content,
        username: user.displayName,
        userImage: user.imageURL,
        timestamp: serverTimestamp(),
      });
      setContent('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="discussion-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <textarea
        placeholder="Discussion Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Post Discussion</button>
    </form>
  );
};

export default DiscussionForm;