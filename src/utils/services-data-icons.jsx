// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\utils\services-data-icons.jsx
// Migrated from react-icons/fa to lucide-react for smaller bundle size

import {
  FileText, Calculator, Home, Truck, DollarSign, FileSpreadsheet,
  Pen, Mail, Briefcase, Receipt
} from "lucide-react";

export const Icons = {
  document:   () => <FileText       size={24} color="#EF4444" />,
  calculator: () => <Calculator     size={24} color="#4F46E5" />,
  home:       () => <Home           size={24} color="#10B981" />,
  truck:      () => <Truck          size={24} color="#F59E0B" />,
  dollar:     () => <DollarSign     size={24} color="#10B981" />,
  chart:      () => <FileSpreadsheet size={24} color="#22D3EE" />,
  pen:        () => <Pen            size={24} color="#6366F1" />,
  mail:       () => <Mail           size={24} color="#8B5CF6" />,
  briefcase:  () => <Briefcase      size={24} color="#EC4899" />,
  receipt:    () => <Receipt        size={24} color="#FBBF24" />,
  fileText:   () => <FileText       size={24} color="#6B7280" />, // default
};
