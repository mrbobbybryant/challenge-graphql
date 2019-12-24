import Project from 'models/projects';

export default async (_, args, { user }) => {
  if (!user) {
    ApolloError({
      code: 401
    });
  }

  const projectObj = await Project.getByUserId(args.id);
  if (!projectObj) {
    ApolloError({
      code: 401
    });
  }

  return projectObj;
};
