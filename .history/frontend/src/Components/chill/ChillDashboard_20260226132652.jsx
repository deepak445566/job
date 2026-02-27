// components/ChillDashboard.jsx
import React, { useState } from 'react';

function ChillDashboard() {
  const [activeTab, setActiveTab] = useState('music');
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
  
  );
}

export default ChillDashboard;