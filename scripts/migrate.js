// migrate.js - Create oauth tables and seed initial data
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgresql://courel_svc:Sa10ta10!@192.168.1.62:5432/courel_energy?schema=public'
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connected to database. Running migrations...');

    // Create accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, provider_account_id)
      );
    `);
    console.log('accounts table ready');

    // Create sessions table  
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        session_token TEXT UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('sessions table ready');

    // Create verification_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        UNIQUE(identifier, token)
      );
    `);
    console.log('verification_tokens table ready');

    // Seed admin user
    const adminId = '1de70a79-da56-462c-82f5-a2017ca0ed9f';
    const adminEmail = 'admin@Facturio.com';
    const passwordHash = await bcrypt.hash('Admin1234!', 10);

    // Upsert admin
    await client.query(`
      INSERT INTO users (id, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            role = 'admin'
    `, [adminId, adminEmail, passwordHash]);
    console.log('Admin user seeded:', adminEmail);

    // Seed rates
    const tarifas = [
      { com: 'Octopus Energy', nom: 'Octopus 3', pp1: 35.405, pp2: 9.855, ep1: 19.4, ep2: 11.5, ep3: 7.7, exc: 4.0, em: 0, ekwp: 0 },
      { com: 'Holaluz', nom: 'Tarifa Verde 3P', pp1: 35.5, pp2: 6.2, ep1: 15.9, ep2: 12.5, ep3: 9.2, exc: 7.0, em: 0, ekwp: 0 },
      { com: 'Iberdrola', nom: 'One Luz 3P', pp1: 38.04, pp2: 6.79, ep1: 18.5, ep2: 14.2, ep3: 10.1, exc: 5.0, em: 0, ekwp: 0 },
      { com: 'Endesa', nom: 'Tempo Fijo 3P', pp1: 37.59, pp2: 6.49, ep1: 17.8, ep2: 13.5, ep3: 9.5, exc: 5.5, em: 0, ekwp: 0 },
      { com: 'Naturgy', nom: 'Gas + Luz 3.0', pp1: 36.0, pp2: 7.2, ep1: 19.2, ep2: 15.1, ep3: 11.0, exc: 4.8, em: 0, ekwp: 0 },
      { com: 'Repsol Elec.', nom: 'Precio Fijo 3P', pp1: 39.0, pp2: 6.5, ep1: 16.9, ep2: 13.0, ep3: 9.8, exc: 6.0, em: 0, ekwp: 0 },
    ];

    for (const t of tarifas) {
      const exists = await client.query(
        `SELECT id FROM rates WHERE user_id=$1 AND comercializadora=$2 AND nombre=$3`,
        [adminId, t.com, t.nom]
      );
      if (exists.rows.length === 0) {
        await client.query(`
          INSERT INTO rates (id, user_id, comercializadora, nombre, pot_p1_punta, pot_p2_valle,
            energia_p1_punta, energia_p2_llana, energia_p3_valle, excedentes, cuota_mensual, extra_kwp, is_public)
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        `, [adminId, t.com, t.nom, t.pp1, t.pp2, t.ep1, t.ep2, t.ep3, t.exc, t.em, t.ekwp]);
        console.log(`  + ${t.com} - ${t.nom}`);
      } else {
        console.log(`  = ${t.com} - ${t.nom} (already exists)`);
      }
    }

    console.log('\nAll done!');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
