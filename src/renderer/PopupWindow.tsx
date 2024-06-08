import React, { useEffect } from 'react';

const PopupWindow: React.FC = () => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'g') {
        const content = 'This is a popup window with some text content';

        window.electron.send('create-popup', {
          x: window.screenX,
          y: window.screenY,
          content: content
        });
      }
    };

    document.addEventListener('keydown', handleKeydown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div>
      <h1>Press Alt+G to create a popup</h1>
    </div>
  );
};

export default PopupWindow;
