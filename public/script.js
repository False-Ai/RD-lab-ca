const API_BASE = 'http://localhost:3001';

const schemas = [
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

let currentSchema = null;
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav-menu');
    schemas.forEach(s => {
        const btn = document.createElement('button');
        btn.textContent = s.name.toUpperCase();
        btn.className = 'nav-btn';
        btn.onclick = () => loadTable(s.name);
        nav.appendChild(btn);
    });

    document.getElementById('add-btn').onclick = () => openModal();
    document.getElementById('close-modal').onclick = closeModal;
    document.getElementById('crud-form').onsubmit = handleFormSubmit;

    loadTable('members');
});

async function loadTable(tableName) {
    currentSchema = schemas.find(s => s.name === tableName);
    document.getElementById('table-title').textContent = tableName.toUpperCase();
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === tableName.toUpperCase());
    });

    renderHeaders();
    await fetchData();
}

function renderHeaders() {
    const thead = document.getElementById('table-head');
    thead.innerHTML = '';
    const tr = document.createElement('tr');
    
    const thId = document.createElement('th');
    thId.textContent = currentSchema.key.toUpperCase();
    tr.appendChild(thId);

    currentSchema.cols.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.replace(/_/g, ' ').toUpperCase();
        tr.appendChild(th);
    });

    const thAct = document.createElement('th');
    thAct.textContent = 'ACTIONS';
    tr.appendChild(thAct);
    
    thead.appendChild(tr);
}

async function fetchData() {
    try {
        const res = await fetch(`${API_BASE}/${currentSchema.name}/all`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        renderRows(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('table-body').innerHTML = '<tr><td colspan="11" style="text-align:center;">Failed to load data. Is the backend running?</td></tr>';
    }
}

function renderRows(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;">No records found.</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        
        const tdId = document.createElement('td');
        tdId.textContent = row[currentSchema.key];
        tr.appendChild(tdId);

        currentSchema.cols.forEach(col => {
            const td = document.createElement('td');
            let val = row[col];
            if (val && typeof val === 'string' && val.includes('T') && val.includes('Z')) {
                val = val.split('T')[0];
            }
            td.textContent = val || '';
            tr.appendChild(td);
        });

        const tdAct = document.createElement('td');
        
        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Edit';
        btnEdit.className = 'btn warning action-btn';
        btnEdit.onclick = () => openModal(row);
        
        const btnDel = document.createElement('button');
        btnDel.textContent = 'Delete';
        btnDel.className = 'btn danger action-btn';
        btnDel.onclick = () => deleteRecord(row[currentSchema.key]);
        
        tdAct.appendChild(btnEdit);
        tdAct.appendChild(btnDel);
        tr.appendChild(tdAct);
        
        tbody.appendChild(tr);
    });
}

function openModal(rowData = null) {
    editingId = rowData ? rowData[currentSchema.key] : null;
    document.getElementById('form-title').textContent = rowData ? `Edit ${currentSchema.name}` : `Add ${currentSchema.name}`;
    
    const fieldsDiv = document.getElementById('form-fields');
    fieldsDiv.innerHTML = '';

    currentSchema.cols.forEach(col => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = col.replace(/_/g, ' ').toUpperCase();
        
        let inputType = 'text';
        if (col.includes('date') || col === 'dob') inputType = 'date';
        else if (col.includes('time')) inputType = 'time';
        else if (col.includes('email')) inputType = 'email';
        else if (col.includes('id') || col.includes('price') || col.includes('amount') || col.includes('salary') || col.includes('capacity')) inputType = 'number';

        const input = document.createElement('input');
        input.type = inputType;
        input.name = col;
        input.id = col;
        
        if (rowData && rowData[col] !== null) {
            let val = rowData[col];
            if (inputType === 'date' && typeof val === 'string' && val.includes('T')) {
                val = val.split('T')[0];
            }
            input.value = val;
        }

        group.appendChild(label);
        group.appendChild(input);
        fieldsDiv.appendChild(group);
    });

    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const url = editingId 
        ? `${API_BASE}/${currentSchema.name}/update/${editingId}`
        : `${API_BASE}/${currentSchema.name}/add`;
    
    const method = editingId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            closeModal();
            fetchData();
        } else {
            alert('Error saving record!');
        }
    } catch (error) {
        console.error('Error saving:', error);
    }
}

async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/${currentSchema.name}/delete/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            fetchData();
        } else {
            alert('Error deleting record!');
        }
    } catch (error) {
        console.error('Error deleting:', error);
    }
}
