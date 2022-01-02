const dockStart = require('@nlpjs/basic').dockStart

;(async () => {
  const dock = await dockStart({ use: ['Basic', 'Qna'] });
  const nlp = dock.get('nlp');
  nlp.settings.modelFileName = 'data/model.nlp'
  await nlp.addCorpus({ filename: './qna.tsv', importer: 'qna', locale: 'en' });
  await nlp.train();
  var phrases = []
  nlp.toJSON().nluManager.domainManagers.en.sentences.forEach(function (sentence) {
    phrases.push(sentence.utterance)
  })
  require('fs').writeFileSync('data/phrases.json', JSON.stringify(phrases, null, 2))
  console.log('trained')
})();