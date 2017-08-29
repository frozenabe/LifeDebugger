import React from 'react';
import moment from 'moment';
import Timeline from 'react-calendar-timeline/lib';
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import SideBar from './components/sideBar';
//import GroupColor from './components/groupColor';
import ItemMenu from './components/itemMenu';
import GroupMenu from './components/groupMenu';
import AddGroupBtn from './components/addGroupBtn';


const minTime = moment().add(-1, 'years').valueOf(); 
const maxTime = moment().add(3, 'years').valueOf();

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
    super(props)
    const startDate = new Date().getTime();
    const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000;
    const endValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000 + 100000000;
    
    const items = [];
    const groups = [];
    const deletedItems = [];
    const deletedGroups = [];

    for (let i = 0; i < 13; i++) {
      items.push({
        id: `${i}`,
        group: `${i}`,
        title: 'hahahaha',
        start: startValue,
        end: endValue,
        tip: 'additional information',
      });

      groups.push({
        id: `${i}`,
        title: `Dummy${i}`,
        tip: 'additional information',
      });

      deletedItems.push({
        id: `${i}`,
        group: `${i}`,
        title: 'hahahaha',
        start: startValue,
        end: endValue,
        tip: 'additional information',
      });
    };

    const defaultTimeStart = moment().startOf('month').toDate();
    const defaultTimeEnd = moment().startOf('month').add(41, 'day').toDate();

    this.state = {
      groups,
      items,
      deletedItems,
      deletedGroups,
      defaultTimeStart,
      defaultTimeEnd,
      selectedItem: null,
      selectedGroup: null,
    };
  }

  addItem = () => {
    const time = this.timeLine.state.cursorTime;
    const { items } = this.state;
    const groupAdd = this.currentRow;
    this.setState({
      items: [
        ...items,
        {
          id: `${items.length}`,
          group: `${groupAdd}`,
          title: '',
          start: time,
          end: time + 4 * 24 * 3600 * 1000,
          tip: 'additional information',
        },
      ],
    });
  }

  addGroup = () => {
    const {groups} = this.state;

    this.setState({
      groups: [
        ...groups,
        {
          id: `${groups.length}`,
          title: '',
          tip: 'additional information',
        },
      ],
    });
  }

  handleCanvasClick = (groupId, time, event) => {
    console.log('Canvas clicked', groupId, time, event);
  }

  handleCanvasMove = (event) => {
    const [row, time] = this.timeLine.rowAndTimeFromEvent(event);
    //console.log(row, time);
    this.currentTime = time;
    this.currentRow = row;
  }

  handleCanvasContextMenu = (group, time, event) => {
    console.log('Canvas context menu', group, time, event);
  }

  enterKeyPress = (clickEvent, itemId, currentTitle, event) => {
    event = event || window.event;
    const inputTitle = document.getElementById("inputScenarioTitle");
    const trashCan = document.getElementById("itemMenu" + itemId)

    if (event.keyCode === 13) {
      // REMOVE INPUT BOX ON ENTER
      const inputTitleValue = inputTitle.value || currentTitle.innerText;

      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;

      // SHOW CURRENTLY DISPLAYED TITLE
      currentTitle.style.display = "inline";
      trashCan.style.display = "none";

      // INSERT CHANGED TITLE INFO INTO ITEMS
      const items = this.state.items.slice(0);
      items[itemId].title = inputTitleValue;
      this.setState({ items });
      // RESET CLICKED BEFORE
      this.clickedBefore = false;
    };

    if (event.keyCode === 27) {
      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;
      currentTitle.style.display = "inline";
      trashCan.style.display = "none";
      this.clickedBefore = false;
    };

    return true;
  }

  enterKeyPressGroup = (clickEvent, groupId, currentTitle, copyCurrentTitle, event) => {
    event = event || window.event;
    const inputTitle = document.getElementById("inputGroup");
    const inputTitleValue = inputTitle.value || copyCurrentTitle;
   
    if (event.keyCode === 13) {
      console.log(currentTitle, copyCurrentTitle)
      inputTitle.parentNode.removeChild(inputTitle);

      currentTitle.innerText = inputTitleValue;
      // SHOW CURRENTLY DISPLAYED TITLE
      currentTitle.style.display = "inline";

      // INSERT CHANGED TITLE INFO INTO ITEMS
      const groups = this.state.groups.slice(0);
      groups[groupId].title = inputTitleValue;
      this.setState({ groups });
      // RESET CLICKED BEFORE
      this.groupClickedBefore = false;
    };

    if (event.keyCode === 27) {
      inputTitle.parentNode.removeChild(inputTitle);
      //this.inputNotShowing = true;
      currentTitle.innerText = inputTitleValue;
      currentTitle.style.display = "inline";
      this.groupClickedBefore = false;
    };

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
      inputDOM.setAttribute( "id" , "inputScenarioTitle");
      inputDOM.setAttribute( "type", "text/javascipt" );
      inputDOM.value = `${currentTitle.innerText}`;

      // HIDE ORIGINAL TITLE TO SHOW INPUT
      currentTitle.style.display = "none";
      trashCan.style.display = "inline";

      // PUT INPUT INSIDE DOM
      event.currentTarget.children[0].prepend(inputDOM);
      this.inputNotShowing = false;

      // HAVE BEEN CLICKED ONCE
      this.clickedBefore = true;
      //console.log(event.currentTarget)
      this.setState({
        selectedItem: event.currentTarget,
      });
      //console.log(this.state.selectedItem.getBoundingClientRect());
    }

    console.log('Clicked: ' + itemId);
  }

  handleGroupClick = (groupId, event) => {
  // PUT INSIDE BAR IF CLICKED FOR THE FIRST TIME
    if (!this.groupClickedBefore) {
      const currentTitle = event.currentTarget;
      const copyCurrentTitle = currentTitle.innerText.slice(0)

      // CREATE INPUT ELEMENT
      const inputDOM = document.createElement('input');
      inputDOM.onkeydown = this.enterKeyPressGroup.bind(this, event, groupId, currentTitle, copyCurrentTitle);
      inputDOM.setAttribute( "id" , "inputGroup");
      inputDOM.setAttribute( "type", "text/javascipt" );
      inputDOM.value = `${currentTitle.innerText}`;
      console.log(inputDOM.value)
      // HIDE ORIGINAL TITLE TO SHOW INPUT
      console.log(event.currentTarget.childNodes[0])
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
    console.log('Selected: ' + itemId);
  }

  handleItemToDeletedItems = (item) => {
    const { items, deletedItems } = this.state;
    const updateDeletedItem = deletedItems.slice(0);
    updateDeletedItem.push(item)
    this.clickedBefore = false;
    
    this.setState({
      items: items.map(eachItem => 
        eachItem.id === item.id
          ? {}
          : eachItem),
      selectedItem: null,
      deletedItems: updateDeletedItem,
    });
  }

  handleGroupToDeletedGroups = (group) => {
    const { groups, deletedGroups } = this.state;
    const updateDeletedGroup = deletedGroups.slice(0);
    updateDeletedGroup.push(group)
    this.groupClickedBefore = false;
    
    this.setState({
      groups: groups.map(eachGroup => 
        eachGroup.id === group.id
          ? {}
          : eachGroup),
      selectedGroup: null,
      deletedGroups: updateDeletedGroup,
    });
  }

  handleItemContextMenu = (itemId) => {
    console.log('Context Menu: ' + itemId);
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;
    const group = groups[newGroupOrder];

    this.setState({
      items: items.map(item => 
        item.id === itemId 
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            }) 
          : item),
    })

    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map(item => 
        item.id === itemId 
          ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time,
            }) 
          : item)
    })

    console.log('Resized', itemId, time, edge);
  }
  // 캔버스 전체를 다시 재구조 하는 함수
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
  // 현재 시간 이전으로 움직이는 것을 방지하는 함수
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
        <div className="custom-item">
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
      <div>  
        <div className="custom-group" onClick={e => this.handleGroupClick(group.id, e)}>
          {group.title}
        </div>
        <GroupMenu 
          onPressTrashCanGroup={this.handleGroupToDeletedGroups.bind(this, group)}
          id={"groupMenu" + group.id}
        />
      </div>
    )
  }

  render () {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

    return (
      <div>
        <AddGroupBtn addGroup={this.addGroup} />
        <SideBar
          addItem={this.addItem.bind(this)}
        />
        <Timeline 
                  ref={(timeLine) => {this.timeLine = timeLine;}}
                  groups={groups}
                  items={items}
                  keys={keys}
                  fixedHeader='fixed'
                  fullUpdate

                  minZoom={41 * 24 * 60 * 60 * 1000}

                  sidebarWidth={150}
                  sidebarContent={<div className="userName" style={{textAlign:"center"}}>Username</div>} //username
                  //rightSidebarWidth={150}
                  //rightSidebarContent={<div>Above The Right</div>}

                  canMove
                  canResize='right'
                  canSelect

                  itemsSorted
                  itemTouchSendsClick={false}
                  stackItems
                  itemHeightRatio={0.75}

                  showCursorLine

                  resizeDetector={containerResizeDetector}

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
    )
  }
}
