import DataLoader from 'dataloader';
import images from './images';

export default {
  image: new DataLoader(images),
};
