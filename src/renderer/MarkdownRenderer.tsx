import React from 'react';
import MarkdownIt from 'markdown-it';

// Create a new instance of markdown-it
const md = new MarkdownIt();

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  // Convert the Markdown string to HTML
  const htmlString = md.render(markdown);

  return (
    <div className="flex-none"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default MarkdownRenderer;
