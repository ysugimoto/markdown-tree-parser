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

const EMPTRY_REGEX = /^\s*$/;
const IMAGE_REGEX = /^!\[([^\]]*)?\]\(([^\)]+)\)$/;
const LINK_REGEX = /^\[([^\]]*)?\]\(([^\)]+)\)$/;

const inlineNode = (text, name = 'text') => ({
  name,
  type: 'inline',
  value: text
});

const imageNode = text => {
  const match = text.match(IMAGE_REGEX);
  if (!match) {
    throw new Error(`Invalid image syntax: ${text}`);
  }
  return {
    name: 'image',
    type: 'inline',
    alt: match[1] || '',
    src: match[2] || ''
  };
};

const linkNode = text => {
  const match = text.match(LINK_REGEX);
  if (!match) {
    throw new Error(`Invalid link syntax: ${text}`);
  }
  return {
    name: 'link',
    type: 'inline',
    title: match[1] || '',
    href: match[2] || ''
  };
};

const isEmpty = stack => {
  return stack.length === 0 || EMPTRY_REGEX.test(stack);
};

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
              ast.push(inlineNode(stack, 'emitalic'));
              mode = MODE_DEFAULT;
            } else {
              if (!isEmpty(stack)) {
                ast.push(inlineNode(stack));
              }
              mode = MODE_ASTERISK_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_ASTERISK_DOUBLE) {
              ast.push(inlineNode(stack, 'em'));
              mode = MODE_DEFAULT;
            } else {
              if (!isEmpty(stack)) {
                ast.push(inlineNode(stack));
              }
              mode = MODE_ASTERISK_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_ASTERISK) {
          ast.push(inlineNode(stack, 'italic'));
          mode = MODE_DEFAULT;
        } else {
          if (!isEmpty(stack)) {
            ast.push(inlineNode(stack));
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
              ast.push(inlineNode(stack, 'emitalic'));
              mode = MODE_DEFAULT;
            } else {
              if (!isEmpty(stack)) {
                ast.push(inlineNode(stack));
              }
              mode = MODE_UNDERLINE_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_UNDERLINE_DOUBLE) {
              ast.push(inlineNode(stack, 'em'));
              mode = MODE_DEFAULT;
            } else {
              if (!isEmpty(stack)) {
                ast.push(inlineNode(stack));
              }
              mode = MODE_UNDERLINE_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_UNDERLINE) {
          ast.push(inlineNode(stack, 'italic'));
          mode = MODE_DEFAULT;
        } else {
          if (!isEmpty(stack)) {
            ast.push(inlineNode(stack));
          }
          mode = MODE_UNDERLINE;
        }
        stack = '';
        continue;
      case "~":
        if (text[i + 1] === '~') {
          i++
          if (mode === MODE_STRIKETHROUGH) {
            ast.push(inlineNode(stack, 'strikethrough'));
            mode = MODE_DEFAULT;
          } else {
            if (!isEmpty(stack)) {
              ast.push(inlineNode(stack));
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
          ast.push(inlineNode(stack, 'code'));
          mode = MODE_DEFAULT;
        } else {
          if (!isEmpty(stack)) {
            ast.push(inlineNode(stack));
          }
          mode = MODE_INLINE_CODE;
        }
        stack ='';
        continue;
      case "!":
        if (!isEmpty(stack)) {
          ast.push(inlineNode(stack));
        }
        stack = '';
        mode = MODE_IMAGE;
        stack = char;
        continue;
      case "[":
        if (mode !== MODE_IMAGE) {
          if (!isEmpty(stack)) {
            ast.push(inlineNode(stack));
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
          ast.push(imageNode(stack));
          mode = MODE_DEFAULT;
          stack = '';
        } else if (mode === MODE_LINK) {
          ast.push(linkNode(stack));
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
  if (!isEmpty(stack)) {
    ast.push(inlineNode(stack));
  }
  return ast;
};
