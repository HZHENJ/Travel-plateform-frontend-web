import { useState, useMemo } from "react"
import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react"
import { addDays, isBefore, isAfter, format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const calculateWeeklyAvailableTimes = (businessHours) => {
  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const availableTimesPerDay = {};

  let dailyHours = businessHours.find((bh) => bh.day === "daily");

  weekDays.forEach((day) => {
    let hours = dailyHours || businessHours.find((bh) => bh.day === day);
    if (!hours || !hours.openTime || !hours.closeTime) {
      availableTimesPerDay[day] = []; // 当天不开门
      return;
    }

    const times = [];
    let currentTime = new Date();
    currentTime.setHours(...hours.openTime.split(":"));
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);

    let closeTime = new Date();
    closeTime.setHours(...hours.closeTime.split(":"));
    closeTime.setMinutes(0);
    closeTime.setSeconds(0);

    while (currentTime < closeTime) {
      times.push(format(currentTime, "hh:mm a"));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    availableTimesPerDay[day] = times;
  });

  return availableTimesPerDay;
};

export function BookingModal({ isOpen, onClose, pricePerPerson, businessHours }) {
  const [date, setDate] = useState()
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(1)

  const totalPrice = people * pricePerPerson

  // 预计算每周 `availableTimes`
  const availableTimesPerDay = useMemo(() => calculateWeeklyAvailableTimes(businessHours), [businessHours]);
  // console.log("Available Times Per Day:", availableTimesPerDay); // Debug 日志

  /** 
   * 获取所选日期的可用时间 
   */
  const availableTimes = useMemo(() => {
    if (!date) return [];
    let today = format(date, "EEEE").toLowerCase();
    return availableTimesPerDay[today] || [];
  }, [date, availableTimesPerDay]);
  
  /**
   * 处理提交预定
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select a date and time before booking.");
      return;
    }
    console.log("Booking submitted:", { date, time, people, totalPrice });

    // 关闭模态框并清空数据
    handleClose();
  };

  /**
   * 关闭模态框时清空数据
   */
  const handleClose = () => {
    setDate(null);
    setTime("");
    setPeople(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Book Your Adventure</DialogTitle>
          <DialogDescription>
            Make a reservation for your exciting experience. Please fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">

            {/* 日期选择器 */}
            <div className="flex justify-center items-center w-full">
              <div className="w-full max-w-sm flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    // console.log("Selected date:", selectedDate); // Debug 日志
                    setDate(selectedDate); // 更新状态
                  }}
                  disabled={(day) => {
                    const today = new Date(); // 获取选中的星期几
                    const selectedDay = format(day, "EEEE").toLowerCase(); // 获取选中的星期几
                    const maxBookingDate = addDays(new Date(), 30); // 限制预约 15 天

                    return (
                      isBefore(day, today) ||
                      isAfter(day, maxBookingDate) || 
                      availableTimesPerDay[today]?.length === 0 ||  // 超过 15 天 或 当天不开门
                      availableTimesPerDay[selectedDay]?.length === 0
                    );
                  }}
                  initialFocus
                />
              </div>
            </div>

            {/* 时间选择器 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <Select onValueChange={setTime} required>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a time">
                    <div className="flex items-center">
                      <span>{time || "Select a time"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((t, index) => (
                      <SelectItem key={`time-${index}`} value={t}>
                        {t}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No available times</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 选择人数 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="people" className="text-right">People</Label>
              <div className="flex items-center w-[280px]">
                <Input
                  id="people"
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                  min={1}
                  max={10}
                  required
                />
              </div>
            </div>

            {/* 总价 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Price</Label>
              <div className="w-[280px] font-semibold">${totalPrice.toFixed(2)}</div>
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">Book Now</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}