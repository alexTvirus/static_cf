import { formatDate1 } from '../../../utils/date-helpers'
import { formatPrice } from '../../../utils/price-helpers'
import { BOOKING_STATUS } from '../../../utils/constants'

import { Tag } from 'antd';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import Expand from 'react-expand-animated';

const BookingPanel = ({ bookings, onCancelBooking }) => {
  const [isExpandRooms, setIsExpandRooms] = useState(() => {
    const rooms = bookings.map((booking, index) => {
      return false;
    })
    return rooms || []
  });
  const [isExpandPayments, setIsExpandPayments] = useState(() => {
    const payments = bookings.map((booking, index) => {
      return false;
    })
    return payments || []
  });

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking, index) => (
            <ul>
              <li key={`${index}`} className="bg-white hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex gap-x-2">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-4 4V3m0 4v8m-4-4h8"
                          />
                        </svg>
                        Booking Date: {formatDate1(booking.created_at)}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        Check-in: {formatDate1(booking.checkin_at)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">

                        Check-out: {formatDate1(booking.checkout_at)}

                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">

                        Guests: {booking.number_guests}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        {
                          (() => {
                            let rs = "";
                            switch (booking.status) {
                              case BOOKING_STATUS.COMPLETE.id: rs = (<Tag color="success">{BOOKING_STATUS.COMPLETE.name}</Tag>); break;
                              case BOOKING_STATUS.PARTIALLY_PAID.id: rs = (<Tag color="warning">{BOOKING_STATUS.PARTIALLY_PAID.name}</Tag>); break;
                              case BOOKING_STATUS.CANCEL.id: rs = (<Tag color="error">{BOOKING_STATUS.CANCEL.name}</Tag>); break;
                              case BOOKING_STATUS.PENDING.id: rs = (<Tag color="processing">{BOOKING_STATUS.PENDING.name}</Tag>); break;
							  case BOOKING_STATUS.PENDING_CANCEL.id: rs = (<Tag color="processing">{BOOKING_STATUS.PENDING_CANCEL.name}</Tag>); break;
							  
                            }
                            return rs;
                          })()
                        }

                      </p>
                    </div>
                    <div className="mt-2 items-center gap-x-2 text-sm text-gray-500 sm:flex-col  sm:mt-0">

                      <p className="flex items-center mb-2">
                        <span className="font-medium">Total price: </span>{' '}
                        <span className="ml-2">{formatPrice(booking.total_price)}</span>
                      </p>
                      {
                        (booking.canCancel)
                        &&
                        (booking.status != BOOKING_STATUS.CANCEL.id && booking.status != BOOKING_STATUS.PENDING_CANCEL.id)
                        &&
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className='hover:bg-red-600 transition 
                    duration-300 bg-brand-danger px-4 py-2 text-white whitespace-nowrap'>Cancel</button>
                      }

                    </div>
                  </div>
                </div>
              </li>
              <li key={`${index}${index}`} className="bg-white hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        onClick={() => {
                          setIsExpandRooms((() => {
                            let newArray = [...isExpandRooms]
                            newArray[index] = !newArray[index]
                            return newArray
                          })())
                        }}
                        className="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Rooms
                      </p>
                    </div>
                  </div>
                  <Expand open={isExpandRooms[index]}>
                    {booking.rooms && booking.rooms.length > 0 &&
                      (() => {
                        const columns = [
                          {
                            title: 'room_number',
                            dataIndex: 'room_number',
                            key: 'room_number',
                            render: (_, { room_number }) => {
                              return (
                                <Tag className='cursor-default' color={"green"}>
                                  {room_number}
                                </Tag>
                              );
                            }
                          },
                          {
                            title: 'packet',
                            dataIndex: 'packet',
                            key: 'packet',
                            render: (_, { packet }) => {
                              return (
                                <span className='cursor-default'>{packet}</span>
                              );
                            },
							responsive: ["sm"]
                          },
                          {
                            title: 'room_type',
                            dataIndex: 'room_type',
                            key: 'room_type',
                            render: (_, { room_type }) => {
                              return (
                                <span className='cursor-default'>{room_type}</span>
                              );
                            },
							responsive: ["sm"]
                          }
                        ];


                        const data =
                          booking.rooms.map((room, index) => {
                            return {
                              key: index,
                              room_number: room?.room_number || "",
                              packet: room?.packet || "",
                              room_type: room?.room_type || "",
                            }
                          })

                        return (<Table className='mt-2' pagination={false} columns={columns} dataSource={data} />)

                      })()
                    }
                  </Expand>

                </div>
              </li>
              <li key={`${index}${index}${index}`} className="bg-white hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        onClick={() => {
                          setIsExpandPayments((() => {
                            let newArray = [...isExpandPayments]
                            newArray[index] = !newArray[index]
                            return newArray
                          })())
                        }}
                        className="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Payments
                      </p>
                    </div>
                  </div>
                  <Expand open={isExpandPayments[index]}>
                    {booking.payments && booking.payments.length > 0 &&
                      (() => {
                        const columns = [
							{
								title: 'email',
								dataIndex: 'email',
								key: 'email',
								render: (_, { email }) => {
								  return (
									<span className='cursor-default'>{email}</span>
								  );
								}

							  },
                          {
                            title: 'payment_date',
                            dataIndex: 'payment_date',
                            key: 'payment_date',
                            render: (_, { payment_date }) => {
                              return (
                                <span className='cursor-default'>{payment_date}</span>
                              );
                            },
							responsive: ["sm","md"]

                          },
                          {
                            title: 'payment_method',
                            dataIndex: 'payment_method',
                            key: 'payment_method',
                            render: (_, { payment_method }) => {
                              return (
                                <span className='cursor-default'>{payment_method}</span>
                              );
                            },
							responsive: ["sm","md"]
                          },
                          {
                            title: 'payment_amount',
                            dataIndex: 'payment_amount',
                            key: 'payment_amount',
                            render: (_, { payment_amount }) => {
                              return (
                                <span className='cursor-default'>{payment_amount}</span>
                              );
                            }
                          },
                        ];


                        const data =
                          booking.payments.map((payment, index) => {
                            return {
                              key: index,
							  email: payment?.email || "",
                              payment_date: formatDate1(payment?.payment_date) || "",
                              payment_method: payment?.payment_method || "",
                              payment_amount: formatPrice(payment?.payment_amount) || 0,
                            }
                          })

                        return (<Table className='mt-2' pagination={false} columns={columns} dataSource={data} />)

                      })()
                    }
                  </Expand>


                </div>
              </li>
            </ul>

          ))}
        </ul>
      </div>

    </>
  );
};

export default BookingPanel;
