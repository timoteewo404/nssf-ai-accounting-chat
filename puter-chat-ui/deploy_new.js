(async () => {
  const directory = 'nssf-ai-accounting-chat';
  try {
    await puter.fs.mkdir(directory);
  } catch (error) {
    // directory may already exist; continue
  }

  const files = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NSSF AI Accounting Chat</title>
  <link rel="stylesheet" href="styles.css" />
  <script defer src="https://js.puter.com/v2/"></script>
  <script defer src="app.js"></script>
</head>
<body>
  <div class="chat-app">
    <header class="top-bar glass-card">
      <div>
        <p class="app-label">NSSF AI</p>
        <h1>NSSF AI</h1>
        <p class="app-description">An accounting research assistant focused on CPA, financial reporting, auditing, and accounting history.</p>
      </div>
      <div class="header-controls">
        <label class="model-label" for="model">Model</label>
        <select id="model" class="control-select" aria-label="Choose AI model">
          <option value="gpt-5.4-nano">gpt-5.4-nano</option>
          <option value="gpt-5.4">gpt-5.4</option>
          <option value="gpt-5.3-nano">gpt-5.3-nano</option>
          <option value="gpt-4o">gpt-4o</option>
        </select>
        <button id="login" class="btn btn-secondary btn-login">Sign in</button>
        <p id="auth-status" class="auth-status">Not signed in</p>
      </div>
    </header>

    <main class="chat-window glass-card">
      <div class="chat-window-header">
        <div>
          <p class="chat-window-label">Accounting research</p>
          <h2 class="chat-window-title">NSSF Accounting Assistant</h2>
        </div>
        <div class="chat-window-badge">Model: <strong id="selected-model">gpt-5.4-nano</strong></div>
      </div>
      <div id="messages" class="messages"></div>
    </main>

    <section class="chat-input-panel glass-card">
      <div class="input-tools">
        <button id="clear" class="btn btn-secondary">New chat</button>
        <span class="input-hint">Press Enter to send, Shift+Enter for new line.</span>
      </div>
      <textarea id="prompt" class="prompt-input" rows="4" placeholder="Ask an accounting or CPA question..."></textarea>
      <div class="send-row">
        <button id="send" class="btn btn-primary">Send</button>
      </div>
    </section>

    <p class="footer-note">This chat uses <code>puter.ai.chat()</code> from Puter Playground.</p>
  </div>
</body>
</html>`,
    'styles.css': `:root {
  color-scheme: dark;
  color: #eef2ff;
  background: radial-gradient(circle at top, rgba(118, 125, 255, 0.24), transparent 28%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.14), transparent 25%),
    linear-gradient(180deg, #07111f 0%, #0d1724 100%);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  padding: 24px;
  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.12), transparent 26%),
    radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 20%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.08), transparent 18%),
    linear-gradient(180deg, #050b15 0%, #0f172a 100%);
}

button,
textarea,
select {
  font: inherit;
}

.chat-app {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
}

.glass-card {
  position: relative;
  padding: 24px;
  border-radius: 28px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: start;
}

.app-label {
  margin: 0 0 10px;
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.16);
  color: #dbeafe;
  letter-spacing: 0.02em;
  font-weight: 700;
}

.top-bar h1 {
  margin: 0;
  font-size: clamp(2rem, 2.7vw, 2.7rem);
  line-height: 1.04;
}

.app-description {
  margin: 12px 0 0;
  font-size: 1rem;
  color: #cbd5e1;
  max-width: 640px;
}

.header-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 190px;
  align-items: stretch;
}

.model-label {
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn-login {
  width: 100%;
}

.auth-status {
  margin: 0;
  color: #94a3b8;
  font-size: 0.92rem;
}

.control-select {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  padding: 14px 16px;
  outline: none;
}

.chat-window {
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-window-label {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
}

.chat-window-title {
  margin: 0;
  font-size: 1.5rem;
  color: #e2e8f0;
}

.chat-window-badge {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 600;
}

.chat-window-badge strong {
  color: #eef2ff;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;
  padding-top: 10px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 20px;
  line-height: 1.6;
  max-width: 82%;
  width: fit-content;
  border: none;
  background: rgba(255, 255, 255, 0.08);
}

.message.assistant {
  align-self: flex-start;
  border-top-left-radius: 4px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.message.user {
  align-self: flex-end;
  border-top-left-radius: 20px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  background: rgba(59, 130, 246, 0.18);
}

.message-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.message-body {
  margin: 0;
  color: #eef2ff;
}

.chat-input-panel {
  display: grid;
  gap: 12px;
}

.input-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.input-hint {
  color: #94a3b8;
  font-size: 0.87rem;
}

.prompt-input {
  width: 100%;
  min-height: 50px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  padding: 14px 16px;
  resize: none;
  outline: none;
}

.send-row {
  display: flex;
  justify-content: flex-end;
}

.prompt-input::placeholder {
  color: #94a3b8;
}

.prompt-input:focus,
.control-select:focus,
button:focus {
  outline: 2px solid rgba(59, 130, 246, 0.4);
  outline-offset: 2px;
}

.btn {
  border: none;
  border-radius: 16px;
  padding: 14px 22px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
  box-shadow: 0 16px 32px rgba(72, 11, 133, 0.22);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #d1d5db;
}

.footer-note {
  margin: 0;
  color: #94a3b8;
  font-size: 0.93rem;
  text-align: center;
}

@media (max-width: 760px) {
  body {
    padding: 16px;
  }

  .chat-app {
    gap: 16px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .chat-window {
    min-height: 460px;
  }

  .message {
    width: 100%;
    max-width: 100%;
  }

  .chat-window-badge {
    width: 100%;
    text-align: left;
  }
}
`,
    'app.js': `const messagesEl = document.getElementById('messages');
const modelEl = document.getElementById('model');
const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const loginBtn = document.getElementById('login');
const authStatusEl = document.getElementById('auth-status');

const createMessage = (author, text, role) => {
  const container = document.createElement('div');
  container.className = `message ${role}`;

  const title = document.createElement('h3');
  title.className = 'message-title';
  title.textContent = author;
  container.appendChild(title);

  const body = document.createElement('p');
  body.className = 'message-body';
  body.textContent = text;
  container.appendChild(body);

  messagesEl.appendChild(container);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const refreshAuthStatus = async () => {
  if (!puter?.auth?.isSignedIn) {
    authStatusEl.textContent = 'Auth not available';
    loginBtn.disabled = true;
    return false;
  }

  try {
    const signed = await puter.auth.isSignedIn();
    let status = signed ? 'Signed in' : 'Not signed in';
    if (signed && puter.auth.getUser) {
      const user = await puter.auth.getUser();
      if (user?.name) {
        status = `Signed in as ${user.name}`;
      }
    }
    authStatusEl.textContent = status;
    if (loginBtn) {
      loginBtn.textContent = signed ? 'Signed in' : 'Sign in';
      loginBtn.disabled = signed;
    }
    return signed;
  } catch (error) {
    authStatusEl.textContent = 'Auth error';
    if (loginBtn) loginBtn.disabled = false;
    return false;
  }
};

const signIn = async () => {
  if (!puter?.auth?.signIn) {
    createMessage('Error', 'Authentication is not supported in this environment.', 'assistant');
    return;
  }

  try {
    await puter.auth.signIn();
    await refreshAuthStatus();
    createMessage('System', 'Signed in successfully. You can now send prompts.', 'assistant');
  } catch (error) {
    createMessage('Error', error?.message || 'Login failed or was canceled.', 'assistant');
  }
};

const setLoading = (isLoading) => {
  sendBtn.disabled = isLoading;
  sendBtn.textContent = isLoading ? 'Waiting for AI…' : 'Send prompt';
};

const getAccountingPrefix = () => {
  return `You are an expert accounting specialist with deep knowledge of CPA exam topics, accounting principles, financial reporting, auditing, and the history of accounting. Provide clear explanations, professional accounting guidance, and keep the discussion focused on accounting research, standards, and practice.`;
};

const sendPrompt = async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    promptEl.focus();
    return;
  }

  const signed = await refreshAuthStatus();
  if (!signed) {
    createMessage('System', 'Please sign in before sending prompts.', 'assistant');
    return;
  }

  createMessage('You', prompt, 'user');
  promptEl.value = '';
  setLoading(true);

  try {
    const promptWithInstructions = `${getAccountingPrefix()}\n\n${prompt}`;
    const model = modelEl.value;
    const response = await puter.ai.chat(promptWithInstructions, {
      model,
    });

    createMessage('Puter AI', response, 'assistant');
  } catch (error) {
    createMessage('Error', error?.message || 'Unable to get a response.', 'assistant');
  } finally {
    setLoading(false);
  }
};

const clearChat = () => {
  messagesEl.innerHTML = '';
  createMessage('System', 'New chat started. Choose a model, type your prompt, and press Send.', 'assistant');
};

const updateModelLabel = () => {
  const selectedModel = document.getElementById('selected-model');
  selectedModel.textContent = modelEl.value;
};

sendBtn.addEventListener('click', sendPrompt);
promptEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendPrompt();
  }
});
clearBtn.addEventListener('click', clearChat);
modelEl.addEventListener('change', updateModelLabel);
if (loginBtn) {
  loginBtn.addEventListener('click', signIn);
}

window.addEventListener('focus', async () => {
  await refreshAuthStatus();
});

window.addEventListener('load', async () => {
  updateModelLabel();
  await refreshAuthStatus();
  createMessage('System', 'New chat started. Sign in to use Puter AI, then send your prompt.', 'assistant');
});
`,
  };

  for (const [filename, content] of Object.entries(files)) {
    await puter.fs.write(`${directory}/${filename}`, content);
  }

  const subdomain = `nssf-ai-${puter.randName()}`;
  const site = await puter.hosting.create(subdomain, directory);
  puter.print(`Website hosted at: <a href="https://${site.subdomain}.puter.site" target="_blank">https://${site.subdomain}.puter.site</a>`);
})();
