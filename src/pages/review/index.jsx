import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import Table from '@/components/ui/Table'
import { useReview } from '@/hooks/useReview'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import EditReviewModal from './EditReviewModal'
import ReplyReviewModal from './ReplyReviewModal'
import { CSVLink } from 'react-csv'

const reviewColumns = [
    { key: 'reviewId', label: 'ID' },
    { key: 'userId', label: 'User ID' },
    {
        key: 'itemType',
        label: 'Item Type',
        type: 'select',
        options: [
            { value: 'Flight', label: 'Flight' },
            { value: 'Hotel', label: 'Hotel' },
            { value: 'Attraction', label: 'Attraction' }
        ]
    },
    { key: 'itemId', label: 'Item ID' },
    {
        key: 'rating',
        label: 'Rating',
        type: 'select',
        options: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => ({
            value: rating.toString(),
            label: rating.toString()
        }))
    },
    { key: 'comment', label: 'Comment' },
    { key: 'reply', label: 'Reply' }
]

const Review = () => {
    const { reviews, isLoading, error, deleteReview, editReview, addReply } =
        useReview()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [replyModalOpen, setReplyModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)

    const handleDelete = async (item) => {
        try {
            await deleteReview(item.reviewId)
        } catch (error) {
            console.error('Delete operation failed:', error)
        }
    }

    const handleEdit = (item) => {
        setSelectedReview(item)
        setEditModalOpen(true)
    }

    const handleReply = (item) => {
        setSelectedReview(item)
        setReplyModalOpen(true)
    }

    const handleSave = async (updatedData) => {
        try {
            await editReview(updatedData.reviewId, updatedData)
            setEditModalOpen(false)
            setSelectedReview(null)
        } catch (error) {
            console.error('Update operation failed:', error)
        }
    }

    const handleReplySave = async (replyText) => {
        try {
            if (!selectedReview) return
            await addReply(selectedReview.reviewId, replyText)
            setReplyModalOpen(false)
            setSelectedReview(null)
        } catch (error) {
            console.error('Reply save failed:', error)
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
                        Reviews
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all reviews and feedback.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <CSVLink
                        data={reviews}
                        headers={reviewColumns}
                        filename="reviews.csv"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
            {isLoading ? (
                <TableSkeleton columns={reviewColumns.length} rows={5} />
            ) : (
                <Table
                    data={reviews}
                    columns={reviewColumns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onReply={handleReply}
                />
            )}

            <EditReviewModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedReview(null)
                }}
                onSave={handleSave}
                reviewData={selectedReview}
            />

            <ReplyReviewModal
                isOpen={replyModalOpen}
                onClose={() => {
                    setReplyModalOpen(false)
                    setSelectedReview(null)
                }}
                onSave={handleReplySave}
                reviewData={selectedReview}
            />
        </div>
    )
}

export default Review
