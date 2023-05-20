//generate the secret and put it in your env vars
//then access by process.env.JWT_SECRET
console.log(require('crypto').randomBytes(64).toString('hex'))