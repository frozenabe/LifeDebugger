import React from 'react';

const ItemMenu = ({ onPressTrashCan, id }) => (
  <a onClick={onPressTrashCan} className="trash" id={id}>x</a>
)

export default ItemMenu;