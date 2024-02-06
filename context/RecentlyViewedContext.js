// RecentlyViewedContext.js

import React, { createContext, useContext, useState } from 'react';

const RecentlyViewedContext = createContext();

const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);

  const handleImageItemClick = (path, name) => {
    const newRecentlyViewedItems = [
      { path, name, timestamp: new Date() },
      ...recentlyViewedItems,
    ];

    const limitedRecentlyViewedItems = newRecentlyViewedItems.slice(0, 10);
    setRecentlyViewedItems(limitedRecentlyViewedItems);
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewedItems, handleImageItemClick }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

const useRecentlyViewed = () => {
  return useContext(RecentlyViewedContext);
};

export { RecentlyViewedProvider, useRecentlyViewed };
