module.exports = {
    smtpserver: process.env.SMTPSERVER || 'office365.officer',
    smtpport: process.env.SMTPPORT || 587,
    user: process.env.USER || 'ecollect',
    pass:  process.env.PASS || 'abc.123'
}
