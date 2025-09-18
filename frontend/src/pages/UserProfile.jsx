import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../Contexts";

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(user);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       // Replace with your API call here to get user details
  //       const userData = await fetch("/api/user/profile").then((res) =>
  //         res.json()
  //       );

  //       setProfile({
  //         ...userData,
  //         password: "",
  //         confirmPassword: "",
  //         preferences: JSON.stringify(userData.preferences ?? {}),
  //       });
  //       if (userData.profile_photo) setPreviewPhoto(userData.profile_photo);
  //     } catch {
  //       // Handle fetch error
  //       toast.error("Failed to load profile");
  //       console.error("Failed to load user profile");
  //     }
  //   }
  //   fetchUser();
  // }, []);

  function validate() {
    const newErrors = {};
    if (!profile.fullname.trim()) newErrors.fullname = "Full name is required";
    if (profile.password && profile.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (profile.password !== profile.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!profile.phone.match(/^\+?[\d\s\-]{7,15}$/))
      newErrors.phone = "Enter a valid phone number";
    if (!profile.address.trim()) newErrors.address = "Address is required";
    if (profile.birthdate && isNaN(Date.parse(profile.birthdate)))
      newErrors.birthdate = "Enter a valid date";
    try {
      JSON.parse(profile.preferences);
    } catch {
      newErrors.preferences = "Preferences must be valid JSON";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, profile_photo: "Please upload a valid image" });
        toast.error("Please upload a valid image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
        setProfile({ ...profile, profile_photo: reader.result });
        setErrors({ ...errors, profile_photo: null });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSave() {
    if (!validate()) {
      toast.error("Details are not validatd!");
      return;
    }
    setLoading(true);
    setSuccessMsg("");
    try {
      const payload = { ...profile };
      delete payload.confirmPassword;

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setSuccessMsg("Profile updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update profile");
        setErrors({ form: data.message || "Failed to update profile" });
      }
    } catch {
      toast.error("Something went wrong.");
      setErrors({ form: "Network error, please try again" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md mt-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      {errors.form && (
        <div className="mb-4 text-red-600 font-semibold bg-red-100 p-3 rounded">
          {errors.form}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 text-green-700 font-semibold bg-green-100 p-3 rounded">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={previewPhoto || "https://avatar.iran.liara.run/public/20"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-amber-500"
            />
            <label className="absolute bottom-0 right-0 bg-amber-600 p-2 rounded-full cursor-pointer hover:bg-amber-700 transition">
              <Camera size={18} className="text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                className="w-full px-2 py-1 focus:outline-none"
                value={profile.fullname || ""}
                onChange={(e) =>
                  setProfile({ ...profile, fullname: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullname && (
              <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                disabled
                className="w-full px-2 py-1 bg-gray-100 cursor-not-allowed focus:outline-none"
                value={profile.email || ""}
                placeholder="Email"
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                className={`w-full px-2 py-1 focus:outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                value={profile.password}
                onChange={(e) =>
                  setProfile({ ...profile, password: e.target.value })
                }
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                className={`w-full px-2 py-1 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                value={profile.confirmPassword}
                onChange={(e) =>
                  setProfile({ ...profile, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                className={`w-full px-2 py-1 focus:outline-none ${
                  errors.phone ? "border-red-500" : ""
                }`}
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+1 555 1234567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Address</label>
            <div className="flex items-start border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <MapPin size={18} className="text-gray-400 mt-2" />
              <textarea
                rows={3}
                className={`w-full px-2 py-1 resize-none focus:outline-none ${
                  errors.address ? "border-red-500" : ""
                }`}
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                placeholder="Your home or delivery address"
              />
            </div>
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Birthdate (optional)
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                className={`w-full px-2 py-1 focus:outline-none ${
                  errors.birthdate ? "border-red-500" : ""
                }`}
                value={profile.birthdate}
                onChange={(e) =>
                  setProfile({ ...profile, birthdate: e.target.value })
                }
              />
            </div>
            {errors.birthdate && (
              <p className="text-red-600 text-sm mt-1">{errors.birthdate}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              User Role (read-only)
            </label>
            <input
              type="text"
              value={profile.user_role}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => setProfile(initialProfile)}
          disabled={loading}
          className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 disabled:opacity-50  transition mt-4"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition mt-4 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
