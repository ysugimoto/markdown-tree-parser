# markdown-tree-parser

Parse markdown string to Abstract Syntax Tree which we defined.

## Installation

This package is available on `npmjs.org`. You can install via `npm` command:

```
$ npm install markdown-tree-parser
```

## Usage

Import this package and apply markdown string.

```
const mtp = require('markdown-tree-parser');
const text = `
# Heading 1

This is **markdown** text!`;

const tree = mtp(text);
console.log(tree.dump());

>>>
[
  {
    "name": "heading",
    "type": "block",
    "level": 1,
    "values": [
      {
        "name": "text",
        "type": "inline",
        "value": "Heading 1"
      }
    ]
  },
  {
    "name": "paragraph",
    "type": "block",
    "values": [
      {
        "name": "text",
        "type": "inline",
        "value": "This is "
      },
      {
        "name": "em",
        "type": "inline",
        "value": "markdown"
      },
      {
        "name": "text",
        "type": "inline",
        "value": " text!"
      }
    ]
  }
]

```

## Support syntax

### Basic Markdown syntax

- [x] strong
- [x] italic
- [x] string+italic
- [x] image
- [x] link
- [x] headings
- [x] horizontal rule
- [x] blockquote
- [x] unordeed list
- [ ] ordeed list

### Github Flavored Markdown sytax

- [x] strikethrough [GFM extend]
- [x] code
- [x] task list (list with checkbox)
- [ ] table


## Author

Yoshiaki Sugimoto

## License

MIT
