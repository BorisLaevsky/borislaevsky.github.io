const links = document.querySelectorAll('.menu a');
const panels = document.querySelectorAll('.panel');

links.forEach(link => {
  link.addEventListener('click', () => {

    if (link.classList.contains('active')) {
      window.scrollTo(0, 0);
      return;
    }

    const targetId = link.getAttribute('data-target');

    panels.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    link.classList.add('active');

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    window.scrollTo(0, 0);
  });
});

// CHAT logic
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('messages');

async function fetchMessages() {
  try {
    // Check whether the user is already near the bottom
    const firstLoad = chatMessages.children.length === 0;
    const wasNearBottom =
      chatMessages.scrollHeight -
      chatMessages.scrollTop -
      chatMessages.clientHeight < 100;

    const res = await fetch('https://simple-chat-backend-5ypk.onrender.com/messages');
    const data = await res.json();

    chatMessages.innerHTML = data
      .map(
        msg =>
          `<div class="message"><span class="name">${msg.name}:</span> ${msg.message}</div>`
      )
      .join('');

    // Only auto-scroll on first load or if user was already at the bottom
    if (firstLoad || wasNearBottom) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (err) {
    console.error(err);
  }
}

// Fetch messages every 3 seconds
setInterval(fetchMessages, 3000);
fetchMessages();

// Handle form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('chat-name').value.trim();
  const message = document.getElementById('chat-text').value.trim();

  if (!name || !message) return;

  try {
    await fetch('https://simple-chat-backend-5ypk.onrender.com/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, message })
    });

    document.getElementById('chat-text').value = '';

    // Refresh immediately after sending
    fetchMessages();
  } catch (err) {
    console.error(err);
  }
});
