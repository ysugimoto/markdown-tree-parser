// const finder = require('./finder/index.js');

module.exports = class Tree {
  constructor(ast) {
    this.ast = ast;
  }

  dump() {
    return JSON.stringify(this.ast, null, '  ');
  }
};
