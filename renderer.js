var map = {
  summarytext: "summary the book ??? with 3 sentences",
  summarybook:
    "convert the book ??? to actionable habits, actions to do everyday",
};

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

async function completeMessage() {
  const text = input.value;
  console.log(text);
  if (text.startsWith("/") && text.length > 1) {
    const prefix = text.slice(1);
    const items = Object.keys(map).filter((key) => key.startsWith(prefix));

    console.log("items: " + items);
    if (items.length > 0) {
      dropdown.style.display = "block";
      dropdown.innerHTML = "";
      items.forEach((item) => {
        const option = document.createElement("div");
        option.textContent = item;
        option.addEventListener("click", () => {
          const jumpIndex = map[item].indexOf("???");
          input.value = `${map[item].replace("???","")}`;
          input.focus()
          if (jumpIndex != -1) {
            console.log(jumpIndex)
            input.setSelectionRange(jumpIndex, jumpIndex); // Set the selection range to the specified index
          }

          dropdown.style.display = "none";
        });
        dropdown.appendChild(option);
      });
    } else {
      dropdown.style.display = "none";
    }
  } else {
    dropdown.style.display = "none";
  }
}
