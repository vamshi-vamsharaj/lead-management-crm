
const leadsRepository = require('../repositories/leads.repository');
const ApiError        = require('../utils/ApiError');
const { PAGINATION }  = require('../utils/constants');

const leadsService = {


  async getAllLeads(queryParams) {
    const {
      search,
      status,
      source,
      page  = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = queryParams;

    const safeLimitedLimit = Math.min(limit, PAGINATION.MAX_LIMIT);

    return leadsRepository.findAll({
      search,
      status,
      source,
      page,
      limit: safeLimitedLimit,
    });
  },


  async getLeadById(id) {
    const lead = await leadsRepository.findById(id);

    if (!lead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    return lead;
  },


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


  async updateLeadStatus(id, status) {
    // Verify existence first — gives a clear 404 instead of a silent no-op
    const existingLead = await leadsRepository.findById(id);
    if (!existingLead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    const updatedLead = await leadsRepository.updateStatus(id, status);
    return updatedLead;
  },


  async deleteLead(id) {
    const existingLead = await leadsRepository.findById(id);
    if (!existingLead) {
      throw ApiError.notFound(`Lead with ID "${id}" not found.`);
    }

    const deletedLead = await leadsRepository.deleteById(id);
    return deletedLead;
  },


  async getDashboardStats() {
    return leadsRepository.getStats();
  },
};

module.exports = leadsService;