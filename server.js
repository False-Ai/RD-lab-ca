const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Schema definition for generic API creation
const tables = [
  { name: 'members', key: 'member_id', cols: ['first_name', 'last_name', 'email', 'phone', 'address', 'dob', 'join_date', 'status', 'emergency_contact'] },
  { name: 'trainers', key: 'trainer_id', cols: ['first_name', 'last_name', 'email', 'phone', 'specialization', 'hire_date', 'salary', 'experience_years', 'bio'] },
  { name: 'plans', key: 'plan_id', cols: ['name', 'description', 'duration_months', 'price', 'setup_fee', 'status', 'max_members', 'feature_list', 'terms'] },
  { name: 'equipments', key: 'equipment_id', cols: ['name', 'category', 'brand', 'purchase_date', 'price', 'warranty_expiry', 'condition', 'last_maintenance', 'location_id'] },
  { name: 'classes', key: 'class_id', cols: ['name', 'description', 'trainer_id', 'schedule_time', 'capacity', 'difficulty_level', 'duration_mins', 'location_id', 'status'] },
  { name: 'locations', key: 'location_id', cols: ['branch_name', 'address', 'city', 'state', 'zip_code', 'phone', 'manager_name', 'capacity', 'opening_hours'] },
  { name: 'payments', key: 'payment_id', cols: ['member_id', 'amount', 'payment_date', 'method', 'status', 'transaction_ref', 'discount_applied', 'late_fee', 'notes'] },
  { name: 'attendances', key: 'attendance_id', cols: ['member_id', 'class_id', 'attendance_date', 'check_in_time', 'check_out_time', 'status', 'notes', 'verified_by', 'device_id'] },
  { name: 'feedbacks', key: 'feedback_id', cols: ['member_id', 'feedback_date', 'rating', 'category', 'subject', 'comments', 'status', 'resolved_by', 'resolution_date'] },
  { name: 'promotions', key: 'promo_id', cols: ['code', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date', 'max_uses', 'current_uses', 'status'] },
];

tables.forEach(table => {
  const { name, key, cols } = table;
  const routePrefix = `/${name}`;

  // READ ALL
  app.get(`${routePrefix}/all`, async (req, res) => {
      try {
          const result = await pool.query(`SELECT * FROM ${name} ORDER BY ${key} ASC`);
          res.json(result.rows);
      } catch (err) {
          console.error(`Error GET ${name}:`, err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // CREATE
  app.post(`${routePrefix}/add`, async (req, res) => {
      try {
          // Replace empty strings with null for correct DB types
          const values = cols.map(c => (req.body[c] === '' || req.body[c] === undefined) ? null : req.body[c]);
          const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
          const query = `INSERT INTO ${name} (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`;
          const result = await pool.query(query, values);
          res.json(result.rows[0]);
      } catch (err) {
          console.error(`Error POST ${name}:`, err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // UPDATE
  app.put(`${routePrefix}/update/:id`, async (req, res) => {
      try {
          const { id } = req.params;
          const values = cols.map(c => (req.body[c] === '' || req.body[c] === undefined) ? null : req.body[c]);
          const setClause = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
          const query = `UPDATE ${name} SET ${setClause} WHERE ${key} = $${cols.length + 1} RETURNING *`;
          const result = await pool.query(query, [...values, id]);
          if (result.rows.length === 0) {
              return res.status(404).json({ message: "Record not found" });
          }
          res.json({ message: "Record updated successfully", data: result.rows[0] });
      } catch (err) {
          console.error(`Error PUT ${name}:`, err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });

  // DELETE
  app.delete(`${routePrefix}/delete/:id`, async (req, res) => {
      try {
          const { id } = req.params;
          const query = `DELETE FROM ${name} WHERE ${key} = $1 RETURNING *`;
          const result = await pool.query(query, [id]);
          if (result.rows.length === 0) {
              return res.status(404).json({ message: "Record not found" });
          }
          res.json({ message: "Record deleted successfully" });
      } catch (err) {
          console.error(`Error DELETE ${name}:`, err.message);
          res.status(500).json({ error: 'Server error' });
      }
  });
});

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`=================================================\n`);
});
