import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns"
import { Calendar } from "../../components/ui/calendar"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { fetchUserSchedule } from "../../api/schedule"
import { fetchUserHotelBookings } from "../../api/schedule"
import { fetchAttractoionsByUUID, cancelAttractionBooking } from "../../api/attractions"
import { fetchHotelsByUUID, cancelHotelBooking } from "../../api/hotels"
import { submitReview } from "../../api/review"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
import Pagination from "../../components/common/Pagination"
import MediaImage from "../../components/common/media/MediaImage";

  
const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([])

    // const [reviewedItems, setReviewedItems] = useState({});
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5); // 默认评分

    const [currentPage, setCurrentPage] = useState(1); // 分页页码
    const eventsPerPage = 2; // 每页显示 2 个事件

    const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const weekDays = [...Array(7)].map((_, index) => addDays(startOfCurrentWeek, index))

    const userId = parseInt(localStorage.getItem("userId"), 10);

    // 获取后端数据
    useEffect(() => {
        const loadSchedule = async () => {
            if (!userId) return;

            // 1. 并行获取AttractionBooking & HotelBooking
            // const [bookings, hotelBookings] = await Promise.all([
            //     fetchUserSchedule(userId),
            //     fetchUserHotelBookings(userId),
            // ]);

            // 1. 并行获取 AttractionBooking & HotelBooking
            const [bookings, hotelBookings] = await Promise.all([
                fetchUserSchedule(userId).catch(error => {
                    // console.error("Error fetching attraction bookings:", error);
                    return []; // 返回空数组，防止崩溃
                }),
                fetchUserHotelBookings(userId).catch(error => {
                    // console.error("Error fetching hotel bookings:", error);
                    return []; // 返回空数组，防止崩溃
                }),
            ]);

            console.log("Bookings:", bookings); // 👀 打印返回的数据类型
            console.log("HotelBookings:", hotelBookings);
            
            // 确保 `bookings` 和 `hotelBookings` 都是数组
            const validBookings = Array.isArray(bookings) ? bookings : [];
            const validHotelBookings = Array.isArray(hotelBookings) ? hotelBookings : [];

            // 处理景点预订数据
            const attractionUuids = bookings.map(booking => booking.attractionUuid);
            const attractionDetails = await fetchAttractoionsByUUID(attractionUuids);
            const attractionMap = new Map(attractionDetails.data.map(attraction => [attraction.uuid, attraction]));

            // 处理景点预订数据
            let transformedAttractionEvents = [];
            if (validBookings.length > 0) {
                const attractionUuids = validBookings.map(booking => booking.attractionUuid);
                const attractionDetails = await fetchAttractoionsByUUID(attractionUuids);
                const attractionMap = new Map(attractionDetails.data.map(attraction => [attraction.uuid, attraction]));

                transformedAttractionEvents = validBookings
                    .filter(booking => booking.status !== "Canceled")
                    .map((booking) => ({
                        id: booking.attractionId,
                        bookingId: booking.bookingId,
                        date: parseISO(booking.visitDate),
                        time: format(parseISO(booking.visitTime), "hh:mm a"),
                        title: attractionMap.get(booking.attractionUuid)?.name || "Unknown",
                        image: attractionMap.get(booking.attractionUuid)?.thumbnails?.[0]?.uuid || "/placeholder.svg",
                        category: "Attraction",
                        status: booking.status
                    }));
            }

            // 处理酒店预订数据
            let transformedHotelEvents = [];
            if (validHotelBookings.length > 0) {
                const hotelUuids = validHotelBookings.map(booking => booking.hotelUuid);
                const hotelDetails = await fetchHotelsByUUID(hotelUuids);
                const hotelMap = new Map(hotelDetails.data.map(hotel => [hotel.uuid, hotel]));

                transformedHotelEvents = validHotelBookings
                    .filter(booking => booking.status !== "Canceled")
                    .map((booking) => ({
                        id: booking.hotelId,
                        bookingId: booking.bookingId,
                        date: parseISO(booking.checkInDate),
                        time: "Check-in",
                        title: hotelMap.get(booking.hotelUuid)?.name || "Unknown Hotel",
                        image: hotelMap.get(booking.hotelUuid)?.thumbnails?.[0]?.uuid || "/hotel-placeholder.svg",
                        category: "Hotel",
                        status: booking.status
                    }));
            }
            // **合并事件，不管 bookins 或 hotelBookings 是否为空**
            const allEvents = [...transformedAttractionEvents, ...transformedHotelEvents];

            console.log("Final Events:", allEvents); // Debugging output
            setEvents(allEvents);
        };

        // 判断用户
        if (userId) {
            loadSchedule();
        }
    }, [userId]);

    // 计算当天事件
    const todayEvents = events.filter(event => isSameDay(event.date, selectedDate));

    // 计算即将到来的事件 并排序
    const upcomingEvents = events.filter(event => event.date >= new Date()).sort((a, b) => a.date - b.date);

    // 选择渲染的事件列表
    const displayEvents = todayEvents.length > 0 ? todayEvents : upcomingEvents;

    // 计算分页索引
    const totalPages = Math.ceil(displayEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const paginatedEvents = displayEvents.slice(startIndex, endIndex);

    // 确定标题文本
    const titleText = todayEvents.length > 0 ? `Events on ${format(selectedDate, "MMMM d, yyyy")}` 
        : upcomingEvents.length > 0 ? "Upcoming Events" : "No Events Available";

    // 打开评分弹窗
    const openReviewModal = (event) => {
        setSelectedEvent(event);
        setReviewText("");
        setRating(0);
        setReviewModal(true);
    };

    // 提交评分
    const handleReviewSubmit = async ({ category }) => {
        if (!reviewText.trim()) return alert("Please enter a review.");

        try {
            const reviewData = {
                userId,
                itemType: category,
                itemId: selectedEvent.id, // attraction id
                bookingId: selectedEvent.bookingId,
                rating,
                comment: reviewText
            };
            console.log(reviewData)
            await submitReview(reviewData);
            setReviewModal(false);
            alert("Review submitted successfully!");
        } catch (error) {
            alert("Failed to submit review.");
        }
    };

    // 取消事件
    const handleCancelBooking = async (bookingId, category) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
        try {
            if (category === "Hotel") {
                await cancelHotelBooking(bookingId);
            } else {
                await cancelAttractionBooking(bookingId);
            }
            setEvents(events.filter(event => event.bookingId !== bookingId));
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };
    
    // 上个星期
    const handlePreviousWeek = () => { setSelectedDate(addDays(selectedDate, -7))}

    // 下个星期
    const handleNextWeek = () => { setSelectedDate(addDays(selectedDate, 7))}

    // 设置类别颜色
    const getCategoryColor = (category) => {
        switch (category) {
        case "Attraction":
            return "bg-blue-100 text-blue-800"
        case "Hotel":
            return "bg-green-100 text-green-800"
        default:
            return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* calendar */}
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

                {/* card */}
                <div className="grid grid-cols-7 gap-4 mb-8">
                    {
                        weekDays.map((day) => {
                            const dayEvents = events.filter((event) => isSameDay(event.date, day));
                            const maxEventsToShow = 2; // 最多显示 2 个事件
                            const hasMore = dayEvents.length > maxEventsToShow; // 是否有更多事件

                            return (
                            <Card key={day.toString()} className="p-4 min-h-[150px] max-h-[200px] overflow-hidden">
                                <CardHeader className="p-0 mb-2">
                                    <CardTitle className="text-sm font-medium">{format(day, "EEE")}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{format(day, "MMM d")}</p>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {dayEvents.slice(0, maxEventsToShow).map((event) => (
                                        <div key={event.bookingId} className="mb-2 last:mb-0">
                                            {/* <Badge variant="secondary" className={`mb-1 block ${getCategoryColor(event.category)}`}>{event.time}</Badge> */}
                                            <div className="flex items-center space-x-2">
                                                <MediaImage uuid={event.image} fileType={"Small Thumbnail"} className="w-8 h-8 rounded-full" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate w-[90px]">{event.title}</p>
                                                    <Badge variant="secondary" className={`mb-1 block ${getCategoryColor(event.category)}`}>{event.time}</Badge>
                                                    {/* <p className="text-xs text-muted-foreground line-clamp-2 w-[140px]">{event.description}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {hasMore && (
                                        <p className="text-xs text-muted-foreground text-center mt-1">
                                            +{dayEvents.length - maxEventsToShow} more
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )})}
                </div>
                
                {/* Upcoming Events */}
                <div className="flex space-x-4">
                    {/* 左侧事件 */}
                    <div className="w-3/4">
                        <h2 className="text-xl font-semibold mb-4">{titleText}</h2>

                        <div className="space-y-4">
                            {paginatedEvents.length > 0 ? (
                                paginatedEvents
                                    .filter(event => event.status !== "Canceled") // 过滤已取消的预订
                                    .map(event => (
                                    <Card key={event.bookingId} className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <MediaImage uuid={event.image} alt={event.title} fileType={"Small Thumbnail"} className="w-20 h-20 rounded-lg" />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold truncate w-[400px]">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(event.date, "MMMM d, yyyy")} at {event.time}
                                                </p>
                                                <p className="text-sm line-clamp-2 w-[200px]">{event.description}</p>
                                                <Badge className={`mt-2 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => openReviewModal(event)}>
                                                    <Star className="h-4 w-4 text-yellow-500" /> Rate
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(event.bookingId, event.category)}
                                                    disabled={new Date() > event.date}className="ml-auto">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <p className="text-sm">No events found for today or upcoming days.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* 评论模态框 */}
                        {reviewModal && (
                            <Dialog open={reviewModal} onOpenChange={setReviewModal}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Rate Your Experience</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex justify-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <Textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your experience..."
                                        className="w-full p-2 border rounded"
                                    />
                                    <DialogFooter>
                                        <Button onClick={() => handleReviewSubmit({category: selectedEvent?.category})}>Submit</Button>
                                        <Button variant="secondary" onClick={() => setReviewModal(false)}>Cancel</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* 分页组件 */}
                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>

                    {/* 右侧事件 */}
                    <div className="w-1/4">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
        )
}

export default SchedulePage;