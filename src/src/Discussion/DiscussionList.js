// src/components/DiscussionList.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import DiscussionItem from './DiscussionItem';

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'discussions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDiscussions(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return () => unsubscribe();
  }, []);

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