import React from "react";
import { Link } from "react-router-dom";
import List from "../../assets/lists/list";
import { headerOptions } from "../../assets/future_questions_fields/headerList";

const Navigation = () => {
    return (
        <List
        items={headerOptions}
        className="header-list"
        itemclassName="header-list-item"
        renderItem={(item) => <Link to={item.to}>{item.label}</Link>}
        />
    );
};

export default Navigation;