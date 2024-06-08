import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import '../styles/output.css'; 
import './App.css';
import { OpenAPIKey } from './Key';
import Message from './Message';


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
  const [messages, setMessages] = useState<{ role: string; content: string, tag:Array<string>}[]>(
    [{ role: 'system', content: 'You are a helpful assistant. You turn any information to a fun story to help me learn better and more efficiently and lots of fun. You highlight the important keyword of your answer.' , tag:[]}],
  );
  const [inputValue, setInputValue] = useState('');
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const map = {
    sumbookwith3sen: 'summarize the book "???" with 3 sentences',
    sumbooktohabit:
      'convert the book "???" to actionable habits, actions to do everyday',
    firstprinciple: 'break down "???" knowledge by first principles method to an semantic tree that help me learn the important first, give me the resource to learn that each important part',
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    setInputValue('');
    if (inputValue.trim() === '') return;

    const userMessage = { role: 'user', content: inputValue, tag:[]};
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await callOpenAIAPI(messages, userMessage);
      const data = response.data.choices[0].message.content
      const questionAboutTag = `Extract important keywords from this text '${data}'. Return one line string with format "keyword1,keyword2,keyword3,etc"`;
      const responseTag = await callOpenAIAPI(messages, {role: 'user', content: questionAboutTag});
      var dataTag = responseTag.data.choices[0].message.content
      if (dataTag.startsWith('"')) {
        dataTag = dataTag.slice(1);
      }
      if (dataTag.endsWith('"')) {
        dataTag = dataTag.slice(0, -1);
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data, tag: dataTag.split(',').map((tag: string) => tag.trim()) },
      ]);
      console.log(dataTag.split(","))
    } catch (error) {
      console.error('Error:', error);
    }

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

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // if (event.altKey && event.key.toLowerCase() === 'g') {
      //   console.log(event.key)
      if (event.key === 'g') {
        console.log("g")
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
    <div style={{ padding: '10px', backgroundColor: '#e4e4e4' }}>
      <h3 className="py-1 text-1xl font-bold"
        style={{
          background:
            'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        AI Learning Assistant App
      </h3>
      {/* TODO: But python script is better
      <button className='px-2 py-1 rounded-lg border-2 border-slate-300 hover:bg-slate-300' onClick={()=> {speechToText("testFile.mp3")}}>📯</button> */}
      <div
        id="messages"
        ref={messagesRef}
        style={{
          height: 'calc(100vh - 135px)',
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
            tag={message.tag}
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
            className="absolute bottom-20 left-10 flex flex-col bg-slate-100 rounded-xl border-2 border-slate-300"
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
        Authorization: `Bearer ${OpenAPIKey}`,
      },
    }
  );
}


