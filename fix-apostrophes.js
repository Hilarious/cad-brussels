#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Strategy: scan the file character by character and fix string delimiters.
 *
 * Rules:
 * 1. If a string starts with ' (ASCII 0x27) and contains ' (U+2019, curly quote) or " (U+201C/U+201D),
 *    convert it to "..." (double quotes) and escape any internal " as needed.
 * 2. If a string has both ' and " (double-quote), use backticks.
 * 3. Keep short strings like 'fr', 'en', 'event' as single quotes if no apostrophe.
 */

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let result = '';
  let i = 0;

  while (i < src.length) {
    const char = src[i];

    // Check if this is the start of a string literal with single quote
    if (char === "'" && (i === 0 || /[\s,({[\];:=!&|?]/.test(src[i-1]))) {
      // Find the closing quote
      let j = i + 1;
      let content = '';
      let hasTypoApostrophe = false;  // U+2019 '
      let hasTypoQuote = false;       // U+201C " or U+201D "
      let hasDoubleQuote = false;     // ASCII "
      let closed = false;

      // Scan to find the end of the string and check what's inside
      while (j < src.length) {
        if (src[j] === "'" && src[j-1] !== '\\') {
          closed = true;
          content = src.substring(i + 1, j);
          break;
        }
        j++;
      }

      if (!closed) {
        // Malformed string, just copy char and move on
        result += char;
        i++;
        continue;
      }

      // Check content for problematic characters
      for (let k = 0; k < content.length; k++) {
        const c = content[k];
        if (c === ''') hasTypoApostrophe = true;      // U+2019 right single quotation mark
        if (c === '"' || c === '"') hasTypoQuote = true; // U+201C, U+201D
        if (c === '"') hasDoubleQuote = true;              // ASCII double quote
      }

      // Decide the delimiter
      let newDelim = "'";  // default: keep as is

      if (hasTypoApostrophe || hasTypoQuote) {
        // Must change from single quotes
        if (hasDoubleQuote) {
          // Use backticks if there are both " and ' issues
          newDelim = '`';
        } else {
          // Use double quotes
          newDelim = '"';
          // Escape any ASCII double-quotes inside
          content = content.replace(/"/g, '\\"');
        }
      }

      if (newDelim !== "'") {
        // Emit the fixed string
        result += newDelim + content + newDelim;
        i = j + 1;  // Skip past the closing quote
      } else {
        // No change needed
        result += src.substring(i, j + 1);
        i = j + 1;
      }

    } else {
      result += char;
      i++;
    }
  }

  return result;
}

// Process both files
const files = [
  './scripts/seed.ts',
  './scripts/seed-extras.ts'
];

files.forEach(filePath => {
  console.log(`Fixing ${filePath}...`);
  const fixed = fixFile(filePath);
  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log(`✓ ${filePath} fixed`);
});
