export const SNIPPET_TEMPLATES = [
  {
    id: 'tpl-fetch-json',
    name: 'Fetch JSON API',
    language: 'JavaScript',
    category: 'API',
    description: 'Reusable async fetch helper with error handling.',
    tags: ['fetch', 'api', 'async'],
    code: `async function getJSON(url, options = {}) {\n  const response = await fetch(url, {\n    headers: { 'Content-Type': 'application/json' },\n    ...options\n  });\n\n  if (!response.ok) {\n    throw new Error(\`Request failed: \${response.status}\`);\n  }\n\n  return response.json();\n}`
  },
  {
    id: 'tpl-debounce',
    name: 'Debounce Function',
    language: 'JavaScript',
    category: 'Utility',
    description: 'Delay function execution until the user stops triggering it.',
    tags: ['utility', 'performance'],
    code: `function debounce(callback, delay = 300) {\n  let timerId;\n\n  return (...args) => {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => callback(...args), delay);\n  };\n}`
  },
  {
    id: 'tpl-card-css',
    name: 'Responsive Card CSS',
    language: 'CSS',
    category: 'Frontend',
    description: 'Clean card component style.',
    tags: ['css', 'ui', 'card'],
    code: `.card {\n  border: 1px solid #e2e8f0;\n  border-radius: 18px;\n  padding: 1rem;\n  background: #ffffff;\n  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);\n}`
  },
  {
    id: 'tpl-html-starter',
    name: 'HTML Starter',
    language: 'HTML',
    category: 'Frontend',
    description: 'Simple accessible HTML page starter.',
    tags: ['html', 'starter'],
    code: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Document</title>\n  </head>\n  <body>\n    <main>\n      <h1>Hello World</h1>\n    </main>\n  </body>\n</html>`
  }
];

export const PLAYGROUND_STARTER = {
  html: `<main class="demo-card">\n  <h1>Hello CodeSnap</h1>\n  <p>Edit HTML, CSS, and JavaScript to test ideas quickly.</p>\n  <button id="demoBtn">Click me</button>\n</main>`,
  css: `.demo-card {\n  font-family: system-ui, sans-serif;\n  max-width: 420px;\n  margin: 40px auto;\n  padding: 24px;\n  border-radius: 20px;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n}\n\nbutton {\n  padding: 10px 14px;\n  border: 0;\n  border-radius: 10px;\n  background: #2563eb;\n  color: white;\n}`,
  js: `document.getElementById('demoBtn')?.addEventListener('click', () => {\n  alert('Playground is working!');\n});`
};
