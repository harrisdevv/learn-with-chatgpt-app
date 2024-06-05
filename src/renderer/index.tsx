import { createRoot } from 'react-dom/client';
import App from './App';
import axios from 'axios';
import '../styles/tailwind.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

interface Message {
  role: string;
  content: string;
}

interface Map {
  summarytext: string;
  summarybook: string;
}
interface ShortcutCommand {
  [key: string]: string;
}
const shortcutCommand: ShortcutCommand = {
  summarytext: 'summary the book ??? with 3 sentences',
  summarybook:
    'convert the book ??? to actionable habits, actions to do everyday',
};

const messages: Message[] = [
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
];

async function sendMessage(): Promise<void> {
  const messageInput = document.getElementById('input') as HTMLInputElement;
  const messagesElement = document.getElementById('messages') as HTMLElement;

  const message = messageInput.value.trim();
  if (message === '') return;

  const messageElement = document.createElement('p');
  messageElement.textContent = `You: ${message}`;
  messagesElement.appendChild(messageElement);

  try {
    messages.push({ role: 'user', content: message });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer sk-proj-WrqzDkIfjFH6OraMRCb3T3BlbkFJXnYAoLW31WpE2YwocGTz`,
        },
      },
    );

    const data = response.data.choices[0].message.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    messagesElement.innerHTML += `<p>ChatGPT: ${data}</p>`;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function completeMessage(): Promise<void> {
  const input = document.getElementById('input') as HTMLInputElement;
  const dropdown = document.getElementById('dropdown') as HTMLElement;
  const text = input.value;
  console.log(text);

  if (text.startsWith('/') && text.length > 1) {
    const prefix = text.slice(1);
    const items = Object.keys(shortcutCommand).filter((key) =>
      key.startsWith(prefix),
    );
    if (items.length > 0) {
      dropdown.style.display = 'block';
      dropdown.innerHTML = '';
      items.forEach((item) => {
        const option = document.createElement('div');
        option.textContent = item;
        option.addEventListener('click', () => {
          const jumpIndex = shortcutCommand[item].indexOf('???');
          input.value = `${shortcutCommand[item].replace('???', '')}`;
          input.focus();
          if (jumpIndex !== -1) {
            console.log(jumpIndex);
            input.setSelectionRange(jumpIndex, jumpIndex); // Set the selection range to the specified index
          }
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(option);
      });
    } else {
      dropdown.style.display = 'none';
    }
  } else {
    dropdown.style.display = 'none';
  }
}
