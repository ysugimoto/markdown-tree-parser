const test = require('ava');
const parser = require('../../index.js');
const Paragraph = require('../../nodes/index.js').Paragraph;

test('Parse line-break block test', async t => {
  const text = `foo
bar  
baz
`;
  const tree = parser(text).ast;

  t.is(tree.length, 2);
  t.true(tree[0] instanceof Paragraph);
  t.is(tree[0].values[0].value, 'foo\nbar');
  t.true(tree[1] instanceof Paragraph);
  t.is(tree[1].values[0].value, 'baz');
});

