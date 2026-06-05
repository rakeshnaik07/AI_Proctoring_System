import { useState } from "react";
import { createExam } from "../../api/examApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

const CreateExam = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExam(formData);
      toast.success("Exam Created");
      setFormData({ title: "", description: "", duration: "" });
    } catch (error) {
      toast.error("Failed");
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors";

  return (
    <DashboardLayout>
      <div className="max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Create Exam</h1>
          <p className="text-sm text-zinc-500 mt-1">Add a new exam for students.</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Exam Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Description</label>
              <textarea
                name="description"
                placeholder="Brief description of the exam..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                placeholder="e.g. 60"
                value={formData.duration}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <button
                type="submit"
                className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <PlusCircle size={15} />
                Create Exam
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;