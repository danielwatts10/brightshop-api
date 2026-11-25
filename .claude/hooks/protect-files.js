#!/usr/bin/env node
// Blocks Claude from editing files the platform team owns.
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let p = '';
  try { p = (JSON.parse(input).tool_input || {}).file_path || ''; } catch { process.exit(0); }
  p = p.replace(/\\/g, '/');
  const hit = ['.env', 'package-lock.json', '.github/workflows/', '.git/'].find((x) => p.includes(x));
  if (hit) {
    console.error(`Blocked by BrightShop policy: ${p} matches protected path '${hit}'. CI pipelines, secrets and lockfiles are owned by the platform team.`);
    process.exit(2);
  }
  process.exit(0);
});
