const test = require('ava');
const parser = require('../../index.js');

test('Parse italic text with asterisk', async t => {
  const text = 'This is *italic* text';
  const tree = parser(text);

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'This is ');
  t.is(values[1].name, 'italic');
  t.is(values[1].value, 'italic');
  t.is(values[2].name, 'text');
  t.is(values[2].value, ' text');
});

test('Parse italic text with underscore', async t => {
  const text = 'This is _italic_ text';
  const tree = parser(text);

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'This is ');
  t.is(values[1].name, 'italic');
  t.is(values[1].value, 'italic');
  t.is(values[2].name, 'text');
  t.is(values[2].value, ' text');
});
