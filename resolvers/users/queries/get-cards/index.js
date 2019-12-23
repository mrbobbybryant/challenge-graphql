import Card from 'models/users/card';

export const getCards = Card => async (_, __, { user }) => {
  if (!user) {
    return [];
  }

  const cards = await Card.getUserCards(user.id);

  if (!cards.length) {
    return [];
  }

  return cards.reduce((acc, card) => {
    if (parseInt(card.id) === user.default_card) {
      acc.unshift(card);
    } else {
      acc.push(card);
    }

    return acc;
  }, []);
};

export default getCards(Card);
