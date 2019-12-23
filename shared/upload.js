const AWS = require('aws-sdk');

const s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

let Bucket = process.env.S3_IMAGE_BUCKET;

const ifExists = async path => {
  try {
    const headCode = await s3.headObject({ Bucket, Key: path }).promise();
    return true;
  } catch (e) {
    return false;
  }
};

export default ({ stream, accept, mimetype, filename }) => {
  let extension = filename.substring(filename.lastIndexOf('.') + 1);

  if (!accept.map(ext => ext.toLowerCase()).includes(extension.toLowerCase()))
    return ApolloError({
      code: 400,
      message: `File extension must be one of: ${accept.join(',')}`,
    });
  return new Promise(async resolve => {
    //check if file exists and append onto it

    let path = filename;

    while (await ifExists(path)) {
      let random = Math.random() * (99999 - 1) + 1;
      let [file, ext] = path.split('.');
      path = `${file}-${random}.${ext}`;
    }

    let params = {
      Bucket,
      Body: stream,
      ContentType: mimetype,
      Key: path,
    };

    s3.upload(params, err => {
      if (err) {
        console.log(err);
        resolve('');
        return ApolloError({
          code: 400,
          message: `Failed to upload file.`,
        });
      }
      resolve(path);
    });
  });
};

export const base64Upload = ({ encoding, filename }) => {
  const buffer = new Buffer(
    encoding.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );

  const mimetype = base64MimeType(encoding);

  return new Promise(async resolve => {
    //check if file exists and append onto it

    let path = filename;

    while (await ifExists(path)) {
      let random = Math.random() * (99999 - 1) + 1;
      let [file, ext] = path.split('.');
      path = `${file}-${random}.${ext}`;
    }

    let params = {
      Bucket,
      Body: buffer,
      ContentType: mimetype,
      Key: path,
    };

    s3.upload(params, err => {
      if (err) {
        console.log(err);
        resolve('');
        return ApolloError({
          code: 400,
          message: `Failed to upload file.`,
        });
      }
      resolve(path);
    });
  });
};

const base64MimeType = encoded => {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
};
