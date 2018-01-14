const Node = require('./Node.js');
const inlineParser = require('../parser/inline.js');
const inline = require('./inline.js');
const SyntaxError = require('../parser/syntax-error.js');

class Paragraph extends Node {
  constructor(text) {
    super('paragraph', 'block');
    this.values = inlineParser(text);
  }
}

class Horizontal extends Node {
  constructor(text) {
    super('horizontal', 'block');
    this.values = [];
  }
}

class Code extends Node {
  constructor(text, syntax) {
    super('code', 'block');
    this.syntax = syntax;
    this.values = [
      new inline.Text(text)
    ];
  }
}

class Blockquote extends Node {
  constructor(text, level) {
    super('blockquote', 'block');
    this.level = level;
    this.values = [
      new inline.Text(text)
    ];
  }
}

class Heading extends Node {
  constructor(text, level) {
    if (level === 0 || level > 6) {
      throw new SyntaxError('Invalid heading: heading support only between H1 and H6');
    }
    super('heading', 'block');
    this.level = level;
    this.values = inlineParser(text);
  }
}

class List extends Node {
  constructor(text, level) {
    super('list', 'block');
    this.level = level;
    this.values = inlineParser(text);
  }
}

class OrderedList extends Node {
  constructor(text, order, level) {
    super('orderedlist', 'block');
    this.level = level;
    this.order = order;
    this.values = inlineParser(text);
  }
}

class CheckList extends Node {
  constructor(text, checked, level) {
    super('checklist', 'block');
    this.level = level;
    this.checked = checked;
    this.values = inlineParser(text);
  }
}

module.exports = {
  Paragraph,
  Horizontal,
  Code,
  Blockquote,
  Heading,
  List,
  CheckList,
  OrderedList
};
