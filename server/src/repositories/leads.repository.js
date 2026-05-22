/**
 * src/repositories/leads.repository.js
 *
 * The ONLY file in the application that writes raw SQL.
 *
 * ═══════════════════════════════════════════════════════
 * WHAT IS THE REPOSITORY PATTERN?
 * ═══════════════════════════════════════════════════════
 * The repository pattern is an abstraction over your database.
 * Every other layer (service, controller) calls repository functions
 * like `leadsRepo.findById(id)` — they have no idea that PostgreSQL
 * is involved, what table the data comes from, or how the SQL is structured.
 *
 * WHY THIS MATTERS IN A REAL COMPANY:
 *   1. Swappable storage: If you migrate from PostgreSQL to MongoDB,
 *      you rewrite only this file. Services and controllers are untouched.
 *
 *   2. Testability: In tests, you mock/stub this layer. Your service
 *      logic is tested without a real database.
 *
 *   3. Readability: Services read like business logic ("get lead by id,
 *      if not found throw error"). They don't read like SQL.
 *
 *   4. Single responsibility: This file's only job is "translate between
 *      JavaScript objects and database rows." It does nothing else.
 *
 * RULES FOR THIS FILE:
 *   ✅ Write SQL queries
 *   ✅ Accept plain arguments (id, name, status…)
 *   ✅ Return plain JavaScript objects
 *   ❌ Never throw ApiError (that's the service layer's job)
 *   ❌ Never access req or res
 *   ❌ Never contain business logic
 * ═══════════════════════════════════════════════════════
 */

const db = require('../config/db');

const leadsRepository = {

  /**
   * Find all leads with optional search, filter, and pagination.
   *
   * Dynamic WHERE clause building is a classic pattern.
   * We build the conditions array and params array together,
   * ensuring the $N placeholders stay in sync with the params.
   *
   * SECURITY NOTE: params are passed to pg as parameterized values.
   * They are NEVER interpolated into the SQL string directly.
   * This is complete SQL injection protection.
   */
  async findAll({ search, status, source, page, limit }) {
    const conditions = [];
    const params     = [];
    let   paramIndex = 1;

    if (search) {
      // ILIKE = case-insensitive LIKE in PostgreSQL.
      // The OR covers both name and phone search in one condition.
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

  /**
   * Find a single lead by its UUID primary key.
   * Returns the row object or undefined (not null) if not found.
   */
  async findById(id) {
    const { rows } = await db.query(
      `SELECT id, name, phone, source, status, notes, created_at, updated_at
       FROM leads
       WHERE id = $1`,
      [id]
    );
    return rows[0]; // undefined if no match
  },

  /**
   * Find a lead by phone number (for duplicate detection).
   */
  async findByPhone(phone) {
    const { rows } = await db.query(
      `SELECT id, phone FROM leads WHERE phone = $1`,
      [phone]
    );
    return rows[0];
  },

  /**
   * Insert a new lead and return the full created record.
   * RETURNING * is a PostgreSQL feature — it returns the inserted row
   * without needing a second SELECT query. One round-trip to the DB.
   */
  async create({ name, phone, source, notes }) {
    const { rows } = await db.query(
      `INSERT INTO leads (name, phone, source, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, source, status, notes, created_at, updated_at`,
      [name, phone, source, notes || null]
    );
    return rows[0];
  },

  /**
   * Update only the status field of a lead.
   * The updated_at trigger handles the timestamp automatically.
   */
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

  /**
   * Delete a lead by ID.
   * Returns the deleted row (useful for a "Lead deleted: John Doe" message).
   */
  async deleteById(id) {
    const { rows } = await db.query(
      `DELETE FROM leads
       WHERE id = $1
       RETURNING id, name, phone`,
      [id]
    );
    return rows[0]; // undefined if no row matched
  },

  /**
   * Aggregate counts by status — used for the dashboard.
   * A single SQL query replaces 4 separate count queries.
   * FILTER (WHERE ...) is a PostgreSQL aggregate extension — efficient.
   */
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