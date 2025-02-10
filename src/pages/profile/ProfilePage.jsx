import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { PreferenceForm } from "../components/PreferenceForm"
// import { updatePreferences } from "../actions/preferences"
// import { TravelStats } from "../components/TravelStats"
// import { UpcomingTrip } from "../components/UpcomingTrip"
import { User, Settings, Plane, Calendar } from "lucide-react"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";

function getUserData() {
  // 模拟从数据库或API获取用户数据
  return {
    name: "张三",
    email: "zhangsan@example.com",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    preferences: {
      travelType: "Single",
      budgetRange: "5000",
      language: "zh",
    },
    stats: {
      totalTrips: 12,
      countriesVisited: 8,
      totalDistance: 32000,
    },
    upcomingTrip: {
      destination: "巴黎",
      date: "2023-12-15",
      duration: 7,
    },
  }
}

const ProfilePage = () => {
  const userData = getUserData()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="container mx-auto py-10 px-6 md:px-10 lg:px-16 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">个人信息</h1>
          <div className="space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6" />
                  基本信息
                </CardTitle>
                <CardDescription className="text-base">您的账户详情</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                  <AvatarFallback>{userData.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-2xl font-medium">{userData.name}</p>
                  <p className="text-base text-muted-foreground">{userData.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="h-6 w-6" />
                  旅行偏好设置
                </CardTitle>
                <CardDescription className="text-base">自定义您的旅行体验</CardDescription>
              </CardHeader>
              <CardContent>
                <PreferenceForm initialData={userData.preferences} onSubmit={updatePreferences} />
              </CardContent>
            </Card> */}

            {/* <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Plane className="h-6 w-6" />
                  旅行统计
                </CardTitle>
                <CardDescription className="text-base">您的旅行足迹</CardDescription>
              </CardHeader>
              <CardContent>
                <TravelStats stats={userData.stats} />
              </CardContent>
            </Card> */}

            {/* <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6" />
                  即将到来的旅行
                </CardTitle>
                <CardDescription className="text-base">准备好您的下一次冒险</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingTrip trip={userData.upcomingTrip} />
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default ProfilePage;

