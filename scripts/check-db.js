const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://courel_svc:Sa10ta10!@192.168.1.62:5432/courel_energy?schema=public'
});

async function run() {
  const c = await pool.connect();
  try {
    const result = await c.query("SELECT year, peaje_p1, financiacion_bono_social_mes FROM annual_regulated_costs LIMIT 1");
    console.log('Database Result:', JSON.stringify(result.rows[0], null, 2));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    c.release();
    await pool.end();
  }
}

run();
