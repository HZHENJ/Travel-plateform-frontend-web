import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const EditFlightModal = ({ isOpen, onClose, onSave, flightData }) => {
    const [formData, setFormData] = useState({
        flightBookingId: '',
        bookingId: '',
        flightId: '',
        seatClass: '',
        passengerName: '',
        passengerId: ''
    })

    useEffect(() => {
        if (flightData) {
            setFormData(flightData)
        }
    }, [flightData])

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
                            Edit Flight Booking
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
                                    htmlFor="flightId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Flight ID
                                </label>
                                <input
                                    type="text"
                                    name="flightId"
                                    id="flightId"
                                    value={formData.flightId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="seatClass"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Seat Class
                                </label>
                                <select
                                    name="seatClass"
                                    id="seatClass"
                                    value={formData.seatClass}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                >
                                    <option value="">Select class</option>
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="First">First</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="passengerName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Passenger Name
                                </label>
                                <input
                                    type="text"
                                    name="passengerName"
                                    id="passengerName"
                                    value={formData.passengerName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="passengerId"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Passenger ID
                                </label>
                                <input
                                    type="text"
                                    name="passengerId"
                                    id="passengerId"
                                    value={formData.passengerId}
                                    onChange={handleChange}
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

EditFlightModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    flightData: PropTypes.shape({
        flightBookingId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        flightId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        seatClass: PropTypes.string,
        passengerName: PropTypes.string,
        passengerId: PropTypes.string
    })
}

EditFlightModal.defaultProps = {
    flightData: null
}

export default EditFlightModal
