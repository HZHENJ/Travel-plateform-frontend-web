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
import MediaImage from "../../components/common/media/MediaImage";

import { checkUserReview, submitReview } from "../../api/review"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
import Pagination from "../../components/common/Pagination"
import { fetchAttractoionsByUUID } from "../../api/attractions"
  
const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [reviewedItems, setReviewedItems] = useState({});
    const [events, setEvents] = useState([])

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
            const bookings = await fetchUserSchedule(userId);
            // 提取所有 attractionUuid 并存入数组
            const attractionUuids = bookings.map(booking => booking.attractionUuid);
            const attractionDetails = await fetchAttractoionsByUUID(attractionUuids);
            // 创建一个 `uuid` 到 `attraction` 的映射
            const attractionMap = new Map(attractionDetails.data.map(attraction => [attraction.uuid, attraction]));

            // console.log(attractionMap)
            const transformedEvents = bookings.map((booking) => ({
                id: booking.attractionBookingId,
                date: parseISO(booking.visitDate),
                time: format(parseISO(booking.visitTime), "hh:mm a"),
                title: attractionMap.get(booking.attractionUuid)?.name || "Unknown",
                // description: `Booking ID: ${booking.bookingId}`,
                image: attractionMap.get(booking.attractionUuid)?.thumbnails[0].uuid || "/placeholder.svg",
                category: "attraction",
            }));
            console.log(transformedEvents)
            setEvents(transformedEvents);
        };
        // 
        const checkReviews = async () => {
            const reviewStatus = {};
            for (const event of events) {
                reviewStatus[event.id] = await checkUserReview(userId, event.id);
            }
            setReviewedItems(reviewStatus);
        };

        // 判断用户
        if (userId) {
            loadSchedule();
            checkReviews();
        }
    }, [userId, events]);

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
    const handleReviewSubmit = async () => {
        if (!reviewText.trim()) return alert("Please enter a review.");

        try {
            const reviewData = {
                userId,
                itemType: "Attraction",
                itemId: selectedEvent.id, // AttractionBooking ID
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
    
    // 上个星期
    const handlePreviousWeek = () => {
        setSelectedDate(addDays(selectedDate, -7))
    }

    // 下个星期
    const handleNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7))
    }

    // 设置类别颜色
    const getCategoryColor = (category) => {
        switch (category) {
        case "attraction":
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
                                        <div key={event.id} className="mb-2 last:mb-0">
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
                                paginatedEvents.map(event => (
                                    <Card key={event.id} className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <MediaImage uuid={event.image} alt={event.title} fileType={"Small Thumbnail"} className="w-20 h-20 rounded-lg" />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold truncate w-[250px]">{event.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(event.date, "MMMM d, yyyy")} at {event.time}
                                                </p>
                                                <p className="text-sm line-clamp-2 w-[200px]">{event.description}</p>
                                                <Badge className={`mt-2 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => openReviewModal(event)} disabled={reviewedItems[event.id]} className="ml-auto">
                                                    {reviewedItems[event.id] ? "Reviewed" : <><Star className="h-4 w-4 text-yellow-500" /> Rate</>}
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(event.id)}
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
                                        <Button onClick={handleReviewSubmit}>Submit</Button>
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