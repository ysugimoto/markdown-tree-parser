const test = require('ava');
const parser = require('../../index.js');

test('Parse line-break block test', async t => {
  const text = `foo
bar  
baz
`;
  const tree = parser(text);

  t.is(tree.length, 2);
  t.is(tree[0].name, 'paragraph');
  t.is(tree[0].values[0].value, 'foo\nbar');
  t.is(tree[1].name, 'paragraph');
  t.is(tree[1].values[0].value, 'baz');
});

