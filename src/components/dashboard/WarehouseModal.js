import React from 'react';


const WarehouseModal = ({ onClose, onSelect }) => {
  const warehouses = [
    { name: 'Samboan Warehouse' },
    { name: 'Labangon Warehouse' },
  ];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select Warehouse</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &#10006;
          </button>
        </div>
       
        <div className="grid grid-cols-2 gap-4">
          {warehouses.map((warehouse, index) => (
            <button
              key={index}
              className="border rounded-lg p-6 flex flex-col items-center hover:bg-gray-100"
              onClick={() => onSelect(warehouse.name)}
            >
              <img src="/warehouse-icon.png" alt="Warehouse" className="w-16 h-16 mb-2" />
              <span className="font-semibold text-lg">{warehouse.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default WarehouseModal;
