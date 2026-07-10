import { downloadText } from '../../utils/download.js';

const EXTENSIONS = {
  JavaScript: 'js', TypeScript: 'ts', HTML: 'html', CSS: 'css', JSON: 'json', Bash: 'sh', PHP: 'php', Python: 'py', SQL: 'sql', Markdown: 'md', Other: 'txt'
};

function fileNameFrom(title, language) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'snippet';
  return `${slug}.${EXTENSIONS[language] || 'txt'}`;
}

export const CodeExportService = {
  exportSnippet(snippet) {
    downloadText(fileNameFrom(snippet.title, snippet.language), snippet.code, 'text/plain');
  },
  exportGistFormat(snippets) {
    const files = Object.fromEntries(snippets.map((snippet) => [fileNameFrom(snippet.title, snippet.language), { content: snippet.code, language: snippet.language, description: snippet.description }]));
    downloadText('codesnap-gist-export.json', JSON.stringify({ description: 'CodeSnap JS export', public: false, files }, null, 2), 'application/json');
  }
};
