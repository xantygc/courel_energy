const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://courel_svc:Sa10ta10!@192.168.1.62:5432/courel_energy?schema=public'
});

async function run() {
  const c = await pool.connect();
  try {
    console.log('Adding column financiacion_bono_social_mes...');
    await c.query(`
      ALTER TABLE annual_regulated_costs 
      ADD COLUMN IF NOT EXISTS financiacion_bono_social_mes DECIMAL(10, 4) DEFAULT 0.0000;
    `);
    
    console.log('Updating current year cost with 0.5816...');
    await c.query(`
      UPDATE annual_regulated_costs 
      SET financiacion_bono_social_mes = 0.5816 
      WHERE year = 2026;
    `);
    
    console.log('Database updated successfully.');
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    c.release();
    await pool.end();
  }
}

run();
