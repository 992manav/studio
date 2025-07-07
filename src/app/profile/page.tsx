"use client";

import React, { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    // Here you could send profile to backend or localStorage
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Avatar URL</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="avatarUrl"
            value={profile.avatarUrl}
            onChange={handleChange}
          />
        </div>
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt="Avatar Preview"
            className="w-20 h-20 rounded-full mx-auto border"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
        {saved && (
          <div className="text-green-600 text-center">Profile saved!</div>
        )}
      </form>
    </div>
  );
}
