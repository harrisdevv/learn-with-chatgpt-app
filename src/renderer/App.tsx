import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../styles/output.css'; // Ensure Tailwind CSS is correctly configured
import Message from './message';

function Hello() {
  return (
    <div>
      <MainApp />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

const MainApp: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string}[]>(
    [{ role: 'system', content: 'You are a helpful assistant.' }],
  );
  const [inputValue, setInputValue] = useState('');
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const map = {
    summarytext: 'summary the book ??? with 3 sentences',
    summarybook:
      'convert the book ??? to actionable habits, actions to do everyday',
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await callOpenAIAPI(messages, userMessage);
      const data = response.data.choices[0].message.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data},
      ]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInputValue('');
  };

  const completeMessage = () => {
    const text = inputValue;
    if (text.startsWith('/') && text.length > 1) {
      const prefix = text.slice(1);
      const items = Object.keys(map).filter((key) => key.startsWith(prefix));
      setDropdownItems(items);
    } else {
      setDropdownItems([]);
    }
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#e4e4e4' }}>
      <h3
        style={{
          background:
            'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        ChatGPT Desktop App
      </h3>
      <div
        id="messages"
        ref={messagesRef}
        style={{
          height: 'calc(100vh - 125px)',
          overflowY: 'scroll',
          padding: '0.5rem',
          backgroundColor: '#fcf2f2',
          animation: 'fadeIn 1s',
        }}
        className=" text-black"
      >
        {messages.map((message, index) => (
          <Message
            index={index}
            author={message.role}
            content={message.content}
          />
        ))}
      </div>
      <div
        id="input-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <input
          type="text"
          id="input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          onInput={completeMessage}
          className="rounded focus:ring-2 focus:ring-blue-600 static"
          style={{
            width: '100%',
            maxWidth: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            marginRight: '10px',
            border: '1px solid #ccc',
          }}
        />
        {dropdownItems.length > 0 && (
          <div
            id="dropdown"
            style={{
              zIndex: 1,
            }}
            className="absolute bottom-20 left-10 flex flex-col bg-slate-100 rounded-xl border border-2"
          >
            {dropdownItems.map((item, index) => (
              <button
                key={index}
                className="border-1 border-black hover:bg-slate-200 p-2 rounded-md"
                onClick={() => {
                  const jumpIndex =
                    map[item as keyof typeof map].indexOf('???');
                  setInputValue(
                    map[item as keyof typeof map].replace('???', ''),
                  );
                  if (jumpIndex !== -1) {
                    setTimeout(() => {
                      const inputElement = document.getElementById(
                        'input',
                      ) as HTMLInputElement;
                      inputElement.setSelectionRange(jumpIndex, jumpIndex);
                      inputElement.focus();
                    }, 0);
                  }
                  setDropdownItems([]);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={sendMessage}
          className="transition-all rounded bg-blue-500 hover:bg-blue-600 hover:border-black hover:border-10"
          style={{
            backgroundColor: '#0d6efd',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
async function callOpenAIAPI(messages: { role: string; content: string; }[], userMessage: { role: string; content: string; }) {
  return await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [...messages, userMessage],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer sk-proj-WrqzDkIfjFH6OraMRCb3T3BlbkFJXnYAoLW31WpE2YwocGTz`,
      },
    }
  );
}

