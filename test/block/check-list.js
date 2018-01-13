const test = require('ava');
const parser = require('../../index.js');
const CheckList = require('../../nodes/index.js').CheckList;

test('Parse hyphen check list text', async t => {
  const text = `- [ ] One
- [ ] Two
- [x] Three
`;
  const tree = parser(text).ast;

  t.is(tree.length, 3);
  t.true(tree[0] instanceof CheckList);
  t.falsy(tree[0].checked);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof CheckList);
  t.falsy(tree[1].checked);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof CheckList);
  t.true(tree[2].checked);
  t.is(tree[2].values[0].value, 'Three');
});

test('Parse asterisk list text', async t => {
  const text = `* [ ] One
* [ ] Two
* [x] Three
`;
  const tree = parser(text).ast;

  t.is(tree.length, 3);
  t.true(tree[0] instanceof CheckList);
  t.falsy(tree[0].checked);
  t.is(tree[0].values[0].value, 'One');
  t.true(tree[1] instanceof CheckList);
  t.falsy(tree[1].checked);
  t.is(tree[1].values[0].value, 'Two');
  t.true(tree[2] instanceof CheckList);
  t.true(tree[2].checked);
  t.is(tree[2].values[0].value, 'Three');
});
