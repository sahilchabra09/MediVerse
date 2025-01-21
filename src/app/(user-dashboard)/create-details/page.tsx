"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/moving-border";

export default function CreateDetails() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    age: 0,
    alcohol_consumption: "",
    blood_group: "",
    bmi: 0,
    chronic_conditions: "",
    clerkid: user?.id || "",
    current_health_conditions: "",
    current_medication: "",
    date_of_birth: "",
    dietary_preferences: "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    exercise_frequency: "",
    family_medical_history: "",
    first_name: user?.firstName || "",
    gender: "",
    height: 0,
    insurance_plan_number: "",
    insurance_provider: "",
    insurance_validity: "",
    known_allergies: "",
    last_name: user?.lastName || "",
    mental_health_conditions: "",
    phone_number: "",
    previous_major_diseases: "",
    previous_major_surgeries: "",
    smoking_status: "",
    vaccination_history: "",
    weight: 0
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/user/create-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/user-dashboard");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Last Name */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="date_of_birth"
                >
                  Date of Birth
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Gender */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <input
                  id="gender"
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Age */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Phone Number */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Address */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, Country"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Email */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="blood_group"
                >
                  Blood Group
                </label>
                <input
                  id="blood_group"
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  placeholder="e.g., A+, B-, O+"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* BMI */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="bmi"
                >
                  BMI
                </label>
                <input
                  id="bmi"
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  placeholder="BMI"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Weight */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="weight"
                >
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight in kg"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Height */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="height"
                >
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height in cm"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Known Allergies */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="known_allergies"
                >
                  Known Allergies
                </label>
                <textarea
                  id="known_allergies"
                  name="known_allergies"
                  value={formData.known_allergies}
                  onChange={handleChange}
                  placeholder="List any known allergies..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Current Medication */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="current_medication"
                >
                  Current Medication
                </label>
                <textarea
                  id="current_medication"
                  name="current_medication"
                  value={formData.current_medication}
                  onChange={handleChange}
                  placeholder="List any current medications..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Chronic Conditions */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="chronic_conditions"
                >
                  Chronic Conditions
                </label>
                <textarea
                  id="chronic_conditions"
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                  placeholder="List any chronic conditions..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Previous Major Diseases */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="previous_major_diseases"
                >
                  Previous Major Diseases
                </label>
                <textarea
                  id="previous_major_diseases"
                  name="previous_major_diseases"
                  value={formData.previous_major_diseases}
                  onChange={handleChange}
                  placeholder="List any previous major diseases..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Previous Major Surgeries */}
              <div className="col-span-2">
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="previous_major_surgeries"
                >
                  Previous Major Surgeries
                </label>
                <textarea
                  id="previous_major_surgeries"
                  name="previous_major_surgeries"
                  value={formData.previous_major_surgeries}
                  onChange={handleChange}
                  placeholder="List any previous major surgeries..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Family Medical History */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="family_medical_history"
                >
                  Family Medical History
                </label>
                <textarea
                  id="family_medical_history"
                  name="family_medical_history"
                  value={formData.family_medical_history}
                  onChange={handleChange}
                  placeholder="List any relevant family medical history..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Mental Health Conditions */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="mental_health_conditions"
                >
                  Mental Health Conditions
                </label>
                <textarea
                  id="mental_health_conditions"
                  name="mental_health_conditions"
                  value={formData.mental_health_conditions}
                  onChange={handleChange}
                  placeholder="Describe any mental health conditions..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Exercise Frequency */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="exercise_frequency"
                >
                  Exercise Frequency
                </label>
                <input
                  id="exercise_frequency"
                  type="text"
                  name="exercise_frequency"
                  value={formData.exercise_frequency}
                  onChange={handleChange}
                  placeholder="e.g., 3 times/week"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Dietary Preferences */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="dietary_preferences"
                >
                  Dietary Preferences
                </label>
                <input
                  id="dietary_preferences"
                  type="text"
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                  placeholder="e.g., Vegan, Vegetarian"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Smoking Status */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="smoking_status"
                >
                  Smoking Status
                </label>
                <input
                  id="smoking_status"
                  type="text"
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleChange}
                  placeholder="Smoker/Non-Smoker"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Alcohol Consumption */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="alcohol_consumption"
                >
                  Alcohol Consumption
                </label>
                <input
                  id="alcohol_consumption"
                  type="text"
                  name="alcohol_consumption"
                  value={formData.alcohol_consumption}
                  onChange={handleChange}
                  placeholder="Frequency/quantity if applicable"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Vaccination History */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="vaccination_history"
                >
                  Vaccination History
                </label>
                <textarea
                  id="vaccination_history"
                  name="vaccination_history"
                  value={formData.vaccination_history}
                  onChange={handleChange}
                  placeholder="List vaccinations/dates if possible"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Emergency & Insurance Info */}
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Emergency &amp; Insurance Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Contact Name */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="emergency_contact_name"
                >
                  Emergency Contact Name
                </label>
                <input
                  id="emergency_contact_name"
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  placeholder="Emergency Contact Name"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Relationship */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="emergency_contact_relationship"
                >
                  Relationship
                </label>
                <input
                  id="emergency_contact_relationship"
                  type="text"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleChange}
                  placeholder="e.g., Father, Friend"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Emergency Contact Phone */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="emergency_contact_phone"
                >
                  Emergency Contact Phone
                </label>
                <input
                  id="emergency_contact_phone"
                  type="text"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  placeholder="Emergency Phone Number"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Insurance Provider */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="insurance_provider"
                >
                  Insurance Provider
                </label>
                <input
                  id="insurance_provider"
                  type="text"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleChange}
                  placeholder="Insurance Provider"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Plan Number */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="insurance_plan_number"
                >
                  Plan Number
                </label>
                <input
                  id="insurance_plan_number"
                  type="text"
                  name="insurance_plan_number"
                  value={formData.insurance_plan_number}
                  onChange={handleChange}
                  placeholder="Insurance Plan Number"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
              {/* Insurance Validity */}
              <div>
                <label
                  className="block font-medium mb-1 text-gray-100"
                  htmlFor="insurance_validity"
                >
                  Insurance Validity
                </label>
                <input
                  id="insurance_validity"
                  type="date"
                  name="insurance_validity"
                  value={formData.insurance_validity}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center ">
          <Button
             type="submit"
             disabled={isSubmitting}
            borderRadius="1.75rem"
            className=" w-full bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


   