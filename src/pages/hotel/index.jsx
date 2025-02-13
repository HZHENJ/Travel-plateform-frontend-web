// src/pages/hotel/index.jsx
import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import Table from '@/components/ui/Table'
import { useHotel } from '@/hooks/useHotel'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import EditHotelModal from './EditHotelModal'
import { CSVLink } from 'react-csv'

const hotelBookingColumns = [
    { key: 'hotelBookingId', label: 'ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'hotelId', label: 'Hotel ID' },
    { key: 'checkInDate', label: 'Check-in Date', type: 'date' },
    { key: 'checkOutDate', label: 'Check-out Date', type: 'date' },
    {
        key: 'roomType',
        label: 'Room Type',
        type: 'select',
        options: [
            { value: 'Standard', label: 'Standard' },
            { value: 'Deluxe', label: 'Deluxe' },
            { value: 'Suite', label: 'Suite' }
        ]
    },
    { key: 'location', label: 'Location' },
    { key: 'guests', label: 'Guests' }
]

const Hotel = () => {
    const {
        hotelBookings,
        isLoading,
        error,
        deleteHotelBooking,
        editHotelBooking
    } = useHotel()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedHotel, setSelectedHotel] = useState(null)

    const handleDelete = async (item) => {
        try {
            await deleteHotelBooking(item.hotelBookingId)
        } catch (error) {
            console.error('Delete operation failed:', error)
        }
    }

    const handleEdit = (item) => {
        setSelectedHotel(item)
        setEditModalOpen(true)
    }

    const handleSave = async (updatedData) => {
        try {
            await editHotelBooking(updatedData.hotelBookingId, updatedData)
            setEditModalOpen(false)
            setSelectedHotel(null)
        } catch (error) {
            console.error('Update operation failed:', error)
        }
    }

    if (error) {
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <Alert message={error} />
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="justify-between sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base leading-6 font-semibold text-gray-900">
                        Hotel Bookings
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the hotel bookings.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                        data={hotelBookings}
                        headers={hotelBookingColumns}
                        filename="hotel_bookings.csv"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
            {isLoading ? (
                <TableSkeleton columns={hotelBookingColumns.length} rows={5} />
            ) : (
                <Table
                    data={hotelBookings}
                    columns={hotelBookingColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            <EditHotelModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedHotel(null)
                }}
                onSave={handleSave}
                hotelData={selectedHotel}
            />
        </div>
    )
}

export default Hotel
