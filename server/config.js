module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/timesheetdemo',
  jwt: {
    secretOrKey: process.env.JWT_SECRET || 'kjhgrdjf8723x95yrjkcsdjalkjd7379423',
    jwtFromRequest: require('passport-jwt').ExtractJwt.fromAuthHeader()
  }
};