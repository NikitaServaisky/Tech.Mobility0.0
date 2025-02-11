import React from "react";

const List = ({ items, renderItem }) => {
  return (
  <ul className="list-contaimer">
    {items.map((item, id) => (
        <li key={id} className="list-item">
            {renderItem(item)}
        </li>
    ))}
  </ul>
);
};

export default List;