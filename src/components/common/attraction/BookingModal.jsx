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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Booking submitted:", { date, time, people, totalPrice })
    onClose()
  }

  const availableTimes = useMemo(() => {
    if (!date) return []

    const selectedDay = date.toLocaleDateString("en-US", { weekday: "lowercase" })
    const businessHour = businessHours.find((bh) => bh.day === selectedDay)

    if (!businessHour) return []

    const times = []
    const currentTime = new Date(`2000-01-01T${businessHour.openTime}:00`)
    const closeTime = new Date(`2000-01-01T${businessHour.closeTime}:00`)

    while (currentTime < closeTime) {
      times.push(currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
      currentTime.setMinutes(currentTime.getMinutes() + 30)
    }

    return times
  }, [date, businessHours])

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
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
                  {availableTimes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="people" className="text-right">
                People
              </Label>
              <div className="flex items-center w-[280px]">
                <UsersIcon className="mr-2 h-4 w-4" />
                <Input
                  id="people"
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(Number.parseInt(e.target.value))}
                  min={1}
                  max={50}
                  required
                />
              </div>
            </div>
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