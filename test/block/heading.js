const test = require('ava');
const parser = require('../../index.js');

test('Parse H1 test', async t => {
  const text = '# Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 1);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});

test('Parse H2 test', async t => {
  const text = '## Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 2);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});

test('Parse H3 test', async t => {
  const text = '### Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 3);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});

test('Parse H4 test', async t => {
  const text = '#### Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 4);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});

test('Parse H5 test', async t => {
  const text = '##### Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 5);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});

test('Parse H6 test', async t => {
  const text = '###### Heading';
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'heading');
  t.is(tree[0].level, 6);
  const values = tree[0].values;
  t.is(values.length, 1);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'Heading');
});
