import { Model } from 'objection';

export default class User extends Model {
  static get tableName() {
    return 'users';
  }

  // static get relationMappings() {
  //   return {
  //     meta: {
  //       relation: Model.HasManyRelation,
  //       modelClass: UserMeta,
  //       join: {
  //         from: 'users.id',
  //         to: 'user_meta.user_id',
  //       },
  //     },
  //     image: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Image,
  //       join: {
  //         from: 'users.image_id',
  //         to: 'images.id',
  //       },
  //     },
  //   };
  // }
}

export const create = async data => {
  const user = await User.query().insert(data);
  return user;
};

export const get = async (field, email) => {
  return await User.query()
    .where({ [field]: email })
    .first();
};

export const getUserById = async id =>
  User.query()
    .where({ id })
    .first();

export const getAll = async () => {
  return await User.query();
};

export const update = async (id, data) => {
  return await User.query()
    .where({ id })
    .update(data);
};

export const del = async id => {
  return await User.query()
    .where({ id })
    .delete();
};

export const getUsersById = async user_ids => {
  return await User.query().whereIn('id', user_ids);
};

export const getGlobalNotificationUsers = async () => {
  return await User.query().where({ notify_global: true });
};

User.create = create;
User.get = get;
User.getAll = getAll;
User.update = update;
User.delete = del;
User.getUserById = getUserById;
User.getUsersById = getUsersById;
User.getGlobalNotificationUsers = getGlobalNotificationUsers;
