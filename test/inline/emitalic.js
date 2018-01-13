const test = require('ava');
const parser = require('../../index.js');
const {EmItalic, Text} = require('../../nodes/index.js');

test('Parse em+italic test with asterisk', async t => {
  const text = 'This is ***em*** text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof EmItalic);
  t.is(values[1].value, 'em');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});

test('Parse em+italic test with underscore', async t => {
  const text = 'This is ___em___ text';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.true(values[0] instanceof Text);
  t.is(values[0].value, 'This is ');
  t.true(values[1] instanceof EmItalic);
  t.is(values[1].value, 'em');
  t.true(values[2] instanceof Text);
  t.is(values[2].value, ' text');
});
