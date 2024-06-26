# AI Learning Assistant Desktop App
![Application UI](./assets/app_ui.png)

Welcome to the ChatGPT Learning Assistant project! This project is a tool designed to help you learn faster and more effectively by leveraging the powerful capabilities of ChatGPT. Whether you're studying for exams, exploring new topics, or just satisfying your curiosity, this tool can assist you by providing instant answers, explanations, and insights.
## Table of Contents

- [AI Learning Assistant Desktop App](#ai-learning-assistant-desktop-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [How It Works](#how-it-works)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Features

- **Electron** for building cross-platform desktop applications.
- **React** for building the user interface.
- **TypeScript** for static typing.
- **Tailwind CSS** for utility-first CSS styling.
- Integration with **OpenAI API** for AI functionalities.

## How It Works

1. **Ask Questions:** Simply type your questions into the input box and hit 'Send'.
2. **Receive Answers:** ChatGPT processes your query and provides detailed, accurate responses.
3. **Summarize Information:** Use built-in commands to get summaries of books, articles, or any lengthy content.
   1. At the message box, type "/summ" then choose sumbooktohabit (like the image below) and press Enter, then you just enter your book title into the quotes mark.
   ![shortcut command](/assets/shortcut_command.png)
4. **Actionable Habits:** Convert complex information into daily habits and actionable steps.


## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn (v1.22 or later)

## Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/electron-react-app.git
cd electron-react-app
```
2. Add your OpenAI key to the file ```OpenAI.tsx```
3. Install dependencies:
```sh
npm install
```
3. Start the application:
```sh
npm start
```
