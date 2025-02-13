import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import Table from '@/components/ui/Table'
import { useFlight } from '@/hooks/useFlight'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import EditFlightModal from './EditFlightModal'
import { CSVLink } from 'react-csv'

const flightBookingColumns = [
    { key: 'flightBookingId', label: 'ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'flightId', label: 'Flight ID' },
    {
        key: 'seatClass',
        label: 'Seat Class',
        type: 'select',
        options: [
            { value: 'Business', label: 'Business' },
            { value: 'Economy', label: 'Economy' },
            { value: 'First', label: 'First' }
        ]
    },
    { key: 'passengerName', label: 'Passenger Name' },
    { key: 'passengerId', label: 'Passenger ID' }
]

const Flight = () => {
    const {
        flightBookings,
        isLoading,
        error,
        deleteFlightBooking,
        editFlightBooking
    } = useFlight()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedFlight, setSelectedFlight] = useState(null)

    const handleDelete = async (item) => {
        try {
            await deleteFlightBooking(item.flightBookingId)
        } catch (error) {
            console.error('Delete operation failed:', error)
        }
    }

    const handleEdit = (item) => {
        setSelectedFlight(item)
        setEditModalOpen(true)
    }

    const handleSave = async (updatedData) => {
        try {
            await editFlightBooking(updatedData.flightBookingId, updatedData)
            setEditModalOpen(false)
            setSelectedFlight(null)
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
                        Flight Bookings
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the flight bookings.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                        data={flightBookings}
                        headers={flightBookingColumns}
                        filename="flight_bookings.csv"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
            {isLoading ? (
                <TableSkeleton columns={flightBookingColumns.length} rows={5} />
            ) : (
                <Table
                    data={flightBookings}
                    columns={flightBookingColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            <EditFlightModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedFlight(null)
                }}
                onSave={handleSave}
                flightData={selectedFlight}
            />
        </div>
    )
}

export default Flight
