/**
 * src/controllers/leads.controller.js
 *
 * HTTP adapter layer — thin bridge between HTTP and business logic.
 *
 * ═══════════════════════════════════════════════════════
 * WHAT BELONGS IN A CONTROLLER?
 * ═══════════════════════════════════════════════════════
 * Controllers are responsible for exactly three things:
 *   1. Extract data from the HTTP request (req.body, req.params, req.query)
 *   2. Call the appropriate service function
 *   3. Send the HTTP response using ApiResponse
 *
 * NOTHING ELSE.
 *
 * WHY SHOULD CONTROLLERS BE "THIN"?
 *   If your controller is 100 lines of business logic, you've coupled that
 *   logic to HTTP. A background job that needs to "create a lead" can't
 *   call your controller — it has no req/res. A service function can be
 *   called from anywhere.
 *
 *   A thin controller is essentially a 5-line function that says:
 *   "take this from the request, pass it to the service, send the result."
 *
 * RULES FOR THIS FILE:
 *   ✅ Read from req (body, params, query)
 *   ✅ Call service functions
 *   ✅ Use ApiResponse to send responses
 *   ✅ Use appropriate HTTP status codes
 *   ❌ Never write SQL
 *   ❌ Never contain if/else business logic
 *   ❌ Never throw errors (asyncHandler + service layer handle that)
 * ═══════════════════════════════════════════════════════
 */

const leadsService  = require('../services/leads.service');
const ApiResponse   = require('../utils/ApiResponse');
const { HTTP }      = require('../utils/constants');

const leadsController = {

  /**
   * GET /api/v1/leads
   * Get all leads with optional search, filter, pagination.
   */
  async getAll(req, res) {
    const result = await leadsService.getAllLeads(req.query);

    return ApiResponse.success(
      res,
      HTTP.OK,
      result,
      'Leads fetched successfully'
    );
  },

  /**
   * GET /api/v1/leads/stats
   * Get dashboard statistics.
   * NOTE: This route must be registered BEFORE /:id to prevent
   *       Express from treating "stats" as an ID parameter.
   */
  async getStats(req, res) {
    const stats = await leadsService.getDashboardStats();

    return ApiResponse.success(
      res,
      HTTP.OK,
      stats,
      'Statistics fetched successfully'
    );
  },

  /**
   * GET /api/v1/leads/:id
   * Get a single lead by UUID.
   */
  async getById(req, res) {
    const lead = await leadsService.getLeadById(req.params.id);

    return ApiResponse.success(
      res,
      HTTP.OK,
      lead,
      'Lead fetched successfully'
    );
  },

  /**
   * POST /api/v1/leads
   * Create a new lead.
   * req.body has already been validated and cleaned by the validate() middleware.
   */
  async create(req, res) {
    const { name, phone, source, notes } = req.body;
    const newLead = await leadsService.createLead({ name, phone, source, notes });

    return ApiResponse.success(
      res,
      HTTP.CREATED,    // 201 — not 200 — creation is semantically different
      newLead,
      'Lead created successfully'
    );
  },

  /**
   * PATCH /api/v1/leads/:id/status
   * Update a lead's status only.
   */
  async updateStatus(req, res) {
    const { id }     = req.params;
    const { status } = req.body;

    const updatedLead = await leadsService.updateLeadStatus(id, status);

    return ApiResponse.success(
      res,
      HTTP.OK,
      updatedLead,
      `Lead status updated to "${status}" successfully`
    );
  },

  /**
   * DELETE /api/v1/leads/:id
   * Delete a lead permanently.
   */
  async delete(req, res) {
    const deletedLead = await leadsService.deleteLead(req.params.id);

    return ApiResponse.success(
      res,
      HTTP.OK,
      { id: deletedLead.id, name: deletedLead.name },
      `Lead "${deletedLead.name}" deleted successfully`
    );
  },
};

module.exports = leadsController;