export default resolver => async (...args) => {
  try {
    return await resolver(...args);
  } catch (error) {
    let e = new Error(error);

    e.original = error;
    e.stack = error.stack;

    throw e;
  }
};

global.ApolloError = message => {
  throw new Error(JSON.stringify(message));
};
