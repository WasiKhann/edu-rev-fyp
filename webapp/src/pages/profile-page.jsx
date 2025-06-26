// src/pages/profile-page.jsx
"use client"

import { useState } from "react"
import Navbar from "../components/common/navbar"
import { useAuth } from "../context/AuthContext"
import { authAPI } from "../services/api"
import { User, Eye, EyeOff } from "lucide-react"

const ProfilePage = () => {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    if (
      formData.new_password &&
      formData.new_password !== formData.confirm_new_password
    ) {
      setError("New passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const res = await authAPI.updateProfile(user.user_id, formData)
      if (res.success) {
        setSuccess("Profile updated successfully")
        setIsEditing(false)
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          new_password: "",
          confirm_new_password: "",
        }))
      } else {
        setError(res.message || "Failed to update profile")
      }
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pt-16">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Your Profile
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-8 flex items-center">
            <div className="bg-white rounded-full p-3 mr-4">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-semibold">{user?.full_name}</h2>
              <p className="opacity-90">{user?.email}</p>
              <p className="opacity-70 text-sm capitalize">
                Role: {user?.role}
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900 dark:border-red-700 rounded">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-700 rounded">
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                />
              </div>

              {isEditing && (
                <>
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="current_password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showCurrentPassword ? "text" : "password"
                        }
                        id="current_password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Required only if you want to change your password
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="new_password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label
                      htmlFor="confirm_new_password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        id="confirm_new_password"
                        name="confirm_new_password"
                        value={formData.confirm_new_password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          full_name: user?.full_name || "",
                          current_password: "",
                          new_password: "",
                          confirm_new_password: "",
                        })
                        setError("")
                        setSuccess("")
                      }}
                      className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
