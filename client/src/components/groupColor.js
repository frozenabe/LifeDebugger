// import React, { Component } from 'react';

// export default class GroupColor extends Component {
//   // only repaint if something really changes
//   shouldComponentUpdate (nextProps) {
//     return nextProps.canvasTimeStart !== this.props.canvasTimeStart ||
//            nextProps.canvasTimeEnd !== this.props.canvasTimeEnd ||
//            nextProps.canvasWidth !== this.props.canvasWidth ||
//            Object.values(nextProps.groupHeights).join(',') !== Object.values(this.props.groupHeights).join(',')
//   }

//   render () {
//     const { groupTops, groupHeights, canvasWidth, groups } = this.props

//     let backgrounds = []
//     for (let i = 0; i < groups.length; i++) {
//       backgrounds.push(
//         <div key={i}
//              style={{
//                position: "absolute",
//                top: groupTops[i],
//                height: groupHeights[i],
//                left: 0,
//                width: canvasWidth,
//                //background: 'blue',
//                zIndex: 20
//              }} />
//       )
//     }

//     return (
//       <div style={{display: "absolute"}}>
//         {backgrounds}
//       </div>
//     )
//   }
// }