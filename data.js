const { Pool } = require('pg');

exports.getList = () => new Promise((resolve) => {
  const pool = new Pool({
    connectionString: '...',
  });
  pool.query('select * from list', (err, res) => {
    if (res) {
      resolve(res.rows);
    }
    pool.end();
  });
});