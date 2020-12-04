const pagination = require('../../lib/pagination');

const linkHeader =
  '<https://test.com/bla>; rel="first", ' +
  '<https://test.com/bla&page=2>; rel="next", ' +
  '<https://test.com/bla&page=10>; rel="last"'

describe('pagination', () => {
  it('returns first url', () => {
    expect(pagination.getFirst(linkHeader)).toEqual('https://test.com/bla');
  });

  it('returns next url', () => {
    expect(pagination.getNext(linkHeader)).toEqual('https://test.com/bla&page=2');
  });

  it('returns last url', () => {
    expect(pagination.getLast(linkHeader)).toEqual('https://test.com/bla&page=10');
  });

  it('returns null when header does not have the attribute', () => {
    expect(pagination.getFirst('<https://test.com/bla&page=10>; rel="last"')).toBeNull();
    expect(pagination.getNext('<https://test.com/bla>; rel="first"')).toBeNull();
    expect(pagination.getLast('<https://test.com/bla&page=2>; rel="next')).toBeNull();
  });
})
