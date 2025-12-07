import { useState } from "react";
import axios from "axios";
import {
  BadgePlus,
  CalendarClock,
  Check,
  Monitor,
  Plus,
  Save,
  X,
} from "lucide-react";

const initialWorkspace = {
  name: "",
  type: "desk",
  location: "",
  capacity: "",
  amenities: [],
  status: "available",
  description: "",
  isActive: true,
};

const workspaceTypes = [
  {
    value: "desk",
    label: "Desk",
    description: "Best for individual work",
    icon: Monitor,
  },
  {
    value: "meeting-room",
    label: "Meeting Room",
    description: "Ideal for group collaboration",
    icon: CalendarClock,
  },
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Maintenance" },
];

const AddWorkspace = () => {
  const [formData, setFormData] = useState(initialWorkspace);
  const [amenityDraft, setAmenityDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const updateField = (key, value) => {
    setFormData((prev) => {
      if (key === "type" && value === "desk") {
        return { ...prev, type: value, capacity: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleAmenityAdd = () => {
    const trimmedAmenity = amenityDraft.trim();
    if (!trimmedAmenity || formData.amenities.includes(trimmedAmenity)) return;
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, trimmedAmenity],
    }));
    setAmenityDraft("");
  };

  const handleAmenityRemove = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiresCapacity = formData.type === "meeting-room";
    const capacityValue = Number(formData.capacity);
    if (
      requiresCapacity &&
      (!formData.capacity || Number.isNaN(capacityValue) || capacityValue <= 0)
    ) {
      setFeedback({
        type: "error",
        message: "Meeting rooms need a capacity above zero.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: null, message: "" });

    const workspace = {
      name: formData.name.trim(),
      type: formData.type,
      location: formData.location.trim(),
      amenities: formData.amenities,
      status: formData.status,
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    if (formData.type === "meeting-room") {
      workspace.capacity = capacityValue;
    }

    try {
      console.log("this is workspace", workspace);
      const response = await axios.post(
        "http://localhost:3000/dashboard/workspace",
        workspace
      );

      setFeedback({
        type: "success",
        message: "Workspace saved successfully.",
      });
      setFormData(initialWorkspace);
      setAmenityDraft("");
      console.info("Workspace response", response.data);
    } catch (error) {
      console.error("Failed to create workspace", error);
      setFeedback({
        type: "error",
        message: "Unable to save workspace right now. Please retry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <BadgePlus className="h-4 w-4" />
              New workspace
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Add workspace details
            </h1>
            <p className="text-sm text-slate-500">
              Capture the essentials so teammates can find and reserve the right
              spot easily.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData(initialWorkspace);
                setAmenityDraft("");
                setFeedback({ type: null, message: "" });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
            <button
              form="add-workspace"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save workspace"}
            </button>
          </div>
        </header>

        {feedback.message && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form
          id="add-workspace"
          onSubmit={handleSubmit}
          className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
        >
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Workspace name
              </label>
              <input
                required
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g. Desk B-205"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Workspace type
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {workspaceTypes.map(
                  ({ value, label, description, icon: Icon }) => {
                    const isActive = formData.type === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("type", value)}
                        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`rounded-xl p-3 ${
                            isActive ? "bg-white/70" : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isActive ? "text-indigo-600" : "text-slate-500"
                            }`}
                          />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">
                            {label}
                          </span>
                          <span
                            className={`mt-1 block text-xs ${
                              isActive ? "text-indigo-600/80" : "text-slate-500"
                            }`}
                          >
                            {description}
                          </span>
                        </span>
                        {isActive && (
                          <Check className="ml-auto h-4 w-4 text-indigo-600" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                required
                value={formData.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="e.g. Floor 2, Zone B"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            {formData.type === "meeting-room" && (
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.capacity}
                  onChange={(event) =>
                    updateField("capacity", event.target.value)
                  }
                  placeholder="Number of seats"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Highlight what makes this workspace unique"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <div className="mt-2 grid gap-2">
                {statusOptions.map(({ value, label }) => {
                  const isActive = formData.status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateField("status", value)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {label}
                      {isActive && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Amenities
                </label>
                {formData.amenities.length > 0 && (
                  <span className="text-xs font-medium text-indigo-600">
                    {formData.amenities.length} selected
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={amenityDraft}
                  onChange={(event) => setAmenityDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAmenityAdd();
                    }
                  }}
                  placeholder="Add an amenity and press Enter"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={handleAmenityAdd}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              {formData.amenities.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleAmenityRemove(amenity)}
                        className="text-indigo-500 transition hover:text-indigo-700"
                        aria-label={`Remove ${amenity}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-400">
                  No amenities added yet. Common examples include monitors,
                  phone booths, or whiteboards.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Show in directory
                </p>
                <p className="text-xs text-slate-500">
                  Inactive workspaces remain hidden from booking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateField("isActive", !formData.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  formData.isActive ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    formData.isActive ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-indigo-50 px-4 py-3 text-xs text-indigo-600">
              Data preview updates live so you can quickly confirm accuracy
              before saving.
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default AddWorkspace;
