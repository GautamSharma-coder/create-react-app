import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, onComplete, typingSpeed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [text, onComplete, typingSpeed]);

  return <div>{displayText}</div>;
};

const CodeArtTextLoader = () => {
  const [stage, setStage] = useState(0);
  const stages = [
    '> Initializing system...',
    '> Loading modules...',
    '> Compiling code...',
    '> Optimizing performance...',
    '> Applying security patches...',
    '> System ready!'
  ];

  const advanceStage = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
    }
  };

  return (
    <div className="font-mono text-red-500 bg-black p-4 rounded-lg max-w-md">
      {stages.slice(0, stage + 1).map((text, index) => (
        <div key={index} className="mb-2">
          {index === stage ? (
            <TypewriterText
              text={text}
              onComplete={advanceStage}
              typingSpeed={39}
            />
          ) : (
            <div>{text}</div>
          )}
        </div>
      ))}
      {stage < stages.length - 1 && (
        <div className="animate-pulse">_</div>
      )}
    </div>
  );
};

// Demo component to showcase the CodeArtTextLoader
const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <CodeArtTextLoader />
      ) : (
        <div className="font-mono text-red-500">
          Application loaded successfully!
        </div>
      )}
    </div>
  );
};

export default Loader;