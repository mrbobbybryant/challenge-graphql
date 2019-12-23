import * as jwt from 'jsonwebtoken';

export default user_id => {
  return jwt.sign(
    {
      userId: user_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
};
