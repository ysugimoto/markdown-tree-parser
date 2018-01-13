const nodes = require('./nodes.js');
const helper = require('../helper.js');

const MODE_DEFAULT = 0;
const MODE_ASTERISK = 1;
const MODE_ASTERISK_DOUBLE = 2;
const MODE_ASTERISK_TRIPLE = 3;
const MODE_UNDERLINE = 4;
const MODE_UNDERLINE_DOUBLE = 5;
const MODE_UNDERLINE_TRIPLE = 6;
const MODE_STRIKETHROUGH = 7;
const MODE_IMAGE = 8;
const MODE_LINK = 9;
const MODE_INLINE_CODE = 10;

module.exports = text => {
  const ast = [];

  let stack = '';
  let mode = MODE_DEFAULT;
  let escapeSequence = false;
  let match;

  for (let i = 0; i < text.length; ++i) {
    const char = text[i];

    if (escapeSequence === true) {
      stack += char;
      escapeSequence = false;
      continue;
    }

    switch (char) {
      case "*":
        if (text[i + 1] === '*') {
          i++
          if (text[i + 1] === '*') {
            i++
            if (mode === MODE_ASTERISK_TRIPLE) {
              ast.push(nodes.inline(stack, 'emitalic'));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(nodes.inline(stack));
              }
              mode = MODE_ASTERISK_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_ASTERISK_DOUBLE) {
              ast.push(nodes.inline(stack, 'em'));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(nodes.inline(stack));
              }
              mode = MODE_ASTERISK_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_ASTERISK) {
          ast.push(nodes.inline(stack, 'italic'));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(nodes.inline(stack));
          }
          mode = MODE_ASTERISK;
        }
        stack = '';
        continue;
      case "_":
        if (text[i + 1] === '_') {
          i++
          if (text[i + 1] === '_') {
            i++
            if (mode === MODE_UNDERLINE_TRIPLE) {
              ast.push(nodes.inline(stack, 'emitalic'));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(nodes.inline(stack));
              }
              mode = MODE_UNDERLINE_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_UNDERLINE_DOUBLE) {
              ast.push(nodes.inline(stack, 'em'));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(nodes.inline(stack));
              }
              mode = MODE_UNDERLINE_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_UNDERLINE) {
          ast.push(nodes.inline(stack, 'italic'));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(nodes.inline(stack));
          }
          mode = MODE_UNDERLINE;
        }
        stack = '';
        continue;
      case "~":
        if (text[i + 1] === '~') {
          i++
          if (mode === MODE_STRIKETHROUGH) {
            ast.push(nodes.inline(stack, 'strikethrough'));
            mode = MODE_DEFAULT;
          } else {
            if (!helper.isEmpty(stack)) {
              ast.push(nodes.inline(stack));
            }
            mode = MODE_STRIKETHROUGH;
          }
          stack = '';
          continue;
        }
        stack += char;
        continue;
      case "`":
        if (mode === MODE_INLINE_CODE) {
          ast.push(nodes.inline(stack, 'code'));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(nodes.inline(stack));
          }
          mode = MODE_INLINE_CODE;
        }
        stack ='';
        continue;
      case "!":
        if (!helper.isEmpty(stack)) {
          ast.push(nodes.inline(stack));
        }
        stack = '';
        mode = MODE_IMAGE;
        stack = char;
        continue;
      case "[":
        if (mode !== MODE_IMAGE) {
          if (!helper.isEmpty(stack)) {
            ast.push(nodes.inline(stack));
          }
          mode = MODE_LINK;
          stack = char;
          continue
        }
        stack += char;
        continue;
      case ")":
        stack += char;
        if (mode === MODE_IMAGE) {
          ast.push(nodes.image(stack));
          mode = MODE_DEFAULT;
          stack = '';
        } else if (mode === MODE_LINK) {
          ast.push(nodes.link(stack));
          mode = MODE_DEFAULT;
          stack = '';
        } else {
          stack += char;
        }
        continue;
      case "\\":
        escapeSequence = true;
        continue;
      default:
        stack += char;
        break;
    }
  }
  if (!helper.isEmpty(stack)) {
    ast.push(nodes.inline(stack));
  }
  return ast;
};
