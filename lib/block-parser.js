const parseInline = require('./inline-parser.js');
const SyntaxError = require('./syntax-error.js');

const EMPTRY_REGEX = /^\s*$/;
const HEADING_REGEX = /^(#{1,6})\s?(.+)$/;
const ULIST_REGEX = /^(\s*)?[\-|\*]\s*(.+)$/;
const OLIST_REGEX = /^(\s*)?([0-9]+)\.\s*(.+)$/;
const HORIZONTAL_RULE_REGEX = /^[\*\-_\s]+$/;
const CODE_REGEX = /^[`|~]{3}/; // contains filetype definition
const BLOCKQUOTE_REGEX = /^(>{1,})\s?(.+)$/;
const LINEBREAK_REGEX = /(.+?)[\u0020]{2}$/;

const MODE_DEFAULT = 0;
const MODE_CODE = 1;
const MODE_TABLE = 2; // not implement yet

const paragraphNode = text => ({
  name: 'paragraph',
  type: 'block',
  values: parseInline(text)
});

const horizontalRuleNode = () => ({
  name: 'horizontal',
  type: 'block',
  value: ''
});

const codeNode = text => ({
  name: 'code',
  type: 'block',
  code: text.replace(/\n$/, '')
});

const blockQuoteNode = (text, level) => ({
  name: 'blockquote',
  type: 'block',
  level: level.length,
  text: text
});

const headingNode = (text, hash) => {
  if (hash.length === 0 || hash.length > 6) {
    throw new SyntaxError('Invalid heading: heading support only between H1 and H6');
  }
  return {
    name: 'heading',
    type: 'block',
    level: hash.length,
    values: parseInline(text)
  };;
};

const listNode = (text, indent) => {
  const list = {
    name: 'list',
    type: 'block',
    indent: indent,
    children: []
  };
  const match = text.match(/^\[(x|\u0020)?\](.+)$/);
  if (match) {
    return Object.assign(list, {
      name: 'check-list',
      type: 'block',
      checked: match[1] === 'x',
      values: parseInline(match[2])
    });
  }
  return Object.assign(list, {
    values: parseInline(text)
  });
};

const isEmpty = stack => {
  return stack.length === 0 || EMPTRY_REGEX.test(stack);
};

module.exports = str => {
  const ast = [];

  if (!/\n$/.test(str)) {
    str += '\n';
  }

  let stack = '';
  let line = '';
  let mode = MODE_DEFAULT;
  let match;

  for (let i = 0; i < str.length; ++i) {
    const char = str[i];

    if (char === '\n') {
      if (null !== (match = line.match(LINEBREAK_REGEX))) {
        if (!isEmpty(stack)) {
          ast.push(paragraphNode(stack + match[1]));
        }
        stack = '';
      } else if (CODE_REGEX.test(line)) {
        if (mode === MODE_CODE) {
          ast.push(codeNode(stack));
          mode = MODE_DEFAULT;
        } else {
          if (!isEmpty(stack)) {
            ast.push(paragraphNode(stack));
          }
          mode = MODE_CODE;
        }
        stack = '';
      } else if (null !== (match = line.match(BLOCKQUOTE_REGEX))) {
        if (!isEmpty(stack)) {
          ast.push(paragraphNode(stack));
        }
        stack = '';
        ast.push(blockQuoteNode(match[2], match[1]));
      } else if (HORIZONTAL_RULE_REGEX.test(line) && line.split(/[\*\-_]/).length > 3) {
        if (!isEmpty(stack)) {
          ast.push(paragraphNode(stack));
        }
        stack = '';
        ast.push(horizontalRuleNode());
      } else if (null !== (match = line.match(HEADING_REGEX))) {
        if (!isEmpty(stack)) {
          ast.push(paragraphNode(stack));
        }
        stack = '';
        ast.push(headingNode(match[2], match[1]));
      } else if (null !== (match = line.match(ULIST_REGEX))) {
        if (!isEmpty(stack)) {
          ast.push(paragraphNode(stack));
        }
        stack = '';
        const indent = (match[1] || '').length;
        const prev = ast[ast.length - 1];
        if (prev.type !== 'list' || prev.indent >= indent) {
          ast.push(listNode(match[2], 0));
        } else {
          prev.children.push(listNode(match[2], indent));
        }
      } else {
        stack += `${line}\n`;
      }
      line = '';
    } else {
      line += char;
    }
  }
  if (!isEmpty(stack)) {
    ast.push(paragraphNode(stack.slice(0, -1)));
  }
  return ast;
};
