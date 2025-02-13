import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import Table from '@/components/ui/Table'
import { useAttraction } from '@/hooks/useAttraction'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import EditAttractionModal from './EditAttractionModal'
import { CSVLink } from 'react-csv'

const attractionBookingColumns = [
    { key: 'attractionBookingId', label: 'ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'attractionId', label: 'Attraction ID' },
    { key: 'visitDate', label: 'Visit Date', type: 'date' },
    {
        key: 'ticketType',
        label: 'Ticket Type',
        type: 'select',
        options: [
            { value: 'Adult', label: 'Adult' },
            { value: 'Child', label: 'Child' },
            { value: 'Senior', label: 'Senior' }
        ]
    },
    { key: 'numberOfTickets', label: 'Number of Tickets' }
]

const Attraction = () => {
    const {
        attractionBookings,
        isLoading,
        error,
        deleteAttractionBooking,
        editAttractionBooking
    } = useAttraction()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedAttraction, setSelectedAttraction] = useState(null)

    const handleDelete = async (item) => {
        try {
            await deleteAttractionBooking(item.attractionBookingId)
        } catch (error) {
            console.error('Delete operation failed:', error)
        }
    }

    const handleEdit = (item) => {
        setSelectedAttraction(item)
        setEditModalOpen(true)
    }

    const handleSave = async (updatedData) => {
        try {
            await editAttractionBooking(
                updatedData.attractionBookingId,
                updatedData
            )
            setEditModalOpen(false)
            setSelectedAttraction(null)
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
                        Attraction Bookings
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the attraction bookings.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                        data={attractionBookings}
                        headers={attractionBookingColumns}
                        filename="attraction_bookings.csv"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
            {isLoading ? (
                <TableSkeleton
                    columns={attractionBookingColumns.length}
                    rows={5}
                />
            ) : (
                <Table
                    data={attractionBookings}
                    columns={attractionBookingColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
            <EditAttractionModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedAttraction(null)
                }}
                onSave={handleSave}
                attractionData={selectedAttraction}
            />
        </div>
    )
}

export default Attraction
