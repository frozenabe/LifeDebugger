import React from 'react';
import moment from 'moment';
import axios from 'axios';
import Timeline from 'react-calendar-timeline/lib';
import SideBar from './components/sideBar';
import ItemMenu from './components/itemMenu';
import GroupMenu from './components/groupMenu';
import AddGroupBtn from './components/addGroupBtn';

const minTime = moment().add(-1, 'years').valueOf();
const maxTime = moment().add(18, 'years').valueOf();

const keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
}

export default class App extends React.Component {
  constructor (props) {
    super(props);
    const defaultTimeStart = moment().add(-12, 'hour');
    const defaultTimeEnd = moment().add(41, 'day');

    const { items, groups, deletedItems, deletedGroups } = [];

    this.state = {
      groups,
      items,
      deletedItems,
      deletedGroups,
      defaultTimeStart,
      defaultTimeEnd,
      selectedItem: null,
      selectedGroup: null,
      itemColor: {},
    };
  }

  componentDidMount() {
    axios.get('/init')
      .then((result) => {
        const [
          deletedGroups,
          groups,
          deletedItems,
          items,
        ] = result.data;

    const randomColor = () => {
      const rgb = [];
      for (let i = 1; i <= 3; i++) {
        rgb.push(Math.floor(Math.random() * 256));
      }

      return `rgb(${rgb.join(',')})`;
    };

    const newItemColorObj = {};
    const nextGroups = [];

    groups.forEach((group) => {
      const { groupId, tip, title } = group;
      const nextGroup = Object.assign({}, { tip, title });
      nextGroup.color = randomColor();
      newItemColorObj[groupId] = nextGroup.color;
      nextGroup.id = groupId;
      nextGroups.push(nextGroup);
    });

    const nextItems = [];

    items.forEach((item) => {
      const { itemId, tip, title, start, group, end } = item;
      const nextItem = Object.assign({}, { tip, title, start, group, end });
      nextItem.color = newItemColorObj[group];
      // console.log(nextItem.color);
      nextItem.id = itemId;
      nextItems.push(nextItem);
    });

    const nextDeletedItems = [];

    deletedItems.forEach((deletedItem) => {
      const { itemId, tip, title, start, group, end } = deletedItem;
      const nextDeletedItem = Object.assign({}, { tip, title, start, group, end });
      nextDeletedItem.color = newItemColorObj[group];
      nextDeletedItem.id = itemId;
      nextDeletedItems.push(nextDeletedItem);
    });

    this.setState({
        groups: nextGroups,
        items: nextItems,
        deletedItems: nextDeletedItems,
        deletedGroups,
        itemColor: newItemColorObj,
      });
    });
  }

  addItem = () => {
    const time = this.timeLine.state.cursorTime;
    const { items, deletedItems } = this.state;
    const groupId = this.state.groups[this.currentRow].id

    let maxIndex = -1;
  
    deletedItems.forEach((deletedItem) => {
      if (deletedItem.id * 1 > maxIndex) {
        maxIndex = deletedItem.id * 1;
      }
    })

    items.forEach((item) => {
      if (item.id * 1 > maxIndex) {
        maxIndex = item.id * 1;
      }
    })

    const newItem = {
      id: `${maxIndex + 1}`,
      group: `${groupId}`,
      title: 'newItem',
      start: time,
      end: time + 4 * 24 * 3600 * 1000,
      tip: 'additional information',
      color: this.state.itemColor[groupId]
    };

    axios.post('/addItem', newItem)

    // console.log(items)
    this.setState({
      items: [
        ...items,
        newItem
      ],
    });
  }

  addGroup = () => {
    const { groups, deletedGroups } = this.state;

    let maxIndex = -1;
    deletedGroups.forEach((deletedGroup) => {
      if (deletedGroup.id * 1 > maxIndex) {
        maxIndex = deletedGroup.id * 1;
      }
    })

    groups.forEach((group) => {
      if (group.id * 1 > maxIndex) {
        maxIndex = group.id * 1;
      }
    })

    let newGroup = {
      id: `${maxIndex + 1}`,
      title: 'newGroup',
      tip: 'additional information',
    };

    const randomColor = () => {
      const rgb = [];
      for (let i = 1; i <= 3; i++) {
        rgb.push(Math.floor(Math.random() * 256));
      }
      return `rgb(${rgb.join(',')})`;
    };

    axios.post('/addGroup', newGroup);

    newGroup = Object.assign({}, newGroup, { color: randomColor() });
    const obj = {};
    obj[newGroup.id] = newGroup.color;
    const newItemColorObj = Object.assign( {}, this.state.itemColor, obj );

    this.setState({
      groups: [
        ...groups,
        newGroup
      ],
      itemColor: newItemColorObj,
    });
  }

  handleCanvasClick = (groupId, time, event) => {
    // console.log('Canvas clicked', groupId, time, event, this.currentRow);
  }

  handleCanvasMove = (event) => {
    const [ row, time ] = this.timeLine.rowAndTimeFromEvent(event);
    //console.log(row, time);
    this.currentTime = time;
    this.currentRow = row;
  }

  handleCanvasContextMenu = (group, time, event) => {
    // console.log('Canvas context menu', group, time, event);
  }

  enterKeyPress = (clickEvent, itemId, currentTitle, event) => {
    event = event || window.event;
    const inputTitle = document.getElementById("inputScenarioTitle");
    const trashCan = document.getElementById("itemMenu" + itemId)

   if (event.keyCode === 13) {
      // REMOVE INPUT BOX ON ENTER
      const inputTitleValue = inputTitle.value || currentTitle.innerText;
      // console.log(currentTitle.innerText, typeof currentTitle.innerText)
      // console.log(inputTitle.value, typeof inputTitle.value)

      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;

      // SHOW CURRENTLY DISPLAYED TITLE
      currentTitle.style.display = "block";
      trashCan.style.display = "none";

      // INSERT CHANGED TITLE INFO INTO ITEMS
      const items = this.state.items.slice(0);

      items.forEach((item) => {
        if (item.id === itemId) {
          item.title = inputTitleValue;
        }
      })

      axios.post('/updateItemTitle', { itemId, inputTitleValue })
        .then( () => console.log("Group added to DB"))
        .catch( err => {throw err;} );

      this.setState({ items });
        // RESET CLICKED BEFORE
      this.clickedBefore = false;
    }

   if (event.keyCode === 27) {
      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;
      currentTitle.style.display = "block";
      trashCan.style.display = "none";
      this.clickedBefore = false;
    }

   return true;
  }

  enterKeyPressGroup = (clickEvent, groupId, currentTitle, copyCurrentTitle, event) => {
    event = event || window.event;
    const inputTitle = document.getElementById("inputGroup");
    const inputTitleValue = inputTitle.value || copyCurrentTitle;
    const trashCanGroup = document.getElementById("groupMenu" + groupId);

    if (event.keyCode === 13) {
      // console.log(this.state.items)
      // console.log(currentTitle, copyCurrentTitle)
      inputTitle.parentNode.removeChild(inputTitle);
      currentTitle.innerText = inputTitleValue;

      // SHOW CURRENTLY DISPLAYED TITLE
      currentTitle.style.display = "inline";
      trashCanGroup.style.display = "none";

      // INSERT CHANGED TITLE INFO INTO ITEMS
      const groups = this.state.groups.slice(0);

      let index;
      for (let i = 0; i < groups.length; i += 1) {
        if (groups[i].id === groupId) {
          index = i;
        }
      }

      groups[index].title = inputTitleValue;

      axios.post('/changeGroupTitle', { groupId, inputTitleValue })
        .then( () => console.log("Group added to DB"))
        .catch( err => {throw err;} );

      this.setState({ groups });
      // RESET CLICKED BEFORE
      this.groupClickedBefore = false;
    }

    if (event.keyCode === 27) {
      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;
      currentTitle.innerText = inputTitleValue;
      currentTitle.style.display = "inline";
      trashCanGroup.style.display = "none";
      this.groupClickedBefore = false;
    }

    return true;
  }

  handleItemClick = (itemId, event) => {
    // PUT INSIDE BAR IF CLICKED FOR THE FIRST TIME
    if (!this.clickedBefore) {
      const currentTitle = event.currentTarget.children[0].children[0].children[0].children[0];
      const trashCan = document.getElementById("itemMenu" + itemId)

      // CREATE INPUT ELEMENT
      const inputDOM = document.createElement('input');
      inputDOM.onkeydown = this.enterKeyPress.bind(this, event, itemId, currentTitle);
      inputDOM.setAttribute("id" , "inputScenarioTitle");
      inputDOM.setAttribute("type", "text/javascipt");
      inputDOM.value = `${currentTitle.innerText}`;

      // HIDE ORIGINAL TITLE TO SHOW INPUT
      currentTitle.style.display = "none";
      trashCan.style.display = "inline";

      // PUT INPUT INSIDE DOM
      event.currentTarget.children[0].prepend(inputDOM);
      this.inputNotShowing = false;

      // HAVE BEEN CLICKED ONCE
      this.clickedBefore = true;
      this.setState({
        selectedItem: event.currentTarget,
      });
      //console.log(this.state.selectedItem.getBoundingClientRect());
    }

    // console.log('Clicked: ' + itemId);
  }

  handleGroupClick = (groupId, event) => {
  // PUT INSIDE BAR IF CLICKED FOR THE FIRST TIME
    if (!this.groupClickedBefore) {
      const currentTitle = event.currentTarget;
      const copyCurrentTitle = currentTitle.innerText.slice(0);
      const trashCanGroup = document.getElementById("groupMenu" + groupId);

      // CREATE INPUT ELEMENT
      const inputDOM = document.createElement('input');
      inputDOM.onkeydown = this.enterKeyPressGroup.bind(this, event, groupId, currentTitle, copyCurrentTitle);
      inputDOM.setAttribute( "id" , "inputGroup"); //id 가 고유가 아니다.
      inputDOM.setAttribute( "type", "text/javascipt" );
      inputDOM.value = `${currentTitle.innerText}`;
      // console.log(inputDOM.value)
      // HIDE ORIGINAL TITLE TO SHOW INPUT
      // console.log(event.currentTarget.childNodes[0])
      trashCanGroup.style.display = "inline";
      currentTitle.innerText = '';


      // PUT INPUT INSIDE DOM
      event.currentTarget.prepend(inputDOM);
      this.inputNotShowing = false;
      this.groupClickedBefore = true;

      // HAVE BEEN CLICKED ONCE
      //console.log(event.currentTarget)
      this.setState({
        selectedGroup: event.currentTarget,
      });
      //console.log(this.state.selectedItem.getBoundingClientRect());
    }
  }

  handleItemSelect = (itemId) => {
    // console.log('Selected: ' + itemId);
  }

  handleItemToDeletedItems = (item) => {
    const { items, deletedItems } = this.state;
    // console.log(items)
    const updateDeletedItem = deletedItems.slice(0);

    updateDeletedItem.push(item)
    this.clickedBefore = false;

    let index;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id === item.id) {
        index = i;
      }
    }

    let newItems = items.slice(0);
    newItems.splice(index, 1);

    axios.post('/deleteItem', item)

    this.setState({
      items: newItems,
      selectedItem: null,
      deletedItems: updateDeletedItem,
    });
  }

  handleGroupToDeletedGroups = (group) => {
    const { groups, deletedGroups } = this.state;
    const updateDeletedGroup = deletedGroups.slice(0);

    updateDeletedGroup.push(group)
    this.groupClickedBefore = false;

    let index;
    for (let i = 0; i < groups.length; i += 1) {
      if (groups[i].id === group.id) {
        index = i;
      }
    }

    let newGroups = groups.slice(0);
    newGroups.splice(index, 1);

    axios.post('/deleteGroup', group)

    this.setState({
      groups: newGroups,
      selectedGroup: null,
      deletedGroups: updateDeletedGroup,
    });
  }

  restoreDeletedItem = (item) => {
    // console.log("this is the item");
    // console.log(item);
    const nextDeletedItems = this.state.deletedItems.slice(0);
    const nextItems = this.state.items.slice(0);
    for(let i = 0; i < nextDeletedItems.length; i++) {
      const deletedItem = nextDeletedItems[i];
      if (deletedItem.id === item.id) {
        nextItems.push(nextDeletedItems.splice(i, s1)[0]);
        break;
      }
    }

  //  console.log(nextDeletedItems);
    axios.post('/restoreDeletedItem', { item })
      .then( () => console.log("restored added to DB"))
      .catch( err => {throw err;} );
    this.setState({
      deletedItems: nextDeletedItems,
      items: nextItems
    })
  }

  handleItemContextMenu = (itemId) => {
    // console.log('Context Menu: ' + itemId);
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;
    const group = groups[newGroupOrder];

    let orderItem;
    items.forEach((item) => {
      if (item.id === itemId) {
        orderItem = Object.assign({}, item, {group: group.id});
      }
    })

    // console.log(orderItem)
    axios.post('/changeGroupOrder', orderItem)

    this.setState({
      items: items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start: dragTime,
            end: dragTime + (item.end - item.start),
            group: group.id,
            color: this.state.itemColor[group.id]
          })
        : item),
    })

    // console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    let resizedItem;
    items.forEach((item) => {
      if (item.id === itemid) {
        resizedItem = Object.assign({}, item, {
          start: edge === 'left' ? time : item.start,
          end: edge === 'left' ? item.end : time,
        });
      }
    })

    axios.post('/resizedItem', resizedItem);

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time,
            })
          : item)
    })

    // console.log('Resized', itemId, time, edge);
  }
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  }
  // moveResizeValidator = (action, item, time, resizeEdge) => {
  //   if (time < new Date().getTime()) {
  //     const newTime = Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
  //     return newTime;
  //   }

  //   return time;
  // }

  itemRenderer = ({ item }) => {
    return (
      <div>
        <div className="custom-item" style={{ background: item.color }} >
          <span className="title">
            {item.title}
          </span>
        </div>
        <ItemMenu
          onPressTrashCan={this.handleItemToDeletedItems.bind(this, item)}
          id={"itemMenu" + item.id}
        />
      </div>
    )
  }

  groupRenderer = ({ group }) => {
    return (
      <div className="group-container">
        <span className="custom-grouspan" onClick={event => this.handleGroupClick(group.id, event)}>
          {group.title}
        </span>
        <GroupMenu
          onPressTrashCanGroup={this.handleGroupToDeletedGroups.bind(this, group)}
          id={"groupMenu" + group.id}
        />
        <div className="colorBox" style={{ background: group.color }} />
      </div>
    )
  }

  render () {
    const {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd
    } = this.state;

    const checkIfGroupIsTooMany = groups.length < 12 ? 35 : 25;

    return (
      <div>
        <AddGroupBtn
                  addGroup={this.addGroup}
        />
        <SideBar
                  addItem={this.addItem}
                  deletedItems={this.state.deletedItems}
                  restoreDeletedItem={this.restoreDeletedItem}
        />
        <div className="content">
        <Timeline
                  ref={(timeLine) => {this.timeLine = timeLine;}}
                  groups={groups}
                  items={items}
                  keys={keys}
                  fixedHeader='fixed'
                  fullUpdate

                  minZoom={41 * 24 * 60 * 60 * 1000}
                  lineHeight={checkIfGroupIsTooMany}

                  sidebarWidth={150}
                  sidebarContent={<div className="userName" style={{textAlign:"center"}}>Category</div>} //username

                  canMove
                  canResize='right'
                  canSelect

                  itemsSorted
                  itemTouchSendsClick={false}
                  stackItems
                  itemHeightRatio={0.75}

                  showCursorLine

                  defaultTimeStart={defaultTimeStart}
                  defaultTimeEnd={defaultTimeEnd}

                  itemRenderer={this.itemRenderer}
                  groupRenderer={this.groupRenderer}

                  onCanvasClick={this.handleCanvasClick}
                  onCanvasMouseMove={this.handleCanvasMove}
                  onCanvasContextMenu={this.handleCanvasContextMenu}

                  onItemClick={this.handleItemClick}
                  onItemSelect={this.handleItemSelect}
                  onItemContextMenu={this.handleItemContextMenu}
                  onItemMove={this.handleItemMove}
                  onItemResize={this.handleItemResize}

                  onTimeChange={this.handleTimeChange}

                  moveResizeValidator={this.moveResizeValidator}>
        </Timeline>
        </div>
       </div>
    )
  }
}
