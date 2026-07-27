import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  Compass,
  Hotel,
  MapPin,
  Route,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

const travelStyles = [
  "Relaxing",
  "Adventure",
  "Cultural",
  "Family",
  "Romantic",
  "Business",
];

const interestOptions = [
  "Nature",
  "Beaches",
  "Mountains",
  "History",
  "Shopping",
  "Local Food",
  "Nightlife",
  "Photography",
];

const initialFormData = {
  source: "",
  destination: "",
  startDate: "",
  endDate: "",
  adults: 1,
  children: 0,
  budget: "",
  travelStyle: "Relaxing",
  transportPreference: "Any",
  accommodationPreference: "Comfortable",
  foodPreference: "Any",
  interests: [],
  additionalNotes: "",
};

function CreateTripPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const minimumDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function handleInterestChange(interest) {
    setFormData((currentData) => {
      const alreadySelected = currentData.interests.includes(interest);

      return {
        ...currentData,
        interests: alreadySelected
          ? currentData.interests.filter((item) => item !== interest)
          : [...currentData.interests, interest],
      };
    });
  }

  function validateForm() {
    const validationErrors = {};

    if (!formData.source.trim()) {
      validationErrors.source = "Starting location is required.";
    }

    if (!formData.destination.trim()) {
      validationErrors.destination = "Destination is required.";
    }

    if (!formData.startDate) {
      validationErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      validationErrors.endDate = "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      validationErrors.endDate =
        "End date must be after the start date.";
    }

    if (!formData.budget || Number(formData.budget) < 1000) {
      validationErrors.budget =
        "Please enter a budget of at least ₹1,000.";
    }

    if (Number(formData.adults) < 1) {
      validationErrors.adults =
        "At least one adult traveller is required.";
    }

    return validationErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    navigate("/processing", {
      state: {
        tripData: {
          ...formData,
          adults: Number(formData.adults),
          children: Number(formData.children),
          budget: Number(formData.budget),
        },
      },
    });
  }

  return (
    <main className="min-h-screen px-5 py-7 text-[#17211a] md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526459] transition hover:text-[#173d2e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="rounded-full border border-[#dfe8d8] bg-white px-4 py-2 text-sm font-bold text-[#46604f] shadow-sm">
            Journey preferences
          </div>
        </div>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="relative overflow-hidden rounded-[32px] bg-[#173d2e] p-7 text-white shadow-[0_25px_70px_rgba(40,65,45,0.15)] md:p-9 lg:sticky lg:top-7">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#eaff9d]/15 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#f8df58]/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaff9d] text-[#173d2e]">
                <Route className="h-7 w-7" />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#c9d9cd]">
                Create your journey
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight">
                Tell us where you want to go.
              </h1>

              <p className="mt-5 leading-7 text-[#d8e3da]">
                Share your dates, budget and preferences. Your complete
                journey will be prepared around your choices.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "Destination planning",
                    description: "Route and important places",
                  },
                  {
                    icon: CircleDollarSign,
                    title: "Budget planning",
                    description: "Estimated expense breakdown",
                  },
                  {
                    icon: CalendarDays,
                    title: "Daily schedule",
                    description: "Organised day-wise activities",
                  },
                ].map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5 text-[#eaff9d]" />
                    </div>

                    <div>
                      <p className="font-extrabold">{title}</p>
                      <p className="mt-1 text-sm text-[#c9d9cd]">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_25px_70px_rgba(40,65,45,0.09)] md:p-9"
          >
            <FormSection
              number="01"
              icon={MapPin}
              title="Where are you travelling?"
              description="Enter your starting point and destination."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Starting location"
                  error={errors.source}
                >
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="Example: Delhi"
                    className={inputClassName(errors.source)}
                  />
                </FormField>

                <FormField
                  label="Destination"
                  error={errors.destination}
                >
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Example: Goa"
                    className={inputClassName(errors.destination)}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              number="02"
              icon={CalendarDays}
              title="When are you travelling?"
              description="Choose your travel dates and number of travellers."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Start date"
                  error={errors.startDate}
                >
                  <input
                    type="date"
                    name="startDate"
                    min={minimumDate}
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={inputClassName(errors.startDate)}
                  />
                </FormField>

                <FormField
                  label="End date"
                  error={errors.endDate}
                >
                  <input
                    type="date"
                    name="endDate"
                    min={formData.startDate || minimumDate}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={inputClassName(errors.endDate)}
                  />
                </FormField>

                <FormField
                  label="Adults"
                  error={errors.adults}
                >
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className={inputClassName(errors.adults)}
                  />
                </FormField>

                <FormField label="Children">
                  <input
                    type="number"
                    name="children"
                    min="0"
                    max="20"
                    value={formData.children}
                    onChange={handleInputChange}
                    className={inputClassName()}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              number="03"
              icon={CircleDollarSign}
              title="What is your travel budget?"
              description="Enter the total estimated budget for the complete journey."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Total budget"
                  error={errors.budget}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#506257]">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="budget"
                      min="1000"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="40000"
                      className={`${inputClassName(
                        errors.budget
                      )} pl-9`}
                    />
                  </div>
                </FormField>

                <FormField label="Preferred transport">
                  <select
                    name="transportPreference"
                    value={formData.transportPreference}
                    onChange={handleInputChange}
                    className={inputClassName()}
                  >
                    <option value="Any">Any suitable option</option>
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Bus">Bus</option>
                    <option value="Car">Car or cab</option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              number="04"
              icon={Compass}
              title="Choose your travel style"
              description="Select the experience that best matches your journey."
            >
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {travelStyles.map((style) => {
                  const selected = formData.travelStyle === style;

                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() =>
                        setFormData((currentData) => ({
                          ...currentData,
                          travelStyle: style,
                        }))
                      }
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left font-extrabold transition ${
                        selected
                          ? "border-[#39734f] bg-[#edf8d9] text-[#173d2e]"
                          : "border-[#dfe8d8] bg-white text-[#56665c] hover:border-[#afc4a5]"
                      }`}
                    >
                      {style}

                      {selected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173d2e] text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <FormSection
              number="05"
              icon={Hotel}
              title="Stay and food preferences"
              description="Choose the options that suit your comfort and food choices."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Accommodation">
                  <select
                    name="accommodationPreference"
                    value={formData.accommodationPreference}
                    onChange={handleInputChange}
                    className={inputClassName()}
                  >
                    <option value="Budget">Budget stay</option>
                    <option value="Comfortable">
                      Comfortable stay
                    </option>
                    <option value="Premium">Premium stay</option>
                    <option value="Luxury">Luxury stay</option>
                  </select>
                </FormField>

                <FormField label="Food preference">
                  <div className="relative">
                    <Utensils className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#708077]" />

                    <select
                      name="foodPreference"
                      value={formData.foodPreference}
                      onChange={handleInputChange}
                      className={`${inputClassName()} pl-12`}
                    >
                      <option value="Any">Any food preference</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">
                        Non-vegetarian
                      </option>
                      <option value="Vegan">Vegan</option>
                      <option value="Local Cuisine">
                        Local cuisine
                      </option>
                    </select>
                  </div>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              number="06"
              icon={Sparkles}
              title="What are you interested in?"
              description="Select one or more activities for your journey."
            >
              <div className="flex flex-wrap gap-3">
                {interestOptions.map((interest) => {
                  const selected =
                    formData.interests.includes(interest);

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestChange(interest)}
                      className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                        selected
                          ? "border-[#173d2e] bg-[#173d2e] text-white"
                          : "border-[#dce6d5] bg-[#f8fbf5] text-[#56665c] hover:border-[#afc4a5]"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <FormField label="Additional notes">
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="500"
                    placeholder="Add any special requirements or preferences..."
                    className={`${inputClassName()} resize-none`}
                  />
                </FormField>
              </div>
            </FormSection>

            <div className="mt-9 flex flex-col items-center justify-between gap-4 rounded-[26px] bg-[#f4f9ef] p-5 sm:flex-row">
              <div>
                <p className="font-black text-[#173d2e]">
                  Ready to prepare your journey?
                </p>
                <p className="mt-1 text-sm text-[#69776e]">
                  Review your details before continuing.
                </p>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#173d2e] px-7 py-4 font-extrabold text-white shadow-lg shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-[#20533f] sm:w-auto"
              >
                Prepare my journey
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function FormSection({
  number,
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="border-b border-[#e5ece0] py-8 first:pt-0 last:border-b-0">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf8d9] text-[#39734f]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#829087]">
            Step {number}
          </p>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#6b776e]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-[#3e4f45]">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-sm font-semibold text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function inputClassName(error) {
  return `w-full rounded-2xl border bg-[#fbfdf9] px-4 py-3.5 text-[#17211a] outline-none transition placeholder:text-[#9ba69f] ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-[#dce6d5] focus:border-[#679173] focus:ring-4 focus:ring-[#dff0d9]"
  }`;
}

export default CreateTripPage;