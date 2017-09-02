import React, { Component } from 'react'
import interact from 'interact.js'
import Draggable from './draggableItem';
import FaSignOut from 'react-icons/lib/fa/sign-out';

export default class SideBar extends Component {
  constructor(props){
    super(props);
    this.axis = {x: null, y: null, move: false};
  }

  mountInteract() {
    interact('.draggy')
      .draggable({
        enabled: this.props.selected,
        onmove: (event) => {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          this.axis.x = x;
          this.axis.y = y;
        },
        onend: (event) => {
          const target = event.target;
          target.setAttribute('data-x', 0);
          target.setAttribute('data-y', 0);
          this.props.addItem(); //무슨 데이터인지 보내주면 됨
        },
      })
  }

  toggleSideBar(){
    document.getElementById("sidebar").classList.toggle('active');
  }

  render() {
    this.mountInteract();
    return (
      <div id ="sidebar" style={{position:"fixed", zIndex:700, top:"-10px", opacity:0.8}}>
        <div className="toggle-btn" onClick={this.toggleSideBar.bind(this)}>
          <span className="thisSpan"></span>
          <span className="thisSpan"></span>
          <span className="thisSpan"></span>
        </div>
        <div className="logo" id="debug">
          Debugg<span className="titler">er</span>
        </div>
        <ul id="option">
          <li>
            <Draggable
              onMouseUp={this.props.addItem}
            />
          </li>
        </ul>
        
        <div className="SSreggi">
          {this.props.deletedItems.reverse().map((deletedItem) => (
            <div onClick={this.props.restoreDeletedItem.bind(this, deletedItem)} className="deletedItems" key={deletedItem.id} style={{ background: deletedItem.color }}>
              {deletedItem.title}
            </div>
          ))}
        </div>
        <a href="/logout">
          <button className="loggie">
            <FaSignOut size={20} color="#e4e4e5"/>
          </button>
        </a>
      </div>
    )
  }
}
