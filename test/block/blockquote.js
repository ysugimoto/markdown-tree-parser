const test = require('ava');
const parser = require('../../index.js');

test('Parse blockquote text', async t => {
  const text = '> Quoted'
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'blockquote');
  t.is(tree[0].level, 1);
  t.is(tree[0].text, 'Quoted');
});

test('Parse nested blockquote text', async t => {
  const text = `
> Quoted
>> Nest-Quoted
`;
  const tree = parser(text);

  t.is(tree.length, 2);
  t.is(tree[0].name, 'blockquote');
  t.is(tree[0].level, 1);
  t.is(tree[0].text, 'Quoted');
  t.is(tree[1].name, 'blockquote');
  t.is(tree[1].level, 2);
  t.is(tree[1].text, 'Nest-Quoted');
});
