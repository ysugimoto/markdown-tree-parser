const test = require('ava');
const parser = require('../../index.js');

test('Parse asterisk horizontal rule text', async t => {
  const text = '******';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

test('Parse asterisk-space-mixed horizontal rule text', async t => {
  const text = '* * *';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

test('Parse hyphen horizontal rule text', async t => {
  const text = '------';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

test('Parse hyphen-space-mixed horizontal rule text', async t => {
  const text = '- - - ';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

test('Parse underscore horizontal rule text', async t => {
  const text = '__________';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

test('Parse underscore-space-mixed horizontal rule text', async t => {
  const text = '_ _ _';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'horizontal');
});

