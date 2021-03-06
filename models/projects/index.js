import { Model } from 'objection';

export default class Project extends Model {
  static get tableName() {
    return 'projects';
  }
}

export const create = async input => {
  return await Project.query().insert(input);
};

export const get = async id => {
  return await Project.query()
    .where({ id })
    .first();
};

export const update = async (id, input) => {
  return await Project.query()
    .where({ id })
    .update(input);
};

export const del = async id => {
  return await Project.query()
    .where({ id })
    .del();
};

Project.get = get;
Project.create = create;
Project.update = update;
Project.delete = del;
