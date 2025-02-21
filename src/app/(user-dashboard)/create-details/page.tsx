"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/moving-border";

export default function CreateDetails() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
        address: "",
        age: 0,
        alcohol_consumption: "",
        blood_group: "",
        bmi: 0,
        chronic_conditions: "",
        clerkid: user?.id || "696969",
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


  useEffect(() => {
    if (formData.height > 0 && formData.weight > 0) {
      const heightInMeters = formData.height / 100;
      const calculatedBMI = formData.weight / (heightInMeters * heightInMeters);
      setFormData(prev => ({ ...prev, bmi: Number(calculatedBMI.toFixed(1)) }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const API_ENDPOINT = "https://mediverse-backend.onrender.com/user/create-details"
  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("🔹 Sending form data to API:", API_ENDPOINT);
    console.log("📌 Data:", JSON.stringify(formData, null, 2));
  
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`🛠 Type of "${key}": ${typeof value}`);
    });
  
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
  
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const responseText = await response.text(); 
  
        console.log("🔹 Response Status:", response.status);
        console.log("🔹 Response Text:", responseText);
  
        if (response.ok) {
          console.log("✅ Successfully submitted!");
          router.push("/user-dashboard");
        } else {
          console.error("❌ Failed to submit form. Server Response:", responseText);
        }
      } catch (error) {
        console.error("❌ Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6 bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 focus-within:border-neutral-700 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-neutral-100">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block font-medium mb-2 text-neutral-200">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                />
              </div>
      
              {/* Last Name */}
              <div>
                <label className="block font-medium mb-2 text-neutral-200">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                />
              </div>
      
              {/* Date of Birth */}
              
              <div>
                <label className="block font-medium mb-2 text-neutral-200">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700
                            appearance-none pr-10" // Hide placeholder & allow space for icon
                  required
                />
              </div>
      
              {/* Gender */}
              <div>
                <label className="block font-medium mb-2 text-neutral-200">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                >
                  <option value="" className="text-neutral-400">Select Gender</option>
                  <option value="male" className="bg-neutral-800">Male</option>
                  <option value="female" className="bg-neutral-800">Female</option>
                  <option value="other" className="bg-neutral-800">Other</option>
                </select>
              </div>
      
              {/* Age */}
              <div>
                <label className="block font-medium mb-2 text-neutral-200">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  min="0"
                  required
                />
              </div>
      
              {/* Phone Number */}
              <div>
                <label className="block font-medium mb-2 text-neutral-200">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                />
              </div>
              
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-2 text-neutral-200">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                />
              </div>
      
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-2 text-neutral-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
               className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 bg-neutral-900 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Blood Group</label>
               
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-700 
                          focus:ring-2 focus:ring-neutral-400 focus:border-transparent focus:outline-none
                          appearance-none pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZTdlN2U3Ij48cGF0aCBkPSJNMTIgMTUuNDE2TDMuMjkyIDYuNzA0IDQuNzA1IDUuMjkgMTIgMTIuNTg1bDcuMjk1LTcuMjk1IDEuNDEzIDEuNDE0TDEyIDE1LjQxNnoiLz48L3N2Zz4=')] 
                          bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.5rem_1.5rem]"
                >
                          <option value="" className="bg-neutral-800 text-neutral-400">
                            Select Blood Type
                          </option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                            <option
                              key={type}
                              value={type}
                              className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                            >
                              {type}
                            </option>
                          ))}
                        </select>


                 
            
              </div>
  
              {/* Height */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  min="0"
                  required
                />
              </div>
  
              {/* Weight */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  min="0"
                  required
                />
              </div>
  
              {/* BMI */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">BMI</label>
                <input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  readOnly
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Known Allergies */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1 text-gray-100">Known Allergies</label>
                <textarea
                  name="known_allergies"
                  value={formData.known_allergies}
                  onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  rows={3}
                />
              </div>
  
              {/* Chronic Conditions */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1 text-gray-100">Chronic Conditions</label>
                <textarea
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  rows={3}
                />
              </div>
  
              {/* Previous Major Diseases */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1 text-gray-100">Previous Major Diseases</label>
                <textarea
                  name="previous_major_diseases"
                  value={formData.previous_major_diseases}
                  onChange={handleChange}
               className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  rows={3}
                />
              </div>
  
              {/* Vaccination History */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1 text-gray-100">Vaccination History</label>
                <textarea
                  name="vaccination_history"
                  value={formData.vaccination_history}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-100">Current Health Conditions</label>
          <textarea
            name="current_health_conditions"
            value={formData.current_health_conditions}
            onChange={handleChange}
          className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
            rows={3}
            placeholder="Describe any current health issues"
          />
        </div>

        {/* Current Medication */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-100">Current Medication</label>
          <textarea
            name="current_medication"
            value={formData.current_medication}
            onChange={handleChange}
          className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
            rows={3}
            placeholder="List all current medications and dosages"
          />
        </div>

        {/* Mental Health Conditions */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-100">Mental Health Conditions</label>
          <textarea
            name="mental_health_conditions"
            value={formData.mental_health_conditions}
            onChange={handleChange}
           className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
            rows={3}
            placeholder="Describe any mental health conditions"
          />
        </div>

        {/* Family Medical History */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 text-gray-100">Family Medical History</label>
          <textarea
            name="family_medical_history"
            value={formData.family_medical_history}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
            placeholder="List relevant family medical history"
          />
        </div>
            </div>
          </div>
        );
  
      case 3:
        return (
          <div className="p-4 bg-neutral-900 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Lifestyle & Insurance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Smoking Status */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Smoking Status</label>
                <select
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                >
                  <option value="">Select Status</option>
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
  
              {/* Alcohol Consumption */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Alcohol Consumption</label>
                <select
                  name="alcohol_consumption"
                  value={formData.alcohol_consumption}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                >
                  <option value="">Select Frequency</option>
                  <option value="never">Never</option>
                  <option value="occasional">Occasional</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
  
              {/* Dietary Preferences */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Dietary Preferences</label>
                <input
                  type="text"
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                  placeholder="e.g., Vegetarian, Vegan"
                />
              </div>
  
              {/* Exercise Frequency */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Exercise Frequency</label>
                <select
                  name="exercise_frequency"
                  value={formData.exercise_frequency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">3-4 times/week</option>
                  <option value="occasional">Occasionally</option>
                  <option value="never">Never</option>
                </select>
              </div>
  
              {/* Insurance Provider */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Insurance Provider</label>
                <input
                  type="text"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleChange}
               className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Insurance Plan Number */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Insurance Plan Number</label>
                <input
                  type="text"
                  name="insurance_plan_number"
                  value={formData.insurance_plan_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Insurance Validity */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Insurance Validity</label>
                <input
                  type="date"
                  name="insurance_validity"
                  value={formData.insurance_validity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Emergency Contact Name */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Emergency Contact Relationship */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Relationship</label>
                <input
                  type="text"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
  
              {/* Emergency Contact Phone */}
              <div>
                <label className="block font-medium mb-1 text-gray-100">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                 className="w-full px-4 py-3 bg-neutral-800 text-neutral-100 rounded-lg border border-neutral-600 
                            focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 placeholder-neutral-700"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`w-1/3 text-center ${currentStep === step ? "text-neutral-100" : "text-gray-400"}`}
              >
                Step {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-neutral-700 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) * 33.33)}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleStepSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                  className="bg-white dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800"
              >
                Previous
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              borderRadius="1.75rem"
              className="bg-white dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800"
            >
              {currentStep === 3 
                ? (isSubmitting ? "Submitting..." : "Complete Profile")
                : "Next Step"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}