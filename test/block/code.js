const test = require('ava');
const parser = require('../../index.js');
const Code = require('../../nodes/index.js').Code;

test('Parse code block test', async t => {
  const text = `\`\`\`
console.log('foo');
\`\`\``;;
  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const code = tree[0];
  t.true(code instanceof Code);
  t.is(code.values[0].value, 'console.log(\'foo\');');
});

