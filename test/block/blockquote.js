const test = require('ava');
const parser = require('../../index.js');
const Blockquote = require('../../nodes/index.js').Blockquote;

test('Parse blockquote text', async t => {
  const text = '> Quoted'
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const blockquote = tree[0];
  t.true(blockquote instanceof Blockquote);
  t.is(blockquote.level, 1);
  t.is(blockquote.values[0].value, 'Quoted');
});

test('Parse nested blockquote text', async t => {
  const text = `
> Quoted
>> Nest-Quoted
`;
  const tree = parser(text).ast;

  t.is(tree.length, 2);
  let blockquote = tree[0];
  t.true(blockquote instanceof Blockquote);
  t.is(blockquote.level, 1);
  t.is(blockquote.values[0].value, 'Quoted');
  blockquote = tree[1];
  t.true(blockquote instanceof Blockquote);
  t.is(blockquote.level, 2);
  t.is(blockquote.values[0].value, 'Nest-Quoted');
});
