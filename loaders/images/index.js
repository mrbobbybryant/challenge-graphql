import Image from 'models/image';

export default async image_ids => {
  const ids = image_ids.map(image_id => parseInt(image_id));
  const images = await Image.query().whereIn('id', ids);

  return ids.map(image_id => {
    const image = images.filter(image => image.id === image_id);
    return image.length ? `${process.env.CLOUDFRONT}/${image[0].url}` : null;
  });
};
