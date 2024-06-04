messages = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];
async function sendMessage() {
  const message = document.getElementById("input").value.trim();
  if (message === "") return;
  document.getElementById("messages").innerHTML += `<p>You: ${message}</p>`;
  try {
    messages.append({ role: "user", content: message });
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
    const data = response.data.choices[0].message.content;
    document.getElementById("messages").innerHTML += `<p>ChatGPT: ${data}</p>`;
  } catch (error) {
    console.error("Error:", error);
  }
}
