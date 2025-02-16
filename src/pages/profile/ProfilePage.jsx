import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Pencil, Save } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { fetchUserProfile, updateUserPreferences } from '../../api/user'

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    travelType: "Single",
    budgetRange: "0",
    language: "en",
  });

  // 从 React 日志获取 `userId`
  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;
      try {
        const data = await fetchUserProfile(userId);
        setUserData(data);
        if (data.preferences) setPreferences(data.preferences);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    loadUserProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData) return;
    try {
      await updateUserPreferences(userData.userId, preferences);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  if (!userId) return <p className="text-center mt-10 text-red-500">User ID not found. Please log in.</p>;
  if (!userData) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto py-10 px-6 md:px-10 lg:px-16 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Personal Information</h1>

          <div className="space-y-8">
            {/* 用户基本信息 */}
            <Card className="shadow-lg bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-blue-500" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-base text-gray-500">Your account details</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 border border-gray-300">
                  <AvatarImage src={userData.avatarUrl || "/images/avatar.jpg"} alt={userData.name} />
                  <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-2xl font-medium text-gray-900">{userData.email || "Unknown User"}</p>
                </div>
              </CardContent>
            </Card>

            {/* 旅行偏好 */}
            <Card className="shadow-lg bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="h-6 w-6 text-green-500" />
                  Travel Preferences
                </CardTitle>
                <CardDescription className="text-base text-gray-500">Customize your travel experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 font-medium">Travel Type:</label>
                    {isEditing ? (
                      <select
                        name="travelType"
                        value={preferences.travelType}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Single">Single</option>
                        <option value="Couple">Couple</option>
                        <option value="Family">Family</option>
                      </select>
                    ) : (
                      <span className="text-gray-900">{preferences.travelType}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 font-medium">Budget Range:</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="budgetRange"
                        value={preferences.budgetRange}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 w-24"
                      />
                    ) : (
                      <span className="text-gray-900">${preferences.budgetRange}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 font-medium">Preferred Language:</label>
                    {isEditing ? (
                      <select
                        name="language"
                        value={preferences.language}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="en">English</option>
                        <option value="zh">Chinese</option>
                        <option value="fr">French</option>
                      </select>
                    ) : (
                      <span className="text-gray-900">{preferences.language.toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-right">
                  {isEditing ? (
                    <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                      <Pencil className="h-5 w-5" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
