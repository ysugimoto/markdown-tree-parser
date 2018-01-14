const test = require('ava');
const parser = require('../../index.js');
const Table = require('../../nodes/index.js').Table

test('Parse table block test', async t => {
  const text = `
| HeadingA     | HeadingB       | HeadingC      |
| ------------ | :------------: | ------------: |
| Left aligned | Center aligned | Right aligned |
`;

  const tree = parser(text).ast;

  t.is(tree.length, 1);
  const table = tree[0];
  t.true(table instanceof Table);

  t.is(table.headings.length, 3);
  t.is(table.headings[0], 'HeadingA');
  t.is(table.headings[1], 'HeadingB');
  t.is(table.headings[2], 'HeadingC');

  t.is(table.aligns.length, 3);
  t.is(table.aligns[0], 'left');
  t.is(table.aligns[1], 'center');
  t.is(table.aligns[2], 'right');

  t.is(table.rows.length, 1);
  const row = table.rows[0];
  t.is(row.length, 3);
  t.is(row[0].length, 1);
  t.is(row[0][0].value, 'Left aligned');
  t.is(row[1].length, 1);
  t.is(row[1][0].value, 'Center aligned');
  t.is(row[2].length, 1);
  t.is(row[2][0].value, 'Right aligned');
});


