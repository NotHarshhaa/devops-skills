#!/usr/bin/env node

/**
 * Validation script for devops-skills.
 * Ensures all skills conform to the contract, links resolve, and plugin manifests are in sync.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

function logError(msg) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  errors++;
}

function logWarning(msg) {
  console.warn(`\x1b[33m[WARN]\x1b[0m  ${msg}`);
  warnings++;
}

function logSuccess(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

console.log('\n=== Validating DevOps Skills Repository ===\n');

// 1. Discover all skills on disk
const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
const skillDirs = entries
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(ROOT_DIR, e.name, 'SKILL.md')))
  .map((e) => e.name);

console.log(`Found ${skillDirs.length} skills: ${skillDirs.join(', ')}\n`);

// 2. Validate .claude-plugin/plugin.json
const pluginJsonPath = path.join(ROOT_DIR, '.claude-plugin', 'plugin.json');
if (!fs.existsSync(pluginJsonPath)) {
  logError('.claude-plugin/plugin.json does not exist');
} else {
  try {
    const pluginContent = fs.readFileSync(pluginJsonPath, 'utf8');
    const pluginData = JSON.parse(pluginContent);

    if (!Array.isArray(pluginData.skills)) {
      logError('.claude-plugin/plugin.json is missing the "skills" array');
    } else {
      // Check each skill directory is in plugin.json
      for (const skill of skillDirs) {
        const expectedEntry = `./${skill}`;
        if (!pluginData.skills.includes(expectedEntry)) {
          logError(`.claude-plugin/plugin.json skills array is missing "${expectedEntry}"`);
        }
      }

      // Check each entry in plugin.json exists
      for (const entry of pluginData.skills) {
        const fullSkillPath = path.resolve(ROOT_DIR, entry, 'SKILL.md');
        if (!fs.existsSync(fullSkillPath)) {
          logError(`.claude-plugin/plugin.json references "${entry}", but ${fullSkillPath} does not exist`);
        }
      }

      logSuccess('.claude-plugin/plugin.json is valid and in sync with skills on disk');
    }
  } catch (err) {
    logError(`.claude-plugin/plugin.json is invalid JSON: ${err.message}`);
  }
}

// 3. Validate each SKILL.md
console.log('\n--- Validating SKILL.md files ---');
for (const skill of skillDirs) {
  const skillFile = path.join(ROOT_DIR, skill, 'SKILL.md');
  const content = fs.readFileSync(skillFile, 'utf8');

  // Check frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    logError(`${skill}/SKILL.md is missing YAML frontmatter`);
    continue;
  }

  const fm = fmMatch[1];
  const nameMatch = fm.match(/name:\s*([^\r\n]+)/);
  const descMatch = fm.match(/description:\s*([^\r\n]+)/);

  if (!nameMatch) {
    logError(`${skill}/SKILL.md frontmatter missing 'name'`);
  } else {
    const name = nameMatch[1].trim();
    if (name !== skill) {
      logError(`${skill}/SKILL.md 'name' (${name}) does not match directory (${skill})`);
    }
  }

  if (!descMatch) {
    logError(`${skill}/SKILL.md frontmatter missing 'description'`);
  } else {
    const desc = descMatch[1].trim();
    if (!desc.includes('Use when asked')) {
      logWarning(`${skill}/SKILL.md description should include "Use when asked ..." trigger phrases`);
    }
  }

  // Check line count
  const lines = content.split('\n').length;
  if (lines > 250) {
    logWarning(`${skill}/SKILL.md is ${lines} lines long (recommended: 120-200 lines)`);
  } else {
    logSuccess(`${skill}/SKILL.md is well-formed (${lines} lines)`);
  }
}

// 4. Validate relative markdown links across all .md files
console.log('\n--- Validating Markdown Relative Links ---');
function getAllMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    if (item.name === '.git' || item.name === 'node_modules') continue;
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allMdFiles = getAllMarkdownFiles(ROOT_DIR);
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

for (const mdFile of allMdFiles) {
  const content = fs.readFileSync(mdFile, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[2].trim();
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('#')) {
      continue;
    }

    const [filePath] = target.split('#');
    if (!filePath) continue;

    const resolved = path.resolve(path.dirname(mdFile), filePath);
    if (!fs.existsSync(resolved)) {
      logError(`Broken link in ${path.relative(ROOT_DIR, mdFile)}: "${target}" -> "${path.relative(ROOT_DIR, resolved)}" not found`);
    }
  }
}
logSuccess(`Verified relative links across ${allMdFiles.length} Markdown files`);

// 5. Verify routing tables in README.md and docs/skill-contract.md
console.log('\n--- Validating Routing & Documentation ---');
const readmeContent = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');
const contractContent = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'skill-contract.md'), 'utf8');

for (const skill of skillDirs) {
  if (!readmeContent.includes(`/${skill}`)) {
    logError(`README.md does not reference skill "/${skill}"`);
  }
  if (!contractContent.includes(`/${skill}`)) {
    logError(`docs/skill-contract.md does not reference skill "/${skill}"`);
  }
}
logSuccess('All skills are registered in README.md and docs/skill-contract.md');

// Summary
console.log('\n===========================================');
if (errors === 0) {
  console.log(`\x1b[32mSUCCESS: All checks passed with ${warnings} warning(s).\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31mFAILURE: Found ${errors} error(s) and ${warnings} warning(s).\x1b[0m\n`);
  process.exit(1);
}
