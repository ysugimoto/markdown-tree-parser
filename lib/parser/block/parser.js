const parseInline = require('../inline/parser.js');
const SyntaxError = require('../syntax-error.js');
const nodes = require('./nodes.js');
const helper = require('../helper.js');

const HEADING_REGEX = /^(#{1,6})\s?(.+)$/;
const ULIST_REGEX = /^(\s*)?[\-|\*]\s*(.+)$/;
const OLIST_REGEX = /^(\s*)?([0-9]+)\.\s*(.+)$/;
const HORIZONTAL_RULE_REGEX = /^[\*\-_\s]+$/;
const CODE_REGEX = /^[`|~]{3}(.*)$/;
const BLOCKQUOTE_REGEX = /^(>{1,})\s?(.+)$/;
const LINEBREAK_REGEX = /(.+?)[\u0020]{2}$/;

const MODE_DEFAULT = 0;
const MODE_CODE = 1;
const MODE_TABLE = 2; // not implement yet

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
        if (!helper.isEmpty(stack)) {
          ast.push(nodes.paragraph(stack + match[1]));
        }
        stack = '';
      } else if (CODE_REGEX.test(line)) {
        if (mode === MODE_CODE) {
          ast.push(nodes.code(stack));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(nodes.paragraph(stack));
          }
          mode = MODE_CODE;
        }
        stack = '';
      } else if (null !== (match = line.match(BLOCKQUOTE_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(nodes.paragraph(stack));
        }
        stack = '';
        ast.push(nodes.blockquote(match[2], match[1]));
      } else if (HORIZONTAL_RULE_REGEX.test(line) && line.split(/[\*\-_]/).length > 3) {
        if (!helper.isEmpty(stack)) {
          ast.push(nodes.paragraph(stack));
        }
        stack = '';
        ast.push(nodes.horizontal());
      } else if (null !== (match = line.match(HEADING_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(paragraph(stack));
        }
        stack = '';
        ast.push(nodes.heading(match[2], match[1]));
      } else if (null !== (match = line.match(ULIST_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(nodes.paragraph(stack));
        }
        stack = '';
        const indent = (match[1] || '').length;
        const prev = ast[ast.length - 1];
        if (prev.type !== 'list' || prev.indent >= indent) {
          ast.push(nodes.list(match[2], 0));
        } else {
          prev.children.push(nodes.list(match[2], indent));
        }
      } else {
        stack += `${line}\n`;
      }
      line = '';
    } else {
      line += char;
    }
  }
  if (!helper.isEmpty(stack)) {
    ast.push(nodes.paragraph(stack.slice(0, -1)));
  }
  return ast;
};
