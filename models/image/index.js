import { Model } from 'objection';

export default class Image extends Model {
  static get tableName() {
    return 'images';
  }
}

export const create = async input => {
  return await Image.query().insert(input);
};

export const get = async id => {
  return await Image.query()
    .where({ id })
    .first();
};

export const update = async (id, input) => {
  return await Image.query()
    .where({ id })
    .update(input);
};

export const del = async id => {
  return await Image.query()
    .where({ id })
    .del();
};

Image.get = get;
Image.create = create;
Image.update = update;
Image.delete = del;
