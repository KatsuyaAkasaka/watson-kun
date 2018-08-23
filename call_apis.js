require('dotenv').config();
const axios = require('axios');

module.exports = {
  mediaWiki: async title => {
    const wikiRes = await axios.get(`https://ja.wikipedia.org/w/api.php`, {
      params: {
        format : 'json',
        action : 'query',
        prop : 'extracts',
        exsentences : '1',
        explaintext : 'true',
        titles: title,
        rvprop: 'content',
        utf8: '1'
      }
    }).catch(err => {
      console.dir(err);
    });

    const extract = Object.keys(wikiRes.data.query.pages).map(value => {
      return wikiRes.data.query.pages[value].extract || `わかんない`;
    })[0];

    return extract;
  },

  lineMessaging: async (replyToken, extract) => {
    const data = {
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: extract
      }]
    };

    const headers = {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    };

    await axios.post('https://api.line.me/v2/bot/message/reply', data, {headers: headers});
  }

};
