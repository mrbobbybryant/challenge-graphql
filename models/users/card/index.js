import { Model } from 'objection';

export default class Card extends Model {
  static get tableName() {
    return 'cards';
  }
}

export const create = async data => {
  const user = await Card.query().insert(data);
  return user;
};

export const get = async id => {
  return await Card.query()
    .where({ id })
    .first();
};

export const getUserCards = async user_id => {
  return await Card.query().where({ user_id });
};

export const update = async (id, data) => {
  return await Card.query()
    .where({ id })
    .update(data);
};

Card.create = create;
Card.get = get;
Card.getUserCards = getUserCards;
Card.update = update;
