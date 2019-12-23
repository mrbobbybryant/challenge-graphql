export const adminAuth = (parent, args, context, info, resolver) => {
  const { user } = context;

  if (!user) {
    return ApolloError({ code: 401, message: 'admin, no user' });
  }

  if ('admin' === user.role) {
    return resolver(parent, args, context, info);
  }

  return ApolloError({ code: 403, message: 'admin only' });
};

export const vendorAuth = (parent, args, context, info, resolver) => {
  const { user } = context;

  if (!user) {
    return ApolloError({ code: 401, message: 'vendor, no user' });
  }

  if (['admin', 'track'].includes(user.role)) {
    return resolver(parent, args, context, info);
  }

  return ApolloError({ code: 403, message: 'vendor only' });
};

export const employeeAuth = (parent, args, context, info, resolver) => {
  const { user } = context;

  if (!user) {
    return ApolloError({ code: 401, message: 'vendor, no user' });
  }

  if (['admin', 'track', 'employee'].includes(user.role)) {
    return resolver(parent, args, context, info);
  }

  return ApolloError({ code: 403, message: 'employee only' });
};
