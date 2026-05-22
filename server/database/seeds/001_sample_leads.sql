-- =============================================================
-- Seed: 001_sample_leads.sql
--
-- WHY SEED DATA MATTERS FOR DEVELOPMENT:
--   Building a UI against an empty database is like designing
--   a restaurant menu without food. You can't see how the leads
--   table looks with real data, can't test filtering/sorting,
--   can't validate that status badges render correctly, and
--   can't tell if your pagination logic works.
--
--   Seed data should be:
--   1. Realistic — real-looking names/phones, not "test1", "test2"
--   2. Varied — cover every status and every source
--   3. Safe — uses INSERT ... ON CONFLICT DO NOTHING so running
--              the seed multiple times doesn't throw errors
-- =============================================================

INSERT INTO leads (name, phone, source, status, notes, created_at) VALUES

  -- ── CONVERTED leads (the "success" state — should show prominently on dashboard)
  ('Ravi Kumar',        '+91-9812345670', 'call',      'converted',     'Very interested from the first call. Signed up for premium plan.', NOW() - INTERVAL '12 days'),
  ('Sneha Patel',       '+91-8876543210', 'whatsapp',  'converted',     'Followed up 3 times. Converted on the fourth touchpoint.',         NOW() - INTERVAL '8 days'),

  -- ── INTERESTED leads (pipeline — hot prospects)
  ('Arjun Mehta',       '+91-9988776655', 'field',     'interested',    'Met at the Delhi trade expo. Wants a callback Monday morning.',    NOW() - INTERVAL '5 days'),
  ('Priya Sharma',      '+91-7765432109', 'call',      'interested',    'Asked for pricing details. Send brochure before follow-up.',      NOW() - INTERVAL '3 days'),
  ('Mohammed Akhtar',   '+91-9001234567', 'whatsapp',  'interested',    'Responded to the campaign. Wants to see a demo.',                 NOW() - INTERVAL '2 days'),

  -- ── NEW leads (just added — default status)
  ('Kavita Nair',       '+91-8123456789', 'field',     'new',           'Collected at Hyderabad tech meetup. Yet to be contacted.',        NOW() - INTERVAL '1 day'),
  ('Deepak Verma',      '+91-9654321098', 'call',      'new',           NULL,                                                               NOW() - INTERVAL '18 hours'),
  ('Anita Singh',       '+91-8901234567', 'whatsapp',  'new',           'Came through Instagram ad. Needs initial outreach.',              NOW() - INTERVAL '6 hours'),

  -- ── NOT INTERESTED leads (important for analytics — shows conversion rate)
  ('Suresh Reddy',      '+91-7890123456', 'call',      'not_interested','Budget constraints this quarter. Revisit in Q2.',                 NOW() - INTERVAL '10 days'),
  ('Lakshmi Iyer',      '+91-9345678901', 'field',     'not_interested','Already using a competitor product. Not switching now.',          NOW() - INTERVAL '7 days')

ON CONFLICT (phone) DO NOTHING;

-- Confirm what was inserted
SELECT
  name,
  phone,
  source,
  status,
  created_at::DATE AS added_on
FROM leads
ORDER BY created_at DESC;