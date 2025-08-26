import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

interface Room {
  _id: string;
  roomType: string;
  amenities: string[];
  pricePerNight: number;
  isAvailable: boolean;
}

const ListRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const { currency, axios, getToken, user } = useAppContext();

  // Fetch Rooms of the Hotel Owner
  const fetchRooms = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "방 정보를 불러오는데 실패했습니다.");
    }
  };

  // Toggle Availability of the Room
  const toggleAvailability = async (roomId: string): Promise<void> => {
    try {
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "가용성 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facility
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((item: Room, index: number) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {currency} {item.pricePerNight}
                </td>

                <td className="py-3 px-4 text-red-500 border-t border-gray-300 text-sm text-center">
                  <label
                    htmlFor={`room-${item._id}`}
                    className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3"
                  >
                    <input
                      id={`room-${item._id}`}
                      onChange={() => toggleAvailability(item._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                    />
                    <div
                      className={`w-12 h-7 rounded-full transition-colors duration-200 ${
                        item.isAvailable ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    ></div>
                    <span
                      className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        item.isAvailable ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
