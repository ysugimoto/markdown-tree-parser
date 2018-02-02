const test = require('ava');
const parser = require('../../index.js');
const {Html, HtmlComment, Text} = require('../../nodes/index.js');

test('Parse HTML text', async t => {
  const text = 'This is <span>html</span> text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof Html);
  t.is(values[1].value, '<span>html</span>');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});

test('Parse HTML comment text', async t => {
  const text = 'This is <!-- commented out --> text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof HtmlComment);
  t.is(values[1].value, '<!-- commented out -->');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});
