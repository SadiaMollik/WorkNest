import React, { useMemo, useState } from "react";

const TAG_OPTIONS = [
  "Design",
  "Operations",
  "Marketing",
  "Creative",
  "Development",
  "Backend",
  "Setup",
  "Infrastructure",
  "Documentation",
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To-do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const TaskModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Design");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTag("Design");
    setDueDate("");
    setStatus("todo");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      tag,
      dueDate: dueDate ? dueDate : null,
      status,
    });

    resetForm();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Dark overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-label="Close modal"
      />

      {/* Modal box */}
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Task</h1>
            <p className="text-sm text-gray-500">
              Create a card for your board.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g. Wireframes"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Subtitle / Description
              </label>
              <input
                placeholder="Add context or acceptance criteria"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tag
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
