import React from 'react';

const GroupMenu = ({ onPressTrashCanGroup, id }) => (
  <a onClick={onPressTrashCanGroup} className="trashGroup" id={id}>x</a>
)

export default GroupMenu;