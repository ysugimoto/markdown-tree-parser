const test = require('ava');
const parser = require('../../index.js');

test('Parse code block test', async t => {
  const text = `\`\`\`
console.log('foo');
\`\`\``;;
  const tree = parser(text);

  t.is(tree.length, 1);
  t.is(tree[0].name, 'code');
  t.is(tree[0].code, 'console.log(\'foo\');');
});

