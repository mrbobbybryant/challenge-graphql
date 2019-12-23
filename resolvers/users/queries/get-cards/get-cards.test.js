import { getCards } from './index';

const getUserCards = jest.fn();
const Card = {
  getUserCards
};

const testGetCards = getCards(Card);

describe('Get Cards Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return an empty array if the user is not present.', async () => {
    const result = await testGetCards({}, {}, {});
    expect(result).toEqual([]);
  });

  test('Should return an empty array if the user does not have any cards.', async () => {
    getUserCards.mockReturnValueOnce([]);
    const result = await testGetCards({}, {}, { user: { id: 1 } });
    expect(result).toEqual([]);
  });

  test('Should return an array of cards with the default card at index 0.', async () => {
    getUserCards.mockReturnValueOnce([{ id: 1 }, { id: 2 }]);
    const result = await testGetCards(
      {},
      {},
      { user: { id: 1, default_card: 2 } }
    );
    expect(result).toEqual([{ id: 2 }, { id: 1 }]);
  });

  test('Should still work even if a default is not set..', async () => {
    getUserCards.mockReturnValueOnce([{ id: 1 }, { id: 2 }]);
    const result = await testGetCards(
      {},
      {},
      { user: { id: 1, default_card: null } }
    );
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
