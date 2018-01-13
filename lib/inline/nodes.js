const IMAGE_REGEX = /^!\[([^\]]*)?\]\(([^\)]+)\)$/;
const LINK_REGEX = /^\[([^\]]*)?\]\(([^\)]+)\)$/;

const inline = (text, name = 'text') => ({
  name,
  type: 'inline',
  value: text
});

const image = text => {
  const match = text.match(IMAGE_REGEX);
  if (!match) {
    throw new Error(`Invalid image syntax: ${text}`);
  }
  return {
    name: 'image',
    type: 'inline',
    alt: match[1] || '',
    src: match[2] || ''
  };
};

const link = text => {
  const match = text.match(LINK_REGEX);
  if (!match) {
    throw new Error(`Invalid link syntax: ${text}`);
  }
  return {
    name: 'link',
    type: 'inline',
    title: match[1] || '',
    href: match[2] || ''
  };
};

module.exports = {
  inline,
  image,
  link
};
