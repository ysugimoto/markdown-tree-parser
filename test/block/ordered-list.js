const test = require('ava');
const parser = require('../../index.js');
const OrderedList = require('../../nodes/index.js').OrderedList;

test('Parse ordered-list text', async t => {
  const text = `1. One
2. Two
3. Three
`;
  const tree = parser(text).ast;

  t.is(tree.length, 3);
  t.true(tree[0] instanceof OrderedList);
  t.is(tree[0].order, 1);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof OrderedList);
  t.is(tree[1].order, 2);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof OrderedList);
  t.is(tree[2].order, 3);
  t.is(tree[2].values[0].value, 'Three');
});

