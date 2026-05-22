
const leadsService  = require('../services/leads.service');
const ApiResponse   = require('../utils/ApiResponse');
const { HTTP }      = require('../utils/constants');

const leadsController = {


  async getAll(req, res) {
    const result = await leadsService.getAllLeads(req.query);

    return ApiResponse.success(
      res,
      HTTP.OK,
      result,
      'Leads fetched successfully'
    );
  },


  async getStats(req, res) {
    const stats = await leadsService.getDashboardStats();

    return ApiResponse.success(
      res,
      HTTP.OK,
      stats,
      'Statistics fetched successfully'
    );
  },


  async getById(req, res) {
    const lead = await leadsService.getLeadById(req.params.id);

    return ApiResponse.success(
      res,
      HTTP.OK,
      lead,
      'Lead fetched successfully'
    );
  },


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