const nodes = require('../nodes/inline.js');
const helper = require('./helper.js');

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
  const html = [];

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
          i++;
          if (text[i + 1] === '*') {
            i++;
            if (mode === MODE_ASTERISK_TRIPLE) {
              ast.push(new nodes.EmItalic(stack));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new nodes.Text(stack));
              }
              mode = MODE_ASTERISK_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_ASTERISK_DOUBLE) {
              ast.push(new nodes.Em(stack));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new nodes.Text(stack));
              }
              mode = MODE_ASTERISK_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_ASTERISK) {
          ast.push(new nodes.Italic(stack));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new nodes.Text(stack));
          }
          mode = MODE_ASTERISK;
        }
        stack = '';
        continue;
      case "_":
        if (text[i + 1] === '_') {
          i++;
          if (text[i + 1] === '_') {
            i++;
            if (mode === MODE_UNDERLINE_TRIPLE) {
              ast.push(new nodes.EmItalic(stack));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new nodes.Text(stack));
              }
              mode = MODE_UNDERLINE_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_UNDERLINE_DOUBLE) {
              ast.push(new nodes.Em(stack));
              mode = MODE_DEFAULT;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new nodes.Text(stack));
              }
              mode = MODE_UNDERLINE_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_UNDERLINE) {
          ast.push(new nodes.Italic(stack));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new nodes.Text(stack));
          }
          mode = MODE_UNDERLINE;
        }
        stack = '';
        continue;
      case "~":
        if (text[i + 1] === '~') {
          i++;
          if (mode === MODE_STRIKETHROUGH) {
            ast.push(new nodes.Strikethrough(stack));
            mode = MODE_DEFAULT;
          } else {
            if (!helper.isEmpty(stack)) {
              ast.push(new nodes.Text(stack));
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
          ast.push(new nodes.InlineCode(stack));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new nodes.Text(stack));
          }
          mode = MODE_INLINE_CODE;
        }
        stack = '';
        continue;
      case "<":
        if (!helper.isEmpty(stack)) {
          if (html.length === 0) {
            ast.push(new nodes.Text(stack));
          } else {
            html[html.length - 1] += stack;
          }
          stack = '';
        }
        let c = char;
        do {
          stack += c;
          c = text[++i];
        } while(c != ">");
        stack += c;
        if (stack[1] === '/') {
          const h = html.pop() + stack;
          ast.push(new nodes.Html(h));
        } else if (stack[1] === '!') {
          ast.push(new nodes.HtmlComment(stack));
        } else {
          html.push(stack);
        }
        stack = '';
        continue;
      case "!":
        if (!helper.isEmpty(stack)) {
          ast.push(new nodes.Text(stack));
        }
        stack = '';
        mode = MODE_IMAGE;
        stack = char;
        continue;
      case "[":
        if (mode !== MODE_IMAGE) {
          if (!helper.isEmpty(stack)) {
            ast.push(new nodes.Text(stack));
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
          ast.push(new nodes.Image(stack));
          mode = MODE_DEFAULT;
          stack = '';
        } else if (mode === MODE_LINK) {
          ast.push(new nodes.Link(stack));
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
    const prev = ast[ast.length - 1];
    if (!prev || mode === MODE_DEFAULT) {
      ast.push(new nodes.Text(stack));
    } else {
      let prefix = '';
      switch (mode) {
        case MODE_ASTERISK: prefix = '*'; break;
        case MODE_ASTERISK_DOUBLE: prefix = '**'; break;
        case MODE_ASTERISK_TRIPLE: prefix = '**'; break;
        case MODE_UNDERLINE: prefix = '_'; break;
        case MODE_UNDERLINE_DOUBLE: prefix = '__'; break;
        case MODE_UNDERLINE_TRIPLE: prefix = '___'; break;
        case MODE_STRIKETHROUGH: prefix = '~~'; break;
        case MODE_INLINE_CODE: prefix = '`'; break;
      }
      prev.value += `${prefix}${stack}`;
    }
  }
  return ast;
};
