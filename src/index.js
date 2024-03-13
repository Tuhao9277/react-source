// import ReactDOM from 'react-dom/client'
import ReactDOM from './react/react-dom'
import './index.css'
import React from './react/react'

function MyFnComponent(props) {
  return <div className="33-class">MyFnComponent</div>
}
class MyClassComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xxx: '99999',
    }
  }

  render() {
    return <div>class Component{this.state.xxx}</div>
  }
}
const element = (
  <div>
    <MyClassComponent />
    {/* <MyFnComponent xx="xx1" /> */}
  </div>
)
ReactDOM.render(element, document.getElementById('root'))
