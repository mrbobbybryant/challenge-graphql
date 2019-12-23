import upload from 'shared/upload';
import Image from 'models/image';

export default async (_, { file }) => {
  try {
    const { createReadStream, filename, mimetype } = await file;

    if (!createReadStream || typeof createReadStream !== 'function') {
      return ApolloError({
        code: 400,
        message: `This is not a valid File type.`,
      });
    }

    const stream = createReadStream();

    const url = await upload({
      stream,
      accept: ['jpg', 'jpeg', 'pdf', 'png'],
      filename,
      mimetype,
    });

    const image = await Image.create({
      url,
    });

    return {
      id: image.id,
      url: `${process.env.CLOUDFRONT}/${image.url}`,
    };
  } catch (error) {
    console.log(error);
  }
};
