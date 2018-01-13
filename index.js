const parser = require('./lib/parser/index.js');
const Tree = require('./lib/tree.js');

module.exports = mdString => {
  const ast = parser(mdString);

  return new Tree(ast);
};

module.exports.parse = parser;
