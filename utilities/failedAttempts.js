
let IpFailedAttempts = [];


const insertFailedAttempt = (ip) => {
  const previousIpFailedAttempt = IpFailedAttempts.find(el => el.ip === ip);
  if(!previousIpFailedAttempt) return IpFailedAttempts.push({ip, latestAttempt: new Date(), attempts:1});

  previousIpFailedAttempt.latestAttempt = new Date();
  previousIpFailedAttempt.attempts++;
};

const clearFailedAttempts = (ip) => {
  IpFailedAttempts = IpFailedAttempts.filter(el => el.ip !== ip);
}

module.exports = {IpFailedAttempts, insertFailedAttempt, clearFailedAttempts};
