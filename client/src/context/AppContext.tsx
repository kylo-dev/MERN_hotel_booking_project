import axios, { type AxiosInstance } from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { isError } from "../types/guards";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URI;

interface AppContextType {
  currency: string;
  navigate: NavigateFunction;
  user: any;
  getToken: () => Promise<string | null>;
  isOwner: boolean;
  setIsOwner: (isOwner: boolean) => void;
  axios: AxiosInstance;
  showHotelReg: boolean;
  setShowHotelReg: (show: boolean) => void;
  searchedCities: string[];
  setSearchedCities: (cities: string[]) => void;
  rooms: string[];
  setRooms: (rooms: string[]) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  rooms?: string[];
  role?: string;
  recentSearchedCities?: string[];
  data?: T;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const currency: string = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [showHotelReg, setShowHotelReg] = useState<boolean>(false);
  const [searchedCities, setSearchedCities] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);

  const fetchRooms = async (): Promise<void> => {
    try {
      const { data }: { data: ApiResponse } = await axios.get("/api/rooms");
      if (data.success && data.rooms) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "방 정보를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      if (isError(error)) {
        toast.error(error.message);
      }
    }
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const token = await getToken();
      const { data }: { data: ApiResponse } = await axios.get(`/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      if (isError(error)) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value: AppContextType = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
