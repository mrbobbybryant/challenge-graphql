import Project from 'models/projects'

export default async (
    _,
    { input: { token, name, description } },
    { user },
  ) => {
    if (!user) {
      ApolloError({
        code: 401,
      });
    }
  
    try {
      await Project.create({
        name,
        description,
        user_id: user.id
      });
      return true
    }catch (error) {
        ApolloError({
          code: 400,
          message: error.message,
        });
    }
}