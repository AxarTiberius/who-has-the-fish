const dockStart = require('@nlpjs/basic').dockStart

;(async () => {
  const dock = await dockStart({ use: ['Basic', 'Qna'] });
  const nlp = dock.get('nlp');
  nlp.settings.modelFileName = 'data/model.nlp'
  await nlp.addCorpus({ filename: './qna.tsv', importer: 'qna', locale: 'en' });
  await nlp.train();
  console.log('trained')
})();