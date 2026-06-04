import { useState } from "react";
import { createExam } from "../../api/examApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";

const CreateExam = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createExam(formData);

      toast.success("Exam Created");

      setFormData({
        title: "",
        description: "",
        duration: "",
      });
    } catch (error) {
      toast.error("Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold mb-6">
          Create Exam
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Exam Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <button
            className="bg-white text-black px-6 py-3 rounded"
          >
            Create Exam
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;