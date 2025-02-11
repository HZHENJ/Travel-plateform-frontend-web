import { useState } from "react"
import { format, differenceInDays, addDays, isBefore } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

const roomTypes = [
  { id: "standard", name: "标准间", price: 1 },
  { id: "deluxe", name: "豪华间", price: 2 },
  { id: "suite", name: "套房", price: 3 },
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
      <DialogContent className="sm:max-w-2xl w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book a room</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); console.log({ checkIn, checkOut, roomType, guests }); onClose(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* 入住日期选择 */}
            <div className="space-y-2">
              <Label className="text-lg">Check-in date</Label>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={(date) => isBefore(date, new Date())} // 禁止过去的日期
                className="border rounded-lg p-2"
              />
            </div>

            {/* 离店日期选择 */}
            <div className="space-y-2">
              <Label className="text-lg">Check-out date</Label>
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={handleCheckOutSelect}
                disabled={(date) => !checkIn || isBefore(date, checkIn)} // 禁止比入住日期早的日期
                className="border rounded-lg p-2"
              />
            </div>
          </div>

          {/* 房型选择 */}
          <div>
            <Label className="text-lg">Room type</Label>
            <Select onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ${room.price}/day
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 人数选择 */}
          <div>
            <Label className="text-lg">Number of people staying</Label>
            <Select onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of people" />
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

          {/* 确认预订按钮 */}
          <Button type="submit" className="w-full text-lg" disabled={!checkIn || !checkOut || !roomType || !guests}>
            Confirm booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}