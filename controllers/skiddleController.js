const request = require("request-promise");

const eventsIndex = (req, res) => {
  request({
    url:"http://www.skiddle.com/api/v1/events/",
    method: "GET",
    qs: {
      latitude:req.query.lat,
      longitude:req.query.lng,
      radius:req.query.radius,
      eventcode:req.query.eventcode,
      api_key:process.env.SKIDDLE_KEY,
      limit:req.query.limit
    },
    json:true
  })
  .then((data) => {
    res.json(data.results);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

module.exports = {
  index: eventsIndex
};
