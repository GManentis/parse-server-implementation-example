const validateLogin = require("../utilities/validators/validateLogin");
const validateLandmark = require("../utilities/validators/validateLandmark");

const {insertFailedAttempt, clearFailedAttempts} = require("../utilities/failedAttempts");

/*
all errors in cloud functions are considered errors with status 400 - Bad Requests
So it was preferred to throw custom error for message manipulation

Also, all successful calls have object template {result:any}. So that's why returns are sent as objects
*/

/*
Additional notes:

- All input is inserted as params even if is part of body or url query (https://example.com?foo=bar)
In case the same param is passed on query and body, the one in URL takes priority

- In addition, all functions work with post verb
 */

Parse.Cloud.define("fetchLandmarks", async req => {
  const query = new Parse.Query("Landmark");
  if(req.params.objectId) {
    try{
      return await query.get(req.params.objectId);
    }catch(err){
      throw new Error("Landmark not found");
    }
  }
  return await query.ascending("order").select(["title","short_info","photo_thumb", "photo"]).find();
});

Parse.Cloud.define("saveLandmark", async req => {
  if(!req.user) throw new Error("Please login to proceed");

  try{
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("objectId", req.user.objectId);
    await userQuery.first();
  }catch(err){
    console.log(err);
    throw new Error("User not found. Please login to proceed");
  }

  if(!req.params.objectId) throw new Error("Landmark for update required");
  const {error, value} = validateLandmark(req.params);
  if(error) throw new Error(error.details[0].message);
  const query = new Parse.Query("Landmark");

  try{
    const landmark = await query.get(req.params.objectId); //error case is here - actually try catch is used to throw specific message
    landmark.set("title",value.title).set("short_info",value.short_info).set("description", value.description);
    await landmark.save({},{useMasterKey: true});
    return {message:"Landmark Updated", landmark};
  }catch(err){
    throw new Error("Invalid input for landmark edit");
  }
});

Parse.Cloud.define("login", async req => {
  const clientIp = req.headers["x-real-ip"];
  const {error, value} = validateLogin(req.params);
  if(error){
    insertFailedAttempt(clientIp);
    throw new Error(error.details[0].message);
  }

  try{
    const response = await Parse.User.logIn(value.username, value.password);
    clearFailedAttempts(clientIp);
    return {objectId: response.id, sessionToken: response.get("sessionToken") };
  }catch(err){
    insertFailedAttempt(clientIp);
    throw new Error("Invalid credentials");
  }

});


