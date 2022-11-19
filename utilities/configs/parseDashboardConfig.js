module.exports = {
  apps: [
    {
      serverURL: "http://localhost:5000/parse",
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY,
      appName: process.env.APP_NAME
    }
  ],
  /* Commented out for not login access usage. If needed, uncomment this section. To insert your own credentials please set appropriate params in .env
  users: [{
    user:process.env.APP_USER || "user",
    pass:process.env.APP_PASS || "pass"
  }],
  */
}
