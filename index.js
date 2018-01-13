const parser = require('./parser/index.js');
const Tree = require('./Tree.js');

module.exports = mdString => {
  const ast = parser(mdString);

  return new Tree(ast);
};

module.exports.parse = parser;
