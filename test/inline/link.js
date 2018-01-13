const test = require('ava');
const parser = require('../../index.js');
const {Link, Text} = require('../../nodes/index.js');

test('Parse link text', async t => {
  const text = 'This is [Link](https://google.com) text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof Link);
  t.is(values[1].title, 'Link');
  t.is(values[1].href, 'https://google.com');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});

test('Parse link text with empty title', async t => {
  const text = 'This is [](https://google.com) text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof Link);
  t.is(values[1].title, '');
  t.is(values[1].href, 'https://google.com');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});
