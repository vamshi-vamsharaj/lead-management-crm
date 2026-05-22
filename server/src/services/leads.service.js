/**
 * src/services/leads.service.js
 *
 * Business logic layer.
 *
 * ═══════════════════════════════════════════════════════
 * WHAT BELONGS IN A SERVICE?
 * ═══════════════════════════════════════════════════════
 * Business logic is the "rules of your application" — everything that
 * isn't HTTP plumbing (controllers) or database I/O (repositories).
 *
 * Examples in this file:
 *   - "A lead with the same phone number cannot be created twice"
 *   - "You cannot update the status of a lead that doesn't exist"
 *   - "A deleted lead should return the deleted record for confirmation"
 *
 * WHY NOT PUT THIS IN CONTROLLERS?
 *   If business logic lives in controllers, it's tied to HTTP.
 *   You can't call it from a background job, a CLI script, a webhook handler,
 *   or a test without simulating an HTTP request. Service functions are
 *   plain JavaScript functions — callable from anywhere.
 *
 * WHY NOT PUT THIS IN REPOSITORIES?
 *   Repositories know about SQL and tables. They shouldn't know about
 *   "duplicate lead" business rules or "lead not found" application errors.
 *   Mixing them creates a maintenance nightmare.
 *
 * RULES FOR THIS FILE:
 *   ✅ Call repository functions
 *   ✅ Apply business rules and validations
 *   ✅ Throw ApiError for business rule violations
 *   ✅ Return plain JavaScript objects
 *   ❌ Never access req or res
 *   ❌ Never write SQL
 * ═══════════════════════════════════════════════════════
 */

const leadsRepository = require('../repositories/leads.repository');
const ApiError        = require('../utils/ApiError');
const { PAGINATION }  = require('../utils/constants');

const leadsService = {

  /**
   * Get all leads with filtering, search, and pagination.
   */
  async getAllLeads(queryParams) {
    const {
      search,
      status,
      source,
      page  = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = queryParams;

    // Clamp limit to the max allowed to prevent "?limit=99999" abuse.
    const safeLimitedLimit = Math.min(limit, PAGINATION.MAX_LIMIT);

    return leadsRepository.findAll({
      search,
      status,
      source,
      page,
      limit: safeLimitedLimit,
    });
  },

  /**
   * Get a single lead by ID.
   * BUSINESS RULE: If the lead doesn't exist, that's an error — not a null response.
   */
  async getLeadById(id) {
    const lead = await leadsRepository.findById(id);

    if (!lead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    return lead;
  },

  /**
   * Create a new lead.
   * BUSINESS RULE: Phone numbers must be unique across all leads.
   *
   * WHY CHECK IN THE SERVICE, not just rely on the DB UNIQUE constraint?
   *   The DB constraint is the safety net — it will prevent duplicates even
   *   if the service check somehow misses (race condition, direct DB access).
   *   But if we rely ONLY on the DB constraint, the error message is a raw
   *   PostgreSQL error: "duplicate key value violates unique constraint leads_phone_key".
   *   Our service check lets us throw a clear: "A lead with this phone already exists."
   *   The errorHandler also translates the DB error as a backup.
   */
  async createLead({ name, phone, source, notes }) {
    // Business rule: no duplicate phone numbers
    const existingLead = await leadsRepository.findByPhone(phone);
    if (existingLead) {
      throw ApiError.conflict(
        `A lead with phone number "${phone}" already exists.`
      );
    }

    const newLead = await leadsRepository.create({ name, phone, source, notes });
    return newLead;
  },

  /**
   * Update a lead's status.
   * BUSINESS RULE: Lead must exist before updating.
   */
  async updateLeadStatus(id, status) {
    // Verify existence first — gives a clear 404 instead of a silent no-op
    const existingLead = await leadsRepository.findById(id);
    if (!existingLead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    const updatedLead = await leadsRepository.updateStatus(id, status);
    return updatedLead;
  },

  /**
   * Delete a lead.
   * BUSINESS RULE: Lead must exist before deleting.
   * Returns the deleted lead data so the controller can confirm what was deleted.
   */
  async deleteLead(id) {
    const existingLead = await leadsRepository.findById(id);
    if (!existingLead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    const deletedLead = await leadsRepository.deleteById(id);
    return deletedLead;
  },

  /**
   * Get dashboard statistics.
   * Pure read operation — no business rules needed, just fetch and return.
   */
  async getDashboardStats() {
    return leadsRepository.getStats();
  },
};

module.exports = leadsService;