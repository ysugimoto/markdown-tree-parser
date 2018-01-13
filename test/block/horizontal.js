const test = require('ava');
const parser = require('../../index.js');
const Horizontal = require('../../nodes/index.js').Horizontal;

test('Parse asterisk horizontal rule text', async t => {
  const text = '******';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

test('Parse asterisk-space-mixed horizontal rule text', async t => {
  const text = '* * *';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

test('Parse hyphen horizontal rule text', async t => {
  const text = '------';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

test('Parse hyphen-space-mixed horizontal rule text', async t => {
  const text = '- - - ';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

test('Parse underscore horizontal rule text', async t => {
  const text = '__________';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

test('Parse underscore-space-mixed horizontal rule text', async t => {
  const text = '_ _ _';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  t.true(tree[0] instanceof Horizontal);
});

