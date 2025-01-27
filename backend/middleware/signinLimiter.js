import rateLimit from "express";

const signinLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 signin requests per 'window' per minute
  message: {
    message: "Too many signin attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
});

export default signinLimiter;
