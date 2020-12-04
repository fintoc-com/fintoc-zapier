const parse = require('parse-link-header');


module.exports = {
  getFirst(linkHeader) {
    parsedHeader = parse(linkHeader);
    if (!parsedHeader || !parsedHeader.first) return null;

    return parsedHeader.first.url;
  },
  getNext(linkHeader) {
    parsedHeader = parse(linkHeader);
    if (!parsedHeader || !parsedHeader.next) return null;

    return parsedHeader.next && parsedHeader.next.url;
  },
  getLast(linkHeader) {
    parsedHeader = parse(linkHeader)
    if (!parsedHeader || !parsedHeader.last) return null;

    return parsedHeader.last && parsedHeader.last.url;
  }
}
