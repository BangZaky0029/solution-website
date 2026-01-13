// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\utils\services-data-icons.jsx

import { 
  FaFileAlt, FaCalculator, FaHome, FaTruck, FaDollarSign, FaFileInvoice, FaPen, FaMailBulk, FaBriefcase, FaReceipt 
} from "react-icons/fa";

export const Icons = {
  document: () => <FaFileAlt size={24} color="#EF4444" />,
  calculator: () => <FaCalculator size={24} color="#4F46E5" />,
  home: () => <FaHome size={24} color="#10B981" />,
  truck: () => <FaTruck size={24} color="#F59E0B" />,
  dollar: () => <FaDollarSign size={24} color="#10B981" />,
  chart: () => <FaFileInvoice size={24} color="#22D3EE" />,
  pen: () => <FaPen size={24} color="#6366F1" />,
  mail: () => <FaMailBulk size={24} color="#8B5CF6" />,
  briefcase: () => <FaBriefcase size={24} color="#EC4899" />,
  receipt: () => <FaReceipt size={24} color="#FBBF24" />,
  fileText: () => <FaFileAlt size={24} color="#6B7280" />, // default
};

