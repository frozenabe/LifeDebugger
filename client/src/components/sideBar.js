import React, { Component } from 'react'
import interact from 'interact.js'
import Draggable from './draggableItem';

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
      <div id ="sidebar" style={{position:"fixed", zIndex:700, top:"-10px", opacity:0.9}}>
        <div className="toggle-btn" onClick={this.toggleSideBar.bind(this)}>
          <span className="thisSpan"></span>
          <span className="thisSpan"></span>
          <span className="thisSpan"></span>
        </div>
        <ul id="option">
          <li>
            <Draggable
              onMouseUp={this.props.addItem}
            />
          </li>
        </ul>
        <div className="SSreggi" style={{position:"relative", zIndex:900, top:"62%", left:"12%",background:"blue", height:"170px", width:"150px", color:"white"}}>
        </div>
        <a href="/logout"><button>Logout</button></a>
      </div>
    )
  }
}
