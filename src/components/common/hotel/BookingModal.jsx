import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HotelBookingModal = ({ hotelName, isOpen, onClose }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomType, setRoomType] = useState("standard");
  const [guests, setGuests] = useState(1);

  const handleBooking = () => {
    console.log("Booking Details:", { checkInDate, checkOutDate, roomType, guests });
    alert(`预订成功！酒店：${hotelName}，房型：${roomType}，人数：${guests}`);
    onClose(); // 关闭模态框
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">预订 {hotelName}</DialogTitle>
        </DialogHeader>

        {/* 入住时间 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">入住时间</label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            className="w-full mt-1 p-2 border rounded-lg"
            minDate={new Date()}
            placeholderText="选择入住日期"
          />
        </div>

        {/* 离开时间 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">离开时间</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            className="w-full mt-1 p-2 border rounded-lg"
            minDate={checkInDate || new Date()}
            placeholderText="选择离开日期"
          />
        </div>

        {/* 房型选择 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">房型</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          >
            <option value="standard">标准房</option>
            <option value="deluxe">豪华房</option>
            <option value="suite">套房</option>
          </select>
        </div>

        {/* 人数选择 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">入住人数</label>
          <input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        {/* 预订按钮 */}
        <Button onClick={handleBooking} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
          确认预订
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default HotelBookingModal;
