import { rm } from 'node:fs/promises';
await rm('lib', { recursive: true, force: true });
console.log('lib/ supprimé → package source-only ✓');