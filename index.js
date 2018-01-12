const HEADING_REGEX = /^(#{1,6})\s?(.+)$/;
const ULIST_REGEX = /^(\s*)?\-\s*(.+)$/;
const OLIST_REGEX = /^(\s*)?([0-9]+)\.\s*(.+)$/;

const trim = str => str.replace(/^\s+|\s+$/g, '');

const textNode = text => ({
  type: 'text',
  value: trim(text)
});

const headingNode = (text, hash) => ({
  type: 'heading',
  level: hash.length,
  value: text
});

const listNode = (text, indent) => ({
  type: 'list',
  indent: indent,
  value: text,
  children: []
});

const parseText = (ast, stack) => {
  if (stack.length === 0) {
    return;
  }
  // TODO: parse inline signatures
  ast.push(textNode(stack));
});

const parse = str => {
  const ast = [];

  let stack = '';
  let line = '';
  let match;

  for (let i = 0; i < str.length; ++i) {
    const char = str[i];

    if (char === '\n') {
      if (null !== (match = line.match(HEADING_REGEX))) {
        parseText(ast, stack);
        stack = '';
        ast.push(headingNode(match[2], match[1]));
      } else if (null !== (match = line.match(ULIST_REGEX))) {
        parseText(ast, stack);
        stack = '';
        const iSize = (match[1] || '').length;
        const prev = ast[ast.length - 1];
        if (prev.type !== 'list' || prev.indent >= iSize) {
          ast.push(listNode(match[2], 0));
        } else {
          prev.children.push(listNode(match[2], iSize));
        }
      } else {
        stack += `${line}\n`;
      }
      line = '';
    } else {
      line += char;
    }
  }
  if (stack.length > 0) {
    parseText(ast, stack);
  }
  return ast;
};

module.exports = parse;
