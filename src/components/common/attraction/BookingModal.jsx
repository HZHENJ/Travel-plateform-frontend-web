import { useState, useMemo } from "react"
import { parse, addDays, isBefore, isAfter, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendAttractionBookingToBackEnd } from "../../../api/attractions"
import { useToast } from '../../../components/common/MessageBox'

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

// 解析时间，并转换成 LocalDateTime 兼容格式
const convertToLocalDateTime = (date, timeString) => {
  if (!date || !timeString) return null;

  // 解析时间字符串 ("11:00 AM" => Date 对象)
  const parsedTime = parse(timeString, "hh:mm a", new Date());

  // 组合 `date` 和 `parsedTime`
  const visitDateTime = new Date(date);
  visitDateTime.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  // 转换为 ISO 8601 格式
  return visitDateTime.toISOString();
};

export function BookingModal({ isOpen, onClose, pricePerPerson, businessHours, uuid}) {
  const [date, setDate] = useState()
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(1)
  const { addToast } = useToast();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select a date and time before booking.");
      return;
    }

    const data = {
      userId: parseInt(localStorage.getItem("userId"), 10),
      uuid: uuid,
      visitDate: format(date, "yyyy-MM-dd"),
      visitTime: convertToLocalDateTime(date, time),
      numberOfTickets: people,
      price: 0
    }
    // console.log("Booking submitted:", data);
    try {
      const response = await sendAttractionBookingToBackEnd(data);
      if (response.status === 200){
        console.log(response)
        handleClose(); // 关闭模态框并清空数据
        addToast("Booking Successful!", "success", 3000)
      }
    } catch (error) {
      console.log("Error", error)
    }
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
              <div className="w-[280px] font-semibold">${ totalPrice >= 0 ?totalPrice.toFixed(2): "Free"}</div>
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