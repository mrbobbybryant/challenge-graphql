import Image from 'models/image';

export default async ({ image_id }) => {
  if (!image_id) {
    return null;
  }

  const image = await Image.get(image_id);

  if (!image) {
    return null;
  }

  return `${process.env.CLOUDFRONT}/${image.url}`;
};
