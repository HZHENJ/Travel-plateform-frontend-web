import { useState } from "react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { Calendar } from "../../components/ui/calendar"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
  
const SchedulePage = () => {
const [selectedDate, setSelectedDate] = useState(new Date())
const [events, setEvents] = useState([])

const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 })
const weekDays = [...Array(7)].map((_, index) => addDays(startOfCurrentWeek, index))

const userId = parseInt(localStorage.getItem("userId"), 10);

// 获取后端数据
useEffect(() => {
const loadSchedule = async () => {
    const bookings = await fetchUserSchedule(userId);

    // **转换 API 数据**
    const transformedEvents = bookings.map((booking) => ({
    id: booking.attractionBookingId,
    date: parseISO(booking.visitDate),  // ✅ 确保格式是 `Date`
    time: format(parseISO(booking.visitTime), "hh:mm a"), // ✅ 解析时间
    title: `Visit ${booking.attractionUuid}`, // ✅ 显示 UUID
    description: `Booking ID: ${booking.bookingId}`,
    image: "/placeholder.svg", // 你可以替换成真实图片
    category: "attraction", // 统一分类
    }));

    setEvents(transformedEvents); // ✅ 更新状态
};

if (userId) {
    loadSchedule();
}
}, [userId]);

const handlePreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7))
}

const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7))
}

const getCategoryColor = (category) => {
    switch (category) {
    case "work":
        return "bg-blue-100 text-blue-800"
    case "personal":
        return "bg-green-100 text-green-800"
    case "social":
        return "bg-purple-100 text-purple-800"
    default:
        return "bg-gray-100 text-gray-800"
    }
}

return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                {/* <h3 className="text-3xl font-bold">My Schedule</h3> */}
                <div className="flex items-center space-x-4">
                    <Button onClick={handlePreviousWeek} variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">
                        {format(startOfCurrentWeek, "MMMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMMM d, yyyy")}
                    </span>
                    <Button onClick={handleNextWeek} variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-8">
                {weekDays.map((day) => (
                <Card key={day.toString()} className="p-4">
                    <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-sm font-medium">{format(day, "EEE")}</CardTitle>
                    <p className="text-xs text-muted-foreground">{format(day, "MMM d")}</p>
                    </CardHeader>
                    <CardContent className="p-0">
                    {events
                        .filter((event) => isSameDay(event.date, day))
                        .map((event) => (
                        <div key={event.id} className="mb-2 last:mb-0">
                            <Badge variant="secondary" className={`mb-1 block ${getCategoryColor(event.category)}`}>
                            {event.time}
                            </Badge>
                            <div className="flex items-center space-x-2">
                            <img
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.description}</p>
                            </div>
                            </div>
                        </div>
                        ))}
                    </CardContent>
                </Card>
                ))}
            </div>

            <div className="flex space-x-4">
                <div className="w-2/3">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                    {events
                    .filter((event) => event.date >= new Date())
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 5)
                    .map((event) => (
                        <Card key={event.id} className="p-4">
                        <div className="flex items-center space-x-4">
                            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-20 h-20 rounded-lg" />
                            <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {format(event.date, "MMMM d, yyyy")} at {event.time}
                            </p>
                            <p className="text-sm">{event.description}</p>
                            <Badge className={`mt-2 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                            </div>
                        </div>
                        </Card>
                    ))}
                </div>
                </div>
                <div className="w-1/3">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                </div>
            </div>

        </main>
        <Footer/>
    </div>
    )
}

export default SchedulePage;