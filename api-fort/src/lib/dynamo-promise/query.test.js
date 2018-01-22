import createDynamoPatchQuery from './query';

describe(createDynamoPatchQuery.name, () => {
  it('Creates a basic query', () => {
    const result = createDynamoPatchQuery({ id: 1 }, { foo: 'bar' });
    const expected = {
      Key: { id: 1 },
      UpdateExpression: 'set foo = :foo, updated = :updated',
      ExpressionAttributeValues: {
        ':foo': 'bar',
        ':updated': result.ExpressionAttributeValues[':updated']
      }
    };

    expect(result).toEqual(expected);
  });

  it('Creates a query that contains reserved words', () => {
    const result = createDynamoPatchQuery(
      { id: 1 },
      { order: 1, name: 'foobar', list: [1, 2, 3, 4] }
    );
    const expected = {
      ExpressionAttributeNames: {
        '#L269': 'list',
        '#N304': 'name',
        '#O332': 'order'
      },
      ExpressionAttributeValues: {
        ':list': [1, 2, 3, 4],
        ':name': 'foobar',
        ':order': 1,
        ':updated': result.ExpressionAttributeValues[':updated']
      },
      Key: {
        id: 1
      },
      UpdateExpression:
        'set #O332 = :order, #N304 = :name, #L269 = :list, updated = :updated'
    };

    expect(result).toEqual(expected);
  });
});
