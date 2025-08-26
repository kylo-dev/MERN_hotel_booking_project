import Navbar from "./components/Navbar.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Footer from "./components/Footer.tsx";
import AllRooms from "./pages/AllRooms.tsx";
import RoomDetails from "./pages/RoomDetails.tsx";
import MyBookings from "./pages/MyBookings.tsx";
import HotelReg from "./components/HotelReg.tsx";
import Layout from "./pages/hotelOwner/Layout.tsx";
import Dashboard from "./pages/hotelOwner/Dashboard.tsx";
import AddRoom from "./pages/hotelOwner/AddRoom.tsx";
import ListRoom from "./pages/hotelOwner/ListRoom.tsx";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext.tsx";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
