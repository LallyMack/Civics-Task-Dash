// dashboard_local.js

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskListContainer = document.getElementById('taskListContainer');

  // Theme toggle
  const darkToggle = document.getElementById('darkToggle');
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
  darkToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Add task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = {
      id: Date.now().toString(),
      name: taskForm.taskName.value,
      category: taskForm.taskCategory.value,
      status: taskForm.taskStatus.value,
      assignedTo: taskForm.taskAssignee.value,
      dueDate: taskForm.taskDueDate.value,
      priority: taskForm.taskPriority.value
    };
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    taskForm.reset();
    renderTasks();
    updateCharts(tasks);
  });

  // CSV Export
  window.exportCSV = () => {
    const tasks = getTasks();
    const csv = Papa.unparse(tasks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'civics_tasks.csv');
    link.click();
  };

  // Helpers
  function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    const tasks = getTasks();
    const category = document.getElementById('filterCategory').value;
    const assignee = document.getElementById('filterAssignee').value;
    const priority = document.getElementById('filterPriority').value;
    const status = document.getElementById('filterStatus').value;

    const filtered = tasks.filter(t =>
      (category === 'All' || t.category === category) &&
      (assignee === 'All' || t.assignedTo === assignee) &&
      (priority === 'All' || t.priority === priority) &&
      (status === 'All' || t.status === status)
    );

    taskListContainer.innerHTML = '';
    for (const task of filtered) {
      const div = document.createElement('div');
      let pClass = task.priority === 'High' ? 'priority-high' : task.priority === 'Medium' ? 'priority-medium' : 'priority-low';
      div.className = `p-4 mb-4 rounded shadow border-l-4 ${pClass}`;
      div.innerHTML = `
        <h3 class="text-lg font-semibold">${task.name}</h3>
        <p class="text-sm">${task.category} | ${task.assignedTo} | ${task.status} | ${task.priority}</p>
        <p class="text-xs text-slate-500">Due: ${task.dueDate || 'N/A'}</p>
      `;
      taskListContainer.appendChild(div);
    }
  }

  function updateCharts(tasks) {
    const ctxCat = document.getElementById('categoryChart');
    const ctxAssignee = document.getElementById('assigneeChart');

    const byCategory = {};
    const byAssignee = {};
    for (const t of tasks) {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      byAssignee[t.assignedTo] = (byAssignee[t.assignedTo] || 0) + 1;
    }

    new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: Object.keys(byCategory),
        datasets: [{
          data: Object.values(byCategory),
          backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#a78bfa', '#f87171']
        }]
      }
    });

    new Chart(ctxAssignee, {
      type: 'bar',
      data: {
        labels: Object.keys(byAssignee),
        datasets: [{
          data: Object.values(byAssignee),
          label: 'Tasks',
          backgroundColor: '#38bdf8'
        }]
      }
    });
  }

  // Filter bindings
  for (const id of ['filterCategory', 'filterAssignee', 'filterPriority', 'filterStatus']) {
    document.getElementById(id).addEventListener('change', renderTasks);
  }

  renderTasks();
  updateCharts(getTasks());
});
