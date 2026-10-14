import { readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const required = ['Home', 'Photo Gallery', 'Socials', 'About', 'Contact', 'dom.photography@icloud.com', 'Canon R6 Mark II', 'Turnov Square'];
const missing = required.filter((value) => !html.includes(value));
if (missing.length) throw new Error(`Missing required site content: ${missing.join(', ')}`);
const biography = `Hello there! I’m Dominik, a student from the Czech Republic with a passion for photography, aviation and just how things generally work.\nI mainly find interest in photography, especially commercial aviation, nature, wildlife and a sprinkle of architecture, but I also enjoy experimenting with electronics and new technologies, and working on projects that combine creativity with engineering. Heh, like this website.\n\nI’m only 13 years old, so I’m just a teen, but that doesn’t stop me!\nI grew up and live in the beautiful town of Turnov, Czechia. It is located in the Liberec Region, about 21 kilometers south-southeast of Liberec.\nMy birthday is 25th September, 2013.\n\nThis is just my little corner on the internet where I share my interests and photography.\nThanks for stopping by, and I hope to see you again!`;
for (const line of biography.split('\n')) if (!html.includes(line)) throw new Error(`Biography text missing: ${line}`);
console.log('Site content checks passed.');
