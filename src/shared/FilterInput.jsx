import React from 'react';

const FilterInput = ({ filterTerm, onFilterChange }) => {
  return (
    <div className="filter-input-container">
      <label htmlFor="filterInput">Search todos: </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
};

export default FilterInput;