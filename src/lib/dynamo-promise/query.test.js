import createDynamoPatchQuery, { currentTime } from './query';

describe(createDynamoPatchQuery.name, () => {
  it('Creates a basic query', () => {
    const result = createDynamoPatchQuery({ id: 1 }, { foo: 'bar' });
    const expected = {
      Key: { id: 1 },
      UpdateExpression: 'set foo = :foo, updated = :updated',
      ExpressionAttributeValues: {
        ':foo': 'bar',
        // Money says that this will be the cause of intermittent test failures
        // TODO: (bdietz) - I'll buy you a beer if this causes a test failure for you
        ':updated': currentTime()
      },
      ExpressionAttributeNames: {}
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
        // Money says that this will be the cause of intermittent test failures
        // TODO: (bdietz) - I'll buy you a beer if this causes a test failure for you
        ':updated': currentTime()
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
