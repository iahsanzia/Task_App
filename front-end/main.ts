import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "./api/tasksApi.js";
import type { Task } from "./types/taskTypes.js";

const form = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const noteInput = document.getElementById("note") as HTMLInputElement;
const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;

const list = document.getElementById("task-list") as HTMLUListElement;
const taskCount = document.getElementById("task-count") as HTMLElement;
const emptyState = document.getElementById("empty-state") as HTMLElement;

const loadTasks = async () => {
  try {
    const tasks = await getTasks();
    renderTasks(tasks);
  } catch (err: any) {
    alert(err.message);
  }
};

const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) return "";
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderTasks = (tasks: Task[]) => {
  list.innerHTML = "";

  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;

  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input 
        type="checkbox" 
        class="task-checkbox" 
        data-id="${task.id}" 
        ${task.completed ? "checked" : ""}
      />

      <div class="task-content">
        <div class="task-title">${task.title}</div>
        ${
          task.dueDate
            ? `<div class="task-due-date">Due: ${formatDueDate(task.dueDate)}</div>`
            : ""
        }
        ${
          task.note
            ? `<div class="task-note hidden" id="note-${task.id}">${task.note}</div>`
            : ""
        }
      </div>

      <div class="task-actions">
        <button class="btn btn-small btn-success view" data-id="${task.id}">
          View
        </button>
        <button class="btn btn-small btn-primary edit" data-id="${task.id}">
          Edit
        </button>
        <button class="btn btn-small btn-danger delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    `;

    list.appendChild(li);
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const note = noteInput.value.trim();
  const dueDate = dueDateInput.value ? dueDateInput.value : null;

  if (!title) return;

  try {
    await createTask(title, note || undefined);

    titleInput.value = "";
    noteInput.value = "";
    dueDateInput.value = "";

    loadTasks();
  } catch (err: any) {
    alert(err.message);
  }
});

list.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const id = Number(target.getAttribute("data-id"));

  if (!id) return;

  try {
    if (target.classList.contains("delete")) {
      if (confirm("Delete this task?")) {
        await deleteTask(id);
        loadTasks();
      }
      return;
    }

    if (target.classList.contains("view")) {
      const noteEl = document.getElementById(`note-${id}`);
      if (noteEl) {
        noteEl.classList.toggle("hidden");
      }
      return;
    }

    if (target.classList.contains("edit")) {
      const newTitle = prompt("Enter new title:");
      const newNote = prompt("Enter new note:");
      const newDueDate = prompt("Enter new due date (YYYY-MM-DD):");

      if (newTitle === null && newNote === null && newDueDate === null) return;

      const updates: Partial<{
        title: string;
        note: string | null;
        dueDate: string | null;
      }> = {};

      if (newTitle !== null) {
        const t = newTitle.trim();
        if (t.length > 0) updates.title = t;
      }

      if (newNote !== null) {
        updates.note = newNote.trim() === "" ? null : newNote.trim();
      }

      if (newDueDate !== null) {
        updates.dueDate = newDueDate.trim() === "" ? null : newDueDate.trim();
      }

      if (Object.keys(updates).length === 0) return;

      await updateTask(id, updates);

      loadTasks();
    }
  } catch (err: any) {
    alert(err.message);
  }
});

list.addEventListener("change", async (e) => {
  const target = e.target as HTMLInputElement;

  if (target.classList.contains("task-checkbox")) {
    const id = Number(target.getAttribute("data-id"));

    try {
      await updateTask(id, {
        completed: target.checked,
      });

      loadTasks();
    } catch (err: any) {
      alert(err.message);
    }
  }
});

loadTasks();
