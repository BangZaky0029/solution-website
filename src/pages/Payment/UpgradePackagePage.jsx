// =========================================
// FILE: src/pages/Payment/UpgradePackagePage.jsx
// =========================================

import { useState, useEffect } from 'react';
import { paymentController } from '../../controllers/paymentController';
import PaymentForm from '../../components/forms/PaymentForm';

const UpgradePackagePage = ({ selectedPackage }) => {
  const [warning, setWarning] = useState(null);
  const [forceUpgrade, setForceUpgrade] = useState(false);

  const checkActivePackage = async () => {
    try {
      const res = await paymentController.checkActivePackage();
      if (res.hasActive) {
        setWarning(res.warning + ` Paket aktif: ${res.currentPackage.package_name}`);
      } else {
        setWarning(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkActivePackage();
  }, []);

  const handleCreatePayment = async (formData) => {
    try {
      const res = await paymentController.createPayment(
        selectedPackage.id,
        formData.paymentMethod,
        forceUpgrade
      );

      if (res.hasActive && !forceUpgrade) {
        alert(res.warning);
      } else {
        alert('Payment berhasil dibuat, lanjutkan upload bukti');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="payment-container p-6">
      {warning && (
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded mb-4">
          {warning}
          <button
            onClick={() => {
                setForceUpgrade(true);
                alert('Silakan submit ulang untuk melanjutkan upgrade paket.');
            }}
            className="ml-4 px-3 py-1 bg-yellow-500 text-white rounded"
            >
            Lanjutkan Upgrade
            </button>
        </div>
      )}

      <PaymentForm onSubmit={handleCreatePayment} />
    </div>
  );
};

export default UpgradePackagePage;
