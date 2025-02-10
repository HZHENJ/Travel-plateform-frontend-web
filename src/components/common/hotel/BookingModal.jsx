import { useState } from "react"
import { format, differenceInDays, addDays, isBefore } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "./DatePicker"

const roomTypes = [
  { id: "standard", name: "标准间", price: 688 },
  { id: "deluxe", name: "豪华间", price: 888 },
  { id: "suite", name: "套房", price: 1288 },
]

export default function BookingModal({ isOpen, onClose }) {
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [roomType, setRoomType] = useState("")
  const [guests, setGuests] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ checkIn, checkOut, roomType, guests })
    onClose()
  }

  const handleCheckInSelect = (date) => {
    setCheckIn(date)
    // If check-out date is before new check-in date, reset it
    if (checkOut && isBefore(checkOut, date)) {
      setCheckOut(null)
    }
  }

  const handleCheckOutSelect = (date) => {
    if (checkIn && isBefore(date, checkIn)) {
      // If selected check-out is before check-in, set check-out to day after check-in
      setCheckOut(addDays(checkIn, 1))
    } else if (checkIn && differenceInDays(date, checkIn) > 15) {
      // If stay is longer than 15 days, set check-out to 15 days after check-in
      setCheckOut(addDays(checkIn, 15))
    } else {
      setCheckOut(date)
    }
  }

  const totalNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalPrice = roomType && checkIn && checkOut ? roomTypes.find((r) => r.id === roomType).price * totalNights : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">预订房间</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check-in" className="text-lg">
                入住日期
              </Label>
              <DatePicker selected={checkIn} onSelect={handleCheckInSelect} label="选择入住日期" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out" className="text-lg">
                离店日期
              </Label>
              <DatePicker selected={checkOut} onSelect={handleCheckOutSelect} label="选择离店日期" />
            </div>
          </div>
          <div>
            <Label htmlFor="room-type" className="text-lg">
              房型
            </Label>
            <Select onValueChange={setRoomType}>
              <SelectTrigger id="room-type">
                <SelectValue placeholder="选择房型" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ¥{room.price}/晚
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="guests" className="text-lg">
              人数
            </Label>
            <Select onValueChange={setGuests}>
              <SelectTrigger id="guests">
                <SelectValue placeholder="选择人数" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}人
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {checkIn && checkOut && (
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">预订详情</h3>
              <p>入住: {format(checkIn, "yyyy-MM-dd")}</p>
              <p>离店: {format(checkOut, "yyyy-MM-dd")}</p>
              <p>总晚数: {totalNights}晚</p>
              {roomType && <p>房型: {roomTypes.find((r) => r.id === roomType).name}</p>}
              {guests && <p>人数: {guests}人</p>}
              {roomType && <p className="font-semibold mt-2">总价: ¥{totalPrice}</p>}
            </div>
          )}
          <Button type="submit" className="w-full text-lg" disabled={!checkIn || !checkOut || !roomType || !guests}>
            确认预订
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}