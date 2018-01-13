const parseInline = require('../inline/parser.js');

const paragraph = text => ({
  name: 'paragraph',
  type: 'block',
  values: parseInline(text)
});

const horizontal = () => ({
  name: 'horizontal',
  type: 'block',
  value: ''
});

const code = (text, syntax = '') => ({
  name: 'code',
  type: 'block',
  syntax: syntax,
  code: text.replace(/\n$/, '')
});

const blockquote = (text, level) => ({
  name: 'blockquote',
  type: 'block',
  level: level.length,
  text: text
});

const heading = (text, hash) => {
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

const list = (text, indent) => {
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

module.exports = {
  paragraph,
  horizontal,
  code,
  blockquote,
  heading,
  list
};
