const {IpFailedAttempts} = require("../utilities/failedAttempts");
const {differenceInMinutes} = require("date-fns");

module.exports = (req, res, next) => {
  const foundFailedAttempt = IpFailedAttempts.find(el => el.attempts % 5 === 0 && el.ip === req.headers['x-real-ip'] && differenceInMinutes(new Date,el.latestAttempt) <= 15);
  if(foundFailedAttempt) return res.status(401).send({message:`Please try again in ${15 - differenceInMinutes(new Date,foundFailedAttempt.latestAttempt)} minutes`});
  next();
};
