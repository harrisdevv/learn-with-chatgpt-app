import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageProps {
  index: number;
  author: string;
  content: string;
  tag: Array<string>;
}

class Message extends React.PureComponent<MessageProps> {
  appendTag(tag: string) {
    const inputElement = document.getElementById('input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value += ` ${tag}`;
    }
    inputElement.focus();
  }
  render() {
    const { index, author, content, tag } = this.props;
    const capitalizedAuthor = author.charAt(0).toUpperCase() + author.slice(1);
    return author !== "system" && (
      <div key={index} className="flex flex-row gap-x-2 gap-y-4">
        <div className="flex flex-col p-3">
          <div>
            {capitalizedAuthor === 'Assistant' ||
            capitalizedAuthor === 'System' ? (
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
          <p className="text-center text-xs items-center text-blue-800">
            {capitalizedAuthor}
          </p>
        </div>
        <div className="flex flex-col bg-white m-1 rounded-3xl p-3 items-center justify-center hover:bg-gray-200">
          <MarkdownRenderer markdown={content} />
          {tag.length > 0 && (
            <div className="tag">
              <span className="text-xs">Tag: </span>
              {tag.map((tagName, index) => (
                <button key={index} className="text-xs text-blue-800 italic hover:underline" onClick={() => this.appendTag(tagName)}>
                  {tagName},&nbsp;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Message;
