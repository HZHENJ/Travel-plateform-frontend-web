import { useState, useMemo } from "react"
import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookingModal({ isOpen, onClose, pricePerPerson, businessHours }) {
  const [date, setDate] = useState()
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(1)

  const totalPrice = people * pricePerPerson

  /** 
   * 获取所选日期的可用时间 
   */
  const availableTimes = useMemo(() => {
    if (!date || !businessHours) return [];
  
    const selectedDay = format(date, "EEEE").toLowerCase();
  
    // 获取 `daily` 营业时间 或 具体星期的营业时间
    let businessHour = businessHours.find((bh) => bh.day === selectedDay) || businessHours.find((bh) => bh.day === "daily");
  
    if (!businessHour || !businessHour.openTime || !businessHour.closeTime) return [];
  
    const times = [];
    let now = new Date(); // 当前时间
    let selectedDate = new Date(date); // 用户选择的日期
  
    // 限制 **只能预约未来 15 天**
    let maxBookingDate = new Date();
    maxBookingDate.setDate(maxBookingDate.getDate() + 15);
  
    if (selectedDate > maxBookingDate) {
      return []; // 超过 15 天的预约范围，不显示任何时间
    }
  
    // 获取营业时间
    let currentTime = new Date(selectedDate);
    currentTime.setHours(...businessHour.openTime.split(":"));
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);
  
    let closeTime = new Date(selectedDate);
    closeTime.setHours(...businessHour.closeTime.split(":"));
    closeTime.setMinutes(0);
    closeTime.setSeconds(0);
  
    // 如果用户选择的是今天，跳过当前时间之前的时段
    if (selectedDate.toDateString() === now.toDateString()) {
      while (currentTime < closeTime) {
        if (currentTime > now) {
          times.push(format(currentTime, "hh:mm a"));
        }
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    } else {
      // 如果是未来日期，显示所有时间
      while (currentTime < closeTime) {
        times.push(format(currentTime, "hh:mm a"));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    }
  
    return times;
  }, [date, businessHours]);

  /**
   * 处理提交预定
   */
  const handleSubmit = (e) => {
    e.preventDefault();
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Adventure</DialogTitle>
          <DialogDescription>
            Make a reservation for your exciting experience. Please fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* 日期选择器 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* 时间选择器 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <Select onValueChange={setTime} required>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a time">
                    <div className="flex items-center">
                      <ClockIcon className="mr-2 h-4 w-4" />
                      <span>{time || "Select a time"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.length > 0 ? (
                      availableTimes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No available times</SelectItem>
                    )}
                  {/* {availableTimes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            {/* 选择人数 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="people" className="text-right">People</Label>
              <div className="flex items-center w-[280px]">
                <UsersIcon className="mr-2 h-4 w-4" />
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