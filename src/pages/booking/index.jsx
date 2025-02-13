import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import Table from '@/components/ui/Table'
import { useBooking } from '@/hooks/useBooking'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import EditBookingModal from './EditBookingModal'
import { CSVLink } from 'react-csv'

const bookingColumns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'userId', label: 'User ID' },
    {
        key: 'bookingType',
        label: 'Type',
        type: 'select',
        options: [
            { value: 'Flight', label: 'Flight' },
            { value: 'Hotel', label: 'Hotel' },
            { value: 'Attraction', label: 'Attraction' }
        ]
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'Confirmed', label: 'Confirmed' },
            { value: 'Canceled', label: 'Canceled' },
            { value: 'Pending', label: 'Pending' }
        ]
    },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'displayCreatedAt', label: 'Created At', type: 'date' },
    { key: 'displayUpdatedAt', label: 'Updated At', type: 'date' }
]

const Booking = () => {
    const { bookings, isLoading, error, deleteBooking, editBooking } =
        useBooking()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)

    const handleDelete = async (item) => {
        try {
            await deleteBooking(item.bookingId)
        } catch (error) {
            console.error('Delete operation failed:', error)
        }
    }

    const handleEdit = (item) => {
        setSelectedBooking(item)
        setEditModalOpen(true)
    }

    const handleSave = async (updatedData) => {
        try {
            await editBooking(updatedData.bookingId, updatedData)
            setEditModalOpen(false)
            setSelectedBooking(null)
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
                        Bookings
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the bookings.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                        data={bookings}
                        headers={bookingColumns}
                        filename="bookings.csv"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
            {isLoading ? (
                <TableSkeleton columns={bookingColumns.length} rows={5} />
            ) : (
                <Table
                    data={bookings}
                    columns={bookingColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            <EditBookingModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedBooking(null)
                }}
                onSave={handleSave}
                bookingData={selectedBooking}
            />
        </div>
    )
}

export default Booking
