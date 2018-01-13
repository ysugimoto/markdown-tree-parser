const test = require('ava');
const parser = require('../../index.js');

test('Parse image text', async t => {
  const text = 'This is ![Testing](https://example.com/image.png) text';
  const tree = parser(text);

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'This is ');
  t.is(values[1].name, 'image');
  t.is(values[1].alt, 'Testing');
  t.is(values[1].src, 'https://example.com/image.png');
  t.is(values[2].name, 'text');
  t.is(values[2].value, ' text');
});

test('Parse image text with empty alt', async t => {
  const text = 'This is ![](https://example.com/image.png) text';
  const tree = parser(text);

  t.is(tree.length, 1);
  const values = tree[0].values;
  t.is(values.length, 3);

  t.is(values[0].name, 'text');
  t.is(values[0].value, 'This is ');
  t.is(values[1].name, 'image');
  t.is(values[1].alt, '');
  t.is(values[1].src, 'https://example.com/image.png');
  t.is(values[2].name, 'text');
  t.is(values[2].value, ' text');
});