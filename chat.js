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

const logEl = document.getElementById('log');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');
const chipListEl = document.getElementById('chip-list');

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
	return `${fallback} Ask about feeding, enrichment, health, or behavior for more.`;
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

renderChips();
appendMessage('bot', 'Hi! Ask me about laptops, phones, TVs, gaming gear, price match, shipping, or returns.');
git status
