const LS_USERS_KEY = 'electro_users';
const LS_SESSION_KEY = 'electro_session';

const defaultPrompts = [
	{
		question: 'Which laptop is good for programming?',
		answer:
			'Look for at least 16GB RAM, a recent-gen Ryzen 7 or Intel i7, fast SSD, and a matte 14-15" display. If you need GPU work, pick RTX 4060+ with good cooling.'
	},
	{
		question: 'Best phone for photos under $800?',
		answer:
			'The Pixel line is great for computational photography. Consider storage (128GB+), battery life, and if you need telephoto. Check carrier bands before buying.'
	},
	{
		question: 'What TV size for my room?',
		answer:
			'For a 7-9 ft viewing distance, 55-65" works well. Prioritize OLED for dark rooms or mid/high-tier QLED for bright rooms. Look for 120Hz if you game.'
	},
	{
		question: 'Do you price match?',
		answer:
			'Yes, we price match major retailers on identical items in stock at both stores. Bring the live listing at checkout; exclusions include clearance and refurb.'
	},
	{
		question: 'What is the return policy?',
		answer:
			'Most electronics have a 30-day return window with receipt and original packaging. Drones, VR, and opened software may have shorter or final-sale terms.'
	},
	{
		question: 'How long is the warranty?',
		answer:
			'Most new electronics carry a 1-year manufacturer warranty. We offer extended protection plans that cover hardware defects and certain accidental damage.'
	}
];

const quickFacts = [
	'USB-C PD chargers vary: match wattage to your laptop; 65W suits ultrabooks, 100W+ for larger GPUs.',
	'OLED looks best in dim rooms; QLED/Mini-LED handle bright rooms better.',
	'For Wi-Fi, place the router centrally and elevate it; 5 GHz is faster but has shorter range than 2.4 GHz.',
	'NVMe SSDs speed up boot and app loads; external SSDs over USB-C are great for backups.',
	'Noise-cancelling headphones work best on steady noises like engines or HVAC.'
];

const authCardEl = document.getElementById('auth-card');
const appShellEl = document.getElementById('app-shell');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const userEmailLabel = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupNameInput = document.getElementById('signup-name');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

const logEl = document.getElementById('log');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');
const chipListEl = document.getElementById('chip-list');

function loadUsers() {
	try {
		const raw = localStorage.getItem(LS_USERS_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch (err) {
		console.error('Failed to parse users from storage', err);
		return [];
	}
}

function saveUsers(users) {
	localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

function setSession(email) {
	localStorage.setItem(LS_SESSION_KEY, email);
}

function clearSession() {
	localStorage.removeItem(LS_SESSION_KEY);
}

function resetChatLog() {
	while (logEl.firstChild) {
		logEl.removeChild(logEl.firstChild);
	}
}

function showApp(email) {
	authCardEl.classList.add('hidden');
	appShellEl.classList.remove('hidden');
	userEmailLabel.textContent = email;
}

function showAuth() {
	appShellEl.classList.add('hidden');
	authCardEl.classList.remove('hidden');
	loginForm.classList.remove('hidden');
	signupForm.classList.add('hidden');
	tabLogin.classList.add('active');
	tabSignup.classList.remove('active');
	resetChatLog();
}

function appendMessage(role, text) {
	const wrap = document.createElement('div');
	wrap.className = `msg ${role}`;

	const label = document.createElement('span');
	label.className = 'label';
	label.textContent = role === 'user' ? 'You' : 'ElectroBot';

	const content = document.createElement('div');
	content.textContent = text;

	wrap.appendChild(label);
	wrap.appendChild(content);
	logEl.appendChild(wrap);
	logEl.scrollTop = logEl.scrollHeight;
}

function pickCannedAnswer(message) {
	const lower = message.toLowerCase();
	const matched = defaultPrompts.find(({ question }) => lower.includes(question.toLowerCase().slice(0, 8)));
	if (matched) return matched.answer;

	const keywordMatch = defaultPrompts.find(({ question }) => {
		return question
			.toLowerCase()
			.split(' ')
			.some((word) => word.length > 3 && lower.includes(word));
	});

	if (keywordMatch) return keywordMatch.answer;
	const fallback = quickFacts[Math.floor(Math.random() * quickFacts.length)];
	return `${fallback} Ask about laptops, phones, TVs, gaming gear, or store policies for more.`;
}

function handleUserMessage(message) {
	if (!message.trim()) return;
	appendMessage('user', message.trim());
	const reply = pickCannedAnswer(message.trim());
	appendMessage('bot', reply);
	inputEl.value = '';
}

function renderChips() {
	defaultPrompts.forEach(({ question }) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'chip';
		btn.textContent = question;
		btn.addEventListener('click', () => handleUserMessage(question));
		chipListEl.appendChild(btn);
	});
}

formEl.addEventListener('submit', (evt) => {
	evt.preventDefault();
	handleUserMessage(inputEl.value || '');
});

function switchTab(mode) {
	if (mode === 'login') {
		loginForm.classList.remove('hidden');
		signupForm.classList.add('hidden');
		tabLogin.classList.add('active');
		tabSignup.classList.remove('active');
	} else {
		loginForm.classList.add('hidden');
		signupForm.classList.remove('hidden');
		tabLogin.classList.remove('active');
		tabSignup.classList.add('active');
	}
}

tabLogin.addEventListener('click', () => switchTab('login'));
tabSignup.addEventListener('click', () => switchTab('signup'));

loginForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const email = (loginEmailInput.value || '').trim().toLowerCase();
	const password = (loginPasswordInput.value || '').trim();
	if (!email || !password) return;

	const users = loadUsers();
	const found = users.find((u) => u.email === email && u.password === password);
	if (!found) {
		alert('Invalid credentials.');
		return;
	}

	setSession(email);
	window.location.href = 'home.html';
});

signupForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const name = (signupNameInput.value || '').trim();
	const email = (signupEmailInput.value || '').trim().toLowerCase();
	const password = (signupPasswordInput.value || '').trim();
	if (!name || !email || password.length < 6) {
		alert('Please provide name, email, and a password with at least 6 characters.');
		return;
	}

	const users = loadUsers();
	if (users.some((u) => u.email === email)) {
		alert('An account with that email already exists.');
		return;
	}

	users.push({ name, email, password });
	saveUsers(users);
	setSession(email);
	window.location.href = 'home.html';
});

logoutBtn.addEventListener('click', () => {
	clearSession();
	showAuth();
});

renderChips();

const existingSession = localStorage.getItem(LS_SESSION_KEY);
if (existingSession) {
	showApp(existingSession);
	appendMessage('bot', 'Hi! Ask me about laptops, phones, TVs, gaming gear, price match, shipping, or returns.');
} else {
	showAuth();
}
