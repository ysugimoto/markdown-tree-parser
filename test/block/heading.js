const test = require('ava');
const parser = require('../../index.js');
const Heading = require('../../nodes/index.js').Heading;
const SyntaxError = require('../../parser/syntax-error.js');

test('Parse H1 test', async t => {
  const text = '# Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 1);
  t.is(heading.values[0].value, 'Heading');
});

test('Parse H2 test', async t => {
  const text = '## Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 2);
  t.is(heading.values[0].value, 'Heading');
});

test('Parse H3 test', async t => {
  const text = '### Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 3);
  t.is(heading.values[0].value, 'Heading');
});

test('Parse H4 test', async t => {
  const text = '#### Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 4);
  t.is(heading.values[0].value, 'Heading');
});

test('Parse H5 test', async t => {
  const text = '##### Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 5);
  t.is(heading.values[0].value, 'Heading');
});

test('Parse H6 test', async t => {
  const text = '###### Heading';
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const heading = tree[0];
  t.true(heading instanceof Heading);
  t.is(heading.level, 6);
  t.is(heading.values[0].value, 'Heading');
});

test('Throw error is heading over 7', async t => {
  const text = '####### Heading';

  t.throws(() => {
    const tree = parser(text).ast;
    console.log(tree);
  }, SyntaxError);
});
