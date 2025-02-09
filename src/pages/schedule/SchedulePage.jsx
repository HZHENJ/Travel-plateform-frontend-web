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

import { checkUserReview, submitReview } from "../../api/review"

import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer";
import { fetchAttractoionsByUUID } from "../../api/attractions"
  
const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [reviewedItems, setReviewedItems] = useState({});
    const [events, setEvents] = useState([])

    const [reviewModal, setReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5); // 默认评分

    const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const weekDays = [...Array(7)].map((_, index) => addDays(startOfCurrentWeek, index))

    const userId = parseInt(localStorage.getItem("userId"), 10);

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

    // 获取后端数据
    useEffect(() => {
        const loadSchedule = async () => {
            const bookings = await fetchUserSchedule(userId);
            // 提取所有 attractionUuid 并存入数组
            const attractionUuids = bookings.map(booking => booking.attractionUuid);
            const attractionDetails = await fetchAttractoionsByUUID(attractionUuids);
            // console.log(attractionDetails)
            const transformedEvents = bookings.map((booking) => ({
                id: booking.attractionBookingId,
                date: parseISO(booking.visitDate),
                time: format(parseISO(booking.visitTime), "hh:mm a"),
                title: `Visit ${booking.uuid}`,
                description: `Booking ID: ${booking.bookingId}`,
                image: "/placeholder.svg",
                category: "attraction",
            }));

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

        if (userId) {
            loadSchedule();
            checkReviews();
        }
        }, [userId]
    );

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
                {/*  */}
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

                {/*  */}
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
                
                {/* Upcoming Events */}
                <div className="flex space-x-4">
                    <div className="w-2/3">
                        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {
                                events
                                .filter((event) => event.date >= new Date())
                                .sort((a, b) => a.date - b.date)
                                .slice(0, 6)
                                .map((event) => (
                                    <Card key={event.id} className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-20 h-20 rounded-lg" />
                                            <div className="flex-grow"> {/* 让文本内容自动填充剩余空间 */}
                                            <h3 className="font-semibold">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {format(event.date, "MMMM d, yyyy")} at {event.time}
                                            </p>
                                            <p className="text-sm">{event.description}</p>
                                            <Badge className={`mt-2 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                                            </div>
                                            {/* 让按钮靠右 */}
                                            <div className="flex justify-end">
                                            <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => openReviewModal(event)}
                                            disabled={reviewedItems[event.id]}
                                            className="ml-auto"
                                            >
                                            {reviewedItems[event.id] ? "Reviewed" : <><Star className="h-4 w-4 text-yellow-500" /> Rate</>}
                                            </Button>
                                            </div>
                                        </div>
                                    </Card>
                                    ))}

                            {/* 评分弹窗 */}
                            {
                                reviewModal && (
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
                                    <Button variant="secondary" onClick={() => setReviewModal(false)}>
                                        Cancel
                                    </Button>
                                    </DialogFooter>
                                </DialogContent>
                                </Dialog>
                            )}
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