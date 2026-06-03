import React from 'react';

const SortBy = ({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) => {
  return (
    <div className="sort-by-container">
      <div>
        <label htmlFor="sortBySelect">Sort by: </label>
        <select 
          id="sortBySelect" 
          value={sortBy} 
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortDirectionSelect">Order: </label>
        <select 
          id="sortDirectionSelect" 
          value={sortDirection} 
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default SortBy;