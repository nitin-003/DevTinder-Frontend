import React from "react";
import { useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import ErrorAlert from "./ErrorAlert";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { getErrorMessage } from "../utils/getErrorMessage";

// Values must match what the backend accepts
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Other" },
];

const normalizeGender = (gender) => {
  const value = String(gender || "").trim().toLowerCase();
  if (value === "other") return "others";
  return GENDER_OPTIONS.some((o) => o.value === value) ? value : "";
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const validate = ({ firstName, lastName, photoUrl, age }) => {
  const errors = {};
  if (!String(firstName).trim()) errors.firstName = "First name is required.";
  else if (String(firstName).trim().length < 4) errors.firstName = "First name must be at least 4 characters.";
  if (!String(lastName).trim()) errors.lastName = "Last name is required.";
  if (age !== "" && age !== null) {
    const n = Number(age);
    if (!Number.isInteger(n) || n < 18 || n > 100) {
      errors.age = "Enter a whole number between 18 and 100.";
    }
  }
  if (photoUrl && !isValidUrl(photoUrl.trim())) {
    errors.photoUrl = "Enter a valid link starting with http:// or https://";
  }
  return errors;
};

const Field = ({ label, hint, error, children }) => (
  <label className="form-control w-full">
    <div className="label pb-1">
      <span className="label-text font-medium">{label}</span>
    </div>
    {children}
    {(error || hint) && (
      <div className="label pt-1">
        <span className={`label-text-alt ${error ? "text-error" : "text-base-content/60"}`}>
          {error || hint}
        </span>
      </div>
    )}
  </label>
);

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(normalizeGender(user.gender));
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || ""
  );
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const clearFieldError = (name) =>
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  const saveProfile = async () => {
    setError("");

    const errors = validate({ firstName, lastName, photoUrl, age });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          photoUrl: photoUrl.trim(),
          age,
          gender,
          about,
          skills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));

      setShowToast(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 3000);
    }
    catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Couldn't save your profile. Please try again."));
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto my-10 px-4">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Edit your <span className="brand-text">profile</span></h1>
          <p className="mt-1 text-base-content/60">
            This is how other developers will see you. Changes show in the preview as you type.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8 items-start">
          <form
            className="surface-card shadow-lg"
            noValidate
            onSubmit={(e) => { e.preventDefault(); saveProfile(); }}
          >
            <div className="card-body gap-2">
              <h2 className="card-title text-lg">Basic info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="First name" error={fieldErrors.firstName}>
                  <input
                    type="text"
                    value={firstName}
                    className={`input input-bordered w-full ${fieldErrors.firstName ? "input-error" : ""}`}
                    onChange={(e) => { setFirstName(e.target.value); clearFieldError("firstName"); }}
                  />
                </Field>
                <Field label="Last name" error={fieldErrors.lastName}>
                  <input
                    type="text"
                    value={lastName}
                    className={`input input-bordered w-full ${fieldErrors.lastName ? "input-error" : ""}`}
                    onChange={(e) => { setLastName(e.target.value); clearFieldError("lastName"); }}
                  />
                </Field>
                <Field label="Age" error={fieldErrors.age}>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    className={`input input-bordered w-full ${fieldErrors.age ? "input-error" : ""}`}
                    onChange={(e) => { setAge(e.target.value); clearFieldError("age"); }}
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={gender}
                    className="select select-bordered w-full"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="divider my-1"></div>
              <h2 className="card-title text-lg">Your profile</h2>

              <Field
                label="Photo URL"
                error={fieldErrors.photoUrl}
                hint="Paste a link to a square image for the best result."
              >
                <input
                  type="text"
                  value={photoUrl}
                  placeholder="https://..."
                  className={`input input-bordered w-full ${fieldErrors.photoUrl ? "input-error" : ""}`}
                  onChange={(e) => { setPhotoUrl(e.target.value); clearFieldError("photoUrl"); }}
                />
              </Field>
              <Field label="About" hint={`${about.length} characters`}>
                <textarea
                  value={about}
                  rows={4}
                  placeholder="Tell other developers about yourself"
                  className="textarea textarea-bordered w-full"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </Field>
              <Field label="Skills" hint="Separate skills with commas, e.g. React, Node.js, MongoDB">
                <input
                  type="text"
                  value={skills}
                  placeholder="React, Node.js, MongoDB"
                  className="input input-bordered w-full"
                  onChange={(e) => setSkills(e.target.value)}
                />
              </Field>

              <ErrorAlert message={error} onDismiss={() => setError("")} className="mt-2" />

              <div className="card-actions justify-end mt-4">
                <button type="submit" className="btn btn-primary w-full sm:w-auto sm:px-10" disabled={saving}>
                  {saving && <span className="loading loading-spinner loading-sm"></span>}
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          </form>

          <div className="lg:sticky lg:top-24 flex flex-col items-center gap-3">
            <span className="tooltip tooltip-top" data-tip="This is how other developers will see your card">
              <span className="badge badge-outline">Live preview</span>
            </span>
            <UserCard
              user={{ firstName, lastName, photoUrl, age, gender, about, skills }}
              showActions={false}
            />
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-end toast-bottom z-50 p-4 sm:p-6">
          <div role="status" className="toast-slide-in flex items-center gap-3 rounded-xl border border-success/30 bg-base-100 px-4 py-3 shadow-xl">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-content text-sm">✓</span>
            <span className="text-sm font-medium">Profile saved successfully.</span>
            <button type="button" onClick={() => setShowToast(false)} className="ml-2 opacity-60 hover:opacity-100" aria-label="Dismiss">✕</button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
