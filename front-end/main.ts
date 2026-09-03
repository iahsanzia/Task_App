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
  } catch (err: unknown) {
    showError(err);
  }
};
const showError = (error: unknown): void => {
  if (error instanceof Error) {
    alert(error.message);
    return;
  }
  alert("An unknown error occurred");
};

const formatDueDate = (dueDate: string | null): string => {
  //"2026-01-01T00:00:00.000Z"
  if (!dueDate) return "";
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isValidInputDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // need to check if the date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  if (date.getTime() < today.getTime()) return false;
  return true;
};

// need to update the functionality of prompt

const promptForDate = (message: string): string | null => {
  let input = prompt(message);

  if (input === null) return null;

  while (input.trim() !== "" && !isValidInputDate(input.trim())) {
    input = prompt(
      "Invalid date format or past date. Enter valid Date (YYYY-MM-DD) or leave blank to cancel:",
    );
    if (input === null) return null;
  }
  return input.trim() === "" ? null : input.trim();
};

const createButton = (
  label: string,
  additionalClasses: string,
  taskId: number,
): HTMLButtonElement => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn btn-small ${additionalClasses}`;
  button.dataset.id = String(taskId);
  button.textContent = label;
  return button;
};

const createTaskElement = (task: Task): HTMLLIElement => {
  const li = document.createElement("li");
  li.className = "task-item";

  if (task.completed) {
    li.classList.add("completed");
  }
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.dataset.id = String(task.id);
  checkbox.checked = task.completed;
  checkbox.setAttribute(
    "aria-label",
    `Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`,
  );

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;
  content.appendChild(title);

  if (task.dueDate) {
    const dueDate = document.createElement("div");
    dueDate.className = "task-due-date";
    dueDate.textContent = `Due: ${formatDueDate(task.dueDate)}`;
    content.appendChild(dueDate);
  }

  if (task.note) {
    const note = document.createElement("div");
    note.className = "task-note hidden";
    note.id = `note-${task.id}`;
    note.textContent = task.note;
    content.appendChild(note);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const viewButton = createButton("View", "btn-success view", task.id);
  const editButton = createButton("Edit", "btn-primary edit", task.id);
  const deleteButton = createButton("Delete", "btn-danger delete", task.id);

  actions.append(viewButton, editButton, deleteButton);

  li.append(checkbox, content, actions);
  return li;
};

const renderTasks = (tasks: Task[]): void => {
  list.replaceChildren();

  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;

  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    fragment.appendChild(taskElement);
  });
  list.appendChild(fragment);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const note = noteInput.value.trim();
  const dueDate = dueDateInput.value || null;

  if (!title) return;

  try {
    await createTask(title, note || undefined, dueDate || undefined);

    titleInput.value = "";
    noteInput.value = "";
    dueDateInput.value = "";

    await loadTasks();
  } catch (err: unknown) {
    showError(err);
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
        await loadTasks();
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
      const newDueDate = promptForDate("Enter new due date (YYYY-MM-DD)");

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

      await loadTasks();
    }
  } catch (err: unknown) {
    showError(err);
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

      await loadTasks();
    } catch (err: unknown) {
      showError(err);
    }
  }
});

void loadTasks();
