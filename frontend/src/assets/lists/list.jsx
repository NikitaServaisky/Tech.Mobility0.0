import React from "react";

const List = ({ items, renderItem, className="", itemclassName="" }) => {
  return (
  <ul className={`list-container ${className}`}>
    {items.map((item, id) => (
        <li key={id} className={`list-item ${itemclassName}`}>
            {renderItem(item)}
        </li>
    ))}
  </ul>
);
};

export default List;