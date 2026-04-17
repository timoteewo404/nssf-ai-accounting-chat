const messagesEl = document.getElementById('messages');
const modelEl = document.getElementById('model');
const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const loginBtn = document.getElementById('login');
const authStatusEl = document.getElementById('auth-status');
const imageUploadEl = document.getElementById('image-upload');
const imagePreviewEl = document.getElementById('image-preview');
const imageNameEl = document.getElementById('image-name');
let selectedImageFile = null;

const validModels = ['gpt-5.4-nano', 'gpt-5.4', 'gpt-5.3-nano', 'gpt-4o'];

const getAccountingPrefix = () => {
  return `You are an expert accounting specialist with deep knowledge of CPA exam topics, accounting principles, financial reporting, auditing, and the history of accounting. Provide clear explanations, professional accounting guidance, and keep the discussion focused on accounting research, standards, and practice.`;
};

const createMessage = (author, text, role, imageFile = null) => {
  const container = document.createElement('div');
  container.className = `message ${role}`;

  const title = document.createElement('h3');
  title.className = 'message-title';
  title.textContent = author;
  container.appendChild(title);

  if (text) {
    const body = document.createElement('p');
    body.className = 'message-body';
    body.textContent = text;
    container.appendChild(body);
  }

  if (imageFile) {
    const preview = document.createElement('img');
    preview.className = 'message-image';
    preview.alt = imageFile.name || 'Attached image';
    preview.src = URL.createObjectURL(imageFile);
    preview.onload = () => URL.revokeObjectURL(preview.src);
    container.appendChild(preview);
  }

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

const buildPrompt = (text, imageFile) => {
  if (!imageFile) {
    return text;
  }

  if (!text) {
    return 'An image has been attached for my reference, but this version of the AI cannot interpret image content. Please answer based on the available text input.';
  }

  return `${text}\n\nNote: an image is attached for reference only and cannot be analyzed by this AI.`;
};

const renderImagePreview = () => {
  imagePreviewEl.innerHTML = '';
  if (imageNameEl) {
    imageNameEl.textContent = selectedImageFile ? selectedImageFile.name : 'No image selected';
  }

  if (!selectedImageFile) {
    return;
  }

  const imagePreview = document.createElement('img');
  imagePreview.src = URL.createObjectURL(selectedImageFile);
  imagePreview.alt = selectedImageFile.name || 'Selected image';
  imagePreview.onload = () => URL.revokeObjectURL(imagePreview.src);
  imagePreviewEl.appendChild(imagePreview);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'image-remove-btn';
  removeButton.textContent = 'Remove image';
  removeButton.addEventListener('click', () => {
    selectedImageFile = null;
    imageUploadEl.value = '';
    renderImagePreview();
  });
  imagePreviewEl.appendChild(removeButton);
};

const sendPrompt = async ({ promptOverride = null } = {}) => {
  const promptText = promptOverride !== null ? promptOverride.trim() : promptEl.value.trim();
  if (!promptText && !selectedImageFile) {
    promptEl.focus();
    return;
  }

  const signed = await refreshAuthStatus();
  if (!signed) {
    createMessage('System', 'Please sign in before sending prompts.', 'assistant');
    return;
  }

  const imageFile = selectedImageFile;
  const userText = promptText || (imageFile ? 'An image is attached for reference only; this AI cannot interpret image content.' : '');
  createMessage('You', userText, 'user', imageFile);
  promptEl.value = '';
  setLoading(true);

  try {
    const prompt = buildPrompt(promptText, imageFile);
    const promptWithInstructions = `${getAccountingPrefix()}\n\n${prompt}`;
    let model = modelEl.value;
    if (!validModels.includes(model)) {
      model = 'gpt-5.4';
      createMessage('System', 'The selected model is not available; switching to gpt-5.4.', 'assistant');
    }
    const options = { model };

    const response = await puter.ai.chat(promptWithInstructions, options);
    const assistantText = typeof response === 'string'
      ? response
      : response?.message?.content ?? response?.choices?.map(c => c?.message?.content ?? c?.text).filter(Boolean).join('\n') ?? JSON.stringify(response, null, 2);
    createMessage('Puter AI', assistantText, 'assistant');
  } catch (error) {
    const errorText = error?.message || error?.toString?.() || 'Unable to get a response.';
    createMessage('Error', `Unable to get a response. ${errorText}`, 'assistant');
    console.error('Chat request failed:', error);
  } finally {
    setLoading(false);
    selectedImageFile = null;
    if (imageUploadEl) imageUploadEl.value = '';
    renderImagePreview();
  }
};

const clearChat = () => {
  messagesEl.innerHTML = '';
  selectedImageFile = null;
  if (imageUploadEl) imageUploadEl.value = '';
  renderImagePreview();
  createMessage('System', 'New chat started. Choose a model, type your prompt, and press Send.', 'assistant');
};

const updateModelLabel = () => {
  const selectedModel = document.getElementById('selected-model');
  selectedModel.textContent = modelEl.value;
};

sendBtn.addEventListener('click', () => sendPrompt());
promptEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendPrompt();
  }
});
clearBtn.addEventListener('click', clearChat);
modelEl.addEventListener('change', updateModelLabel);
if (imageUploadEl) {
  imageUploadEl.addEventListener('change', (event) => {
    selectedImageFile = event.target.files?.[0] || null;
    renderImagePreview();
  });
}
if (loginBtn) {
  loginBtn.addEventListener('click', signIn);
}

window.addEventListener('focus', async () => {
  await refreshAuthStatus();
});

window.addEventListener('load', async () => {
  updateModelLabel();
  renderImagePreview();
  await refreshAuthStatus();
  createMessage('System', 'New chat started. Sign in to use Puter AI, then send your prompt.', 'assistant');
});
