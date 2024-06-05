import React from 'react';

interface MessageProps {
  index: number;
  author: string;
  content: string;
}

class Message extends React.PureComponent<MessageProps> {
  render() {
    const { index, author, content } = this.props;
    const capitalizedAuthor = author.charAt(0).toUpperCase() + author.slice(1);
    return (
        <div key={index} className="flex flex-row gap-x-2 gap-y-4">
          <div className="flex flex-col p-3 ">
            <div >
              {capitalizedAuthor === 'Assistant' || capitalizedAuthor === 'System' ? (
                <img
                  src={require('../../assets/icons8-robot-94.png')}
                  alt={capitalizedAuthor}
                  className="w-10 h-10"
                />
              ) : (
                <img
                  src={require('../../assets/icons8-human-100.png')}
                  alt={capitalizedAuthor}
                  className="w-10 h-10"
                />
              )}
            </div>
            <p className="text-center text-xs items-center text-blue-800">{capitalizedAuthor}</p>
          </div>
          <div className="flex bg-white rounded-3xl p-5 items-center hover:bg-gray-200"> {content}</div>
        </div>
    );
  }
}

export default Message;

