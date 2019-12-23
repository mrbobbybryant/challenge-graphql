import Image from 'models/image';
import queue from 'queue/setup';

export default async (_, { id }, { user }) => {
  const image = await Image.get(id);

  if (!image) {
    ApolloError({
      code: 400,
      message: 'Invalid Image',
    });
  }

  if ('admin' !== user.role && parseInt(image.user_id) !== user.id) {
    ApolloError({
      code: 403,
      message: 'You are not allowed to do this.',
    });
  }

  await Image.delete(id);
  queue.publish('delete-s3-upload', { key: image.url });

  return true;
};
