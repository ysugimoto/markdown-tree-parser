const parseInline = require('./inline.js');
const nodes = require('../nodes/block.js');
const helper = require('./helper.js');

const HEADING_REGEX = /^(#{1,})\s?(.+)$/;
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
          ast.push(new nodes.Paragraph(stack + match[1]));
        }
        stack = '';
      } else if (CODE_REGEX.test(line)) {
        if (mode === MODE_CODE) {
          ast.push(new nodes.Code(stack.trim()));
          mode = MODE_DEFAULT;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new nodes.Paragraph(stack));
          }
          mode = MODE_CODE;
        }
        stack = '';
      } else if (null !== (match = line.match(BLOCKQUOTE_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(new nodes.Paragraph(stack));
        }
        stack = '';
        ast.push(new nodes.Blockquote(match[2], match[1].length));
      } else if (HORIZONTAL_RULE_REGEX.test(line) && line.split(/[\*\-_]/).length > 3) {
        if (!helper.isEmpty(stack)) {
          ast.push(new nodes.Paragraph(stack));
        }
        stack = '';
        ast.push(new nodes.Horizontal());
      } else if (null !== (match = line.match(HEADING_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(new nodes.Paragraph(stack));
        }
        stack = '';
        ast.push(new nodes.Heading(match[2], match[1].length));
      } else if (null !== (match = line.match(ULIST_REGEX))) {
        if (!helper.isEmpty(stack)) {
          ast.push(new nodes.Paragraph(stack));
        }
        stack = '';
        const indent = (match[1] || '').length;
        const prev = ast[ast.length - 1];
        const check = match[2].match(/^\[(x|\u0020)?\]\s?(.+)$/);
        if (!prev || prev.name !== 'list' || prev.indent >= indent) {
          const list = check ? new nodes.CheckList(check[2], check[1] === 'x', 0) : new nodes.List(match[2], 0);
          ast.push(list);
        } else {
          const list = check ? new nodes.CheckList(check[2], check[1] === 'x', indent) : new nodes.List(match[2], indent);
          prev.children.push(list);
        }
      } else {
        stack += line !== '' ? `${line}\n` : '';
      }
      line = '';
    } else {
      line += char;
    }
  }
  if (!helper.isEmpty(stack)) {
    ast.push(new nodes.Paragraph(stack.slice(0, -1)));
  }
  return ast;
};
