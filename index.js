module.exports = process.env.YOUTUBE_COV
  ? require('./lib-cov/youtube')
  : require('./lib/youtube');
