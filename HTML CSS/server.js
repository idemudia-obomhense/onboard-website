const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app        = express();
const PORT       = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(__dirname));

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  const users = loadUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ success: false, message: 'This email is already registered.' });
  }

  const user = {
    firstName,
    lastName: lastName || '',
    email,
    registeredAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  console.log(`New registration: ${firstName} ${lastName} <${email}>`);
  res.json({ success: true, message: 'Account created successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/signup.html`);
});
