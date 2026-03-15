const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgresql://courel_svc:Sa10ta10!@192.168.1.62:5432/courel_energy?schema=public'
});

async function run() {
  const c = await pool.connect();
  try {
    const adminId = '1de70a79-da56-462c-82f5-a2017ca0ed9f';
    const password = 'Sa10ta10!';
    const hash = await bcrypt.hash(password, 10);
    const result = await c.query(
      "UPDATE users SET password_hash=$2, role='admin' WHERE id=$1 RETURNING email",
      [adminId, hash]
    );
    if (result.rows.length > 0) {
      console.log('Password updated for:', result.rows[0].email);
    } else {
      console.log('User not found with that ID');
    }
  } finally {
    c.release();
    await pool.end();
  }
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
