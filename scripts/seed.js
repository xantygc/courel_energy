const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgresql://courel_svc:Sa10ta10!@192.168.1.62:5432/courel_energy?schema=public'
});

async function run() {
  const c = await pool.connect();
  try {
    const adminId = '1de70a79-da56-462c-82f5-a2017ca0ed9f';

    // Check if admin exists
    const adminCheck = await c.query('SELECT id, email FROM users WHERE id=$1', [adminId]);
    if (adminCheck.rows.length > 0) {
      const hash = await bcrypt.hash('Admin1234!', 10);
      await c.query("UPDATE users SET password_hash=$2, role='admin' WHERE id=$1", [adminId, hash]);
      console.log('Admin updated:', adminCheck.rows[0].email);
    } else {
      console.log('Admin user not found! Run with correct user ID.');
    }

    // Seed rates
    const rates = [
      ['Octopus Energy','Octopus 3',35.405,9.855,19.4,11.5,7.7,4.0],
      ['Holaluz','Tarifa Verde 3P',35.5,6.2,15.9,12.5,9.2,7.0],
      ['Iberdrola','One Luz 3P',38.04,6.79,18.5,14.2,10.1,5.0],
      ['Endesa','Tempo Fijo 3P',37.59,6.49,17.8,13.5,9.5,5.5],
      ['Naturgy','Gas + Luz 3.0',36.0,7.2,19.2,15.1,11.0,4.8],
      ['Repsol Elec.','Precio Fijo 3P',39.0,6.5,16.9,13.0,9.8,6.0],
    ];

    for (const [com,nom,pp1,pp2,ep1,ep2,ep3,exc] of rates) {
      const ex = await c.query(
        'SELECT id FROM rates WHERE user_id=$1 AND comercializadora=$2 AND nombre=$3',
        [adminId, com, nom]
      );
      if (ex.rows.length === 0) {
        await c.query(
          `INSERT INTO rates (id, user_id, comercializadora, nombre,
            pot_p1_punta, pot_p2_valle, energia_p1_punta, energia_p2_llana, energia_p3_valle,
            excedentes, cuota_mensual, extra_kwp, is_public)
           VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,0,0,true)`,
          [adminId, com, nom, pp1, pp2, ep1, ep2, ep3, exc]
        );
        console.log('+', com, '-', nom);
      } else {
        console.log('=', com, '-', nom, '(ya existe)');
      }
    }

    console.log('\nHecho!');
  } finally {
    c.release();
    await pool.end();
  }
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
