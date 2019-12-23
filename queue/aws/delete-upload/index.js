const AWS = require('aws-sdk');

const s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

let Bucket = process.env.S3_IMAGE_BUCKET;

export default {
  channel: 'delete-s3-upload',
  process: async ({ key }) => {
    return new Promise(async resolve => {
      let params = {
        Bucket,
        Key: key,
      };

      s3.deleteObject(params, err => {
        if (err) {
          resolve('');
          return ApolloError({
            code: 400,
            message: `Failed to delete file.`,
          });
        }
        resolve(true);
      });
    });
  },
};
