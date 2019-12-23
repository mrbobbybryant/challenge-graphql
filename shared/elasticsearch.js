import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: process.env.BONSAI_URL,
});

export const elasticInit = async () => {
  const tracksExist = await client.indices.exists({
    index: process.env.ES_TRACK_INDEX,
  });

  if (!tracksExist) {
    await client.indices.create({
      index: process.env.ES_TRACK_INDEX,
    });
  }

  const eventsExist = await client.indices.exists({
    index: process.env.ES_EVENTS_INDEX,
  });

  if (!eventsExist) {
    await client.indices.create({
      index: process.env.ES_EVENTS_INDEX,
    });
  }

  const seriesExist = await client.indices.exists({
    index: process.env.ES_SERIES_INDEX,
  });

  if (!seriesExist) {
    await client.indices.create({
      index: process.env.ES_SERIES_INDEX,
    });
  }
};

export default client;
