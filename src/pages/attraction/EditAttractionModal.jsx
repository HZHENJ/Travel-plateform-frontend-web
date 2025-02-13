import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const EditAttractionModal = ({ isOpen, onClose, onSave, attractionData }) => {
    const [formData, setFormData] = useState({
        attractionBookingId: '',
        bookingId: '',
        attractionId: '',
        visitDate: '',
        ticketType: '',
        numberOfTickets: ''
    })

    useEffect(() => {
        if (attractionData) {
            setFormData(attractionData)
        }
    }, [attractionData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                            Edit Attraction Booking
                        </Dialog.Title>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md text-gray-400 hover:text-gray-500"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="bookingId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Booking ID
                                </label>
                                <input
                                    type="text"
                                    name="bookingId"
                                    id="bookingId"
                                    value={formData.bookingId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="attractionId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Attraction ID
                                </label>
                                <input
                                    type="text"
                                    name="attractionId"
                                    id="attractionId"
                                    value={formData.attractionId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="visitDate"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Visit Date
                                </label>
                                <input
                                    type="date"
                                    name="visitDate"
                                    id="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="ticketType"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Ticket Type
                                </label>
                                <select
                                    name="ticketType"
                                    id="ticketType"
                                    value={formData.ticketType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                >
                                    <option value="">Select ticket type</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Child">Child</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="numberOfTickets"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Number of Tickets
                                </label>
                                <input
                                    type="number"
                                    name="numberOfTickets"
                                    id="numberOfTickets"
                                    value={formData.numberOfTickets}
                                    onChange={handleChange}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

EditAttractionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    attractionData: PropTypes.shape({
        attractionBookingId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        attractionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        visitDate: PropTypes.string,
        ticketType: PropTypes.string,
        numberOfTickets: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    })
}

EditAttractionModal.defaultProps = {
    attractionData: null
}

export default EditAttractionModal
