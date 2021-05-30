const config = {
    host            : process.env.DB_HOST || "localhost",
    user            : process.env.DB_USER || "root",
    password        : process.env.DB_PASS || 'shubham1',
    database        : process.env.DB_NAME || 'Events',
    options: {
        trustedConnection: true,
        enableArithAort: true,
    },
    port: 3306
}

module.exports = config;

