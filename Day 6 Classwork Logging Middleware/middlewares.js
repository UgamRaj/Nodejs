export const logginMiddleware = (req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  let currentTime = Date.now();
  next();
  let timeToProcess = Date.now() - currentTime;
  console.log(timeToProcess);
};
