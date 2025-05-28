// dashboard_local.js - Updated with modal for viewing/editing tasks + styling moved to CSS file

// Seed demo tasks if none exist
if (!localStorage.getItem('tasks')) {
  const seedTasks = [
    { id: '1', name: 'Prepare meeting agenda', status: 'To Do', dueDate: '2025-06-01', category: 'Housekeeping', priority: 'High', assignedTo: 'Larisa', createdAt: new Date().toISOString() },
    { id: '2', name: 'Update GitBook', status: 'In Progress', dueDate: '2025-06-03', category: 'Comms', priority: 'Medium', assignedTo: 'Michael Madoff', createdAt: new Date().toISOString() },
    { id: '3', name: 'Organize working group call', status: 'Done', dueDate: '2025-05-20', category: 'Working Groups', priority: 'Low', assignedTo: 'Reshan Fernando', createdAt: new Date().toISOString() }
  ];
  localStorage.setItem('tasks', JSON.stringify(seedTasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function renderTasks() {
  const taskListContainer = document.getElementById('taskListContainer');
  const tasks = getTasks();
  taskListContainer.innerHTML = '';

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = `p-4 mb-4 rounded shadow border-l-4 task-tile priority-${task.priority.toLowerCase()}`;
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <strong>${task.name}</strong>
          <div class="text-xs text-slate-500">${task.category} | ${task.assignedTo} | Due: ${task.dueDate}</div>
        </div>
        <div class="space-x-2">
          <button onclick="editTask('${task.id}')" class="text-purple-600">✏️</button>
          <button onclick="deleteTask('${task.id}')" class="text-red-600">🗑</button>
        </div>
      </div>
    `;
    taskListContainer.appendChild(div);
  });

  updateSummary(tasks);
  updateCharts(tasks);
}

function updateCharts(tasks) {
  const ctx1 = document.getElementById('categoryChart');
  const ctx2 = document.getElementById('assigneeChart');

  if (!ctx1 || !ctx2) return;

  const byCategory = {};
  const byAssignee = {};

  tasks.forEach(task => {
    byCategory[task.category] = (byCategory[task.category] || 0) + 1;
    byAssignee[task.assignedTo] = (byAssignee[task.assignedTo] || 0) + 1;
  });

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(byCategory),
      datasets: [{ label: 'Tasks by Category', data: Object.values(byCategory), backgroundColor: '#a855f7' }]
    },
    options: { responsive: true }
  });

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: Object.keys(byAssignee),
      datasets: [{ label: 'Tasks by Assignee', data: Object.values(byAssignee), backgroundColor: '#d1b92a' }]
    },
    options: { responsive: true }
  });
}

function updateSummary(tasks) {
  const dashboardSummary = document.getElementById('dashboardSummary');
  const today = new Date();
  const open = tasks.filter(t => t.status !== 'Done').length;
  const overdue = tasks.filter(t => new Date(t.dueDate) < today && t.status !== 'Done').length;
  const dueSoon = tasks.filter(t => {
    const due = new Date(t.dueDate);
    return t.status !== 'Done' && due >= today && due <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
  }).length;

  dashboardSummary.innerHTML = `
    <div class="task-tile text-center p-4">
      <div class="text-sm text-gray-500">Open Tasks</div>
      <div class="text-2xl font-bold">${open}</div>
    </div>
    <div class="task-tile text-center p-4">
      <div class="text-sm text-gray-500">Overdue</div>
      <div class="text-2xl text-red-500 font-bold">${overdue}</div>
    </div>
    <div class="task-tile text-center p-4">
      <div class="text-sm text-gray-500">Due Soon</div>
      <div class="text-2xl text-yellow-600 font-bold">${dueSoon}</div>
    </div>
  `;
}

document.getElementById('toggleDarkMode').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

document.getElementById('exportCSV').addEventListener('click', () => {
  const tasks = getTasks();
  const csv = [Object.keys(tasks[0]).join(',')].concat(tasks.map(t => Object.values(t).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.csv';
  a.click();
});

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
