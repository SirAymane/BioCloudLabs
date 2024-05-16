import React, { useState, useEffect } from 'react';
import { VirtualMachine } from './../../models/VirtualMachines';
import { notify } from '../../utils/notificationUtils';

const VMStatus: React.FC = () => {
    const [vm, setVm] = useState<VirtualMachine | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
  const checkVMStatus = async () => {
    setIsLoading(true);

    const ongoingSetup = sessionStorage.getItem('vmSetupInProgress') === 'true';
    if (ongoingSetup) {
      notify('VM setup in progress...', 'info');
    }

    // Perform a check for VM details after a slight delay
    setTimeout(() => {
      const storedVm = localStorage.getItem('vmDetails');
      const vmDetails = storedVm ? JSON.parse(storedVm) : null;

      if (vmDetails && vmDetails.ip && vmDetails.dns && !ongoingSetup) {
        setVm({
          ip: vmDetails.ip,
          url: `https://${vmDetails.dns}`,
          price: vmDetails.price || 3,
          dns: vmDetails.dns
        });
        sessionStorage.removeItem('vmSetupInProgress');
        notify('Virtual machine is ready!', 'success');
      } else {
        // Handle no VM details found
        notify('No VM details available. Waiting for VM setup to complete.', 'info');
      }
      setIsLoading(false);
    }, 1000);
  };

  checkVMStatus();
}, []);



    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <h1 className="text-3xl font-bold mb-4 ">VM Status</h1>
            {isLoading ? (
                <div className="flex flex-col justify-center items-center pt-20"> {/* Added padding-top to keep items near the top */}
                    <h2 className="text-xl font-semibold text-blue-500 mb-4">Checking VM status...</h2>
                    <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-12 h-12"></div>
                </div>

            ) : vm ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Virtual Machine Details</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vm.ip}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">DNS</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <a href={`https://${vm.dns}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{vm.dns}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ) : (
                <p className="text-lg text-red-500">Failed to load VM details. Please check the system and try again later.</p>
            )}
        </div>
    );
};

export default VMStatus;
