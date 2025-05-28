// dashboard_local.js - Updated with modal for viewing/editing tasks + styling moved to CSS file

// Modal Template
const modal = document.createElement('div');
modal.id = 'taskModal';
modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50';
modal.innerHTML = `
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
    <button id="closeModal" class="absolute top-2 right-3 text-slate-500 hover:text-red-500">✕</button>
    <h2 class="text-xl font-bold mb-4">Edit Task</h2>
    <form id="modalForm" class="space-y-4">
      <input type="hidden" name="taskId" id="modalTaskId">
      <div>
        <label class="block text-sm font-medium">Task Name</label>
        <input type="text" id="modalTaskName" class="w-full p-2 border rounded dark:bg-slate-700">
      </div>
      <div>
        <label class="block text-sm font-medium">Due Date</label>
        <input type="date" id="modalTaskDue" class="w-full p-2 border rounded dark:bg-slate-700">
      </div>
      <div>
        <label class="block text-sm font-medium">Status</label>
        <select id="modalTaskStatus" class="w-full p-2 border rounded dark:bg-slate-700">
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded">Save Changes</button>
    </form>
  </div>
`;
document.body.appendChild(modal);

// Modal Functions
function openModal(task) {
  document.getElementById('modalTaskId').value = task.id;
  document.getElementById('modalTaskName').value = task.name;
  document.getElementById('modalTaskDue').value = task.dueDate || '';
  document.getElementById('modalTaskStatus').value = task.status;
  modal.classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', () => modal.classList.add('hidden'));

document.getElementById('modalForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('modalTaskId').value;
  const name = document.getElementById('modalTaskName').value;
  const dueDate = document.getElementById('modalTaskDue').value;
  const status = document.getElementById('modalTaskStatus').value;
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].name = name;
    tasks[index].dueDate = dueDate;
    tasks[index].status = status;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    modal.classList.add('hidden');
    renderTasks();
    updateCharts(tasks);
  }
});

// Replace edit buttons
window.editTask = (id) => {
  const task = getTasks().find(t => t.id === id);
  if (task) openModal(task);
};
