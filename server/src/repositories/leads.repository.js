
const db = require('../config/db');

const leadsRepository = {


  async findAll({ search, status, source, page, limit }) {
    const conditions = [];
    const params     = [];
    let   paramIndex = 1;

    if (search) {
      conditions.push(
        `(name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (source) {
      conditions.push(`source = $${paramIndex}`);
      params.push(source);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // Get total count for pagination metadata
    const countQuery = `SELECT COUNT(*) FROM leads ${whereClause}`;
    const { rows: countRows } = await db.query(countQuery, params);
    const total = parseInt(countRows[0].count, 10);

    // Get paginated results
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const dataQuery = `
      SELECT
        id,
        name,
        phone,
        source,
        status,
        notes,
        created_at,
        updated_at
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;

    const { rows } = await db.query(dataQuery, params);

    return {
      leads: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },


  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, name, phone, source, status, notes, created_at, updated_at
       FROM leads
       WHERE id = $1`,
      [id]
    );
    return rows[0]; // undefined if no match
  },


  async findByPhone(phone) {
    const { rows } = await db.query(
      `SELECT id, phone FROM leads WHERE phone = $1`,
      [phone]
    );
    return rows[0];
  },


  async create({ name, phone, source, notes }) {
    const { rows } = await db.query(
      `INSERT INTO leads (name, phone, source, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, source, status, notes, created_at, updated_at`,
      [name, phone, source, notes || null]
    );
    return rows[0];
  },


  async updateStatus(id, status) {
    const { rows } = await db.query(
      `UPDATE leads
       SET status = $1
       WHERE id = $2
       RETURNING id, name, phone, source, status, notes, created_at, updated_at`,
      [status, id]
    );
    return rows[0]; // undefined if no row matched
  },


  async deleteById(id) {
    const { rows } = await db.query(
      `DELETE FROM leads
       WHERE id = $1
       RETURNING id, name, phone`,
      [id]
    );
    return rows[0]; // undefined if no row matched
  },


  async getStats() {
    const { rows } = await db.query(`
      SELECT
        COUNT(*)                                        AS total,
        COUNT(*) FILTER (WHERE status = 'new')          AS new_count,
        COUNT(*) FILTER (WHERE status = 'interested')   AS interested_count,
        COUNT(*) FILTER (WHERE status = 'not_interested') AS not_interested_count,
        COUNT(*) FILTER (WHERE status = 'converted')    AS converted_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS added_this_week
      FROM leads
    `);

    // Coerce strings to numbers (pg returns COUNT as string)
    const raw = rows[0];
    return {
      total:           parseInt(raw.total, 10),
      new:             parseInt(raw.new_count, 10),
      interested:      parseInt(raw.interested_count, 10),
      notInterested:   parseInt(raw.not_interested_count, 10),
      converted:       parseInt(raw.converted_count, 10),
      addedThisWeek:   parseInt(raw.added_this_week, 10),
      conversionRate:
        raw.total > 0
          ? Math.round((parseInt(raw.converted_count, 10) / parseInt(raw.total, 10)) * 100)
          : 0,
    };
  },
};

module.exports = leadsRepository;