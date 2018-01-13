const test = require('ava');
const parser = require('../../index.js');
const {Italic, Text} = require('../../nodes/index.js');

test('Parse italic text with asterisk', async t => {
  const text = 'This is *italic* text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof Italic);
  t.is(values[1].value, 'italic');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});

test('Parse italic text with underscore', async t => {
  const text = 'This is _italic_ text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof Italic);
  t.is(values[1].value, 'italic');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});
