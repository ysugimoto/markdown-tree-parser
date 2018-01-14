const test = require('ava');
const parser = require('../../index.js');
const List = require('../../nodes/index.js').List;

test('Parse hyphen list text', async t => {
  const text = `- One
- Two
- Three
`;
  const tree = parser(text).ast;

  t.is(tree.length, 3);
  t.true(tree[0] instanceof List);
  t.is(tree[0].level, 1);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof List);
  t.is(tree[1].level, 1);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof List);
  t.is(tree[2].level, 1);
  t.is(tree[2].values[0].value, 'Three');
});

test('Parse asterisk list text', async t => {
  const text = `* One
* Two
* Three
`;
  const tree = parser(text).ast;

  t.is(tree.length, 3);
  t.true(tree[0] instanceof List);
  t.is(tree[0].level, 1);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof List);
  t.is(tree[1].level, 1);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof List);
  t.is(tree[2].level, 1);
  t.is(tree[2].values[0].value, 'Three');
});

test('Parse nested list text', async t => {
  const text = `* One
  * Two
    * Three
`;
  const tree = parser(text).ast;

  t.is(tree.length,3);
  t.true(tree[0] instanceof List);
  t.is(tree[0].level, 1);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof List);
  t.is(tree[1].level, 2);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof List);
  t.is(tree[2].level, 3);
  t.is(tree[2].values[0].value, 'Three');
});
