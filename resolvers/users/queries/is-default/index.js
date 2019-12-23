export default async ({ id }, _, { user }) => {
  if (!user) {
    return false;
  }

  return parseInt(id) === parseInt(user.default_card);
};
