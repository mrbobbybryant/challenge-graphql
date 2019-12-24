import Project from 'models/projects';

export default async (_, __, { user }) => {
  if (!user) {
    ApolloError({
      code: 401
    });
  }

  const projectObj = await Project.getByUserId(user.id);

  if (!projectObj) {
    ApolloError({
      code: 401
    });
  }

  return projectObj;
};
