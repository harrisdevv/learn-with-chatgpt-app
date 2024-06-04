// import React from 'react';
// import ReactDOM from 'react-dom';
// import MyComponent from './MyComponent'; // Import your component
// const rootElement = document.getElementById('root');
// const root = ReactDOM.createRoot(rootElement);
// root.render(<MyComponent />);

var messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];
async function sendMessage() {
  const message = document.getElementById("input").value.trim();
  if (message === "") return;
  const messageElement = document.createElement("p");
  messageElement.textContent = `You: ${message}`;
  document.getElementById("messages").appendChild(messageElement);
  try {
    messages.push({ role: "user", content: message });
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-proj-WrqzDkIfjFH6OraMRCb3T3BlbkFJXnYAoLW31WpE2YwocGTz`,
        },
      }
    );
    const data = response.data.choices[0].message.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    document.getElementById(
      "messages"
    ).innerHTML += `<p>ChatGPT: ${data.replace(/\n/g, "<br>")}</p>`;
  } catch (error) {
    console.error("Error:", error);
  }
}
