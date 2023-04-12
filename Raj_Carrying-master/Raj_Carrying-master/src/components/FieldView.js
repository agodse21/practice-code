import React from "react";
import "./FieldView.css"

class FieldView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fields: this.props.fields
    }
  }
  render(){
    return (
      <div className="field-container">
        {this.state.fields.map((field) => (
          <div className={field.className} key={field.label}> 
          <div className="field-label">
          {field.label}
          </div>
          {field.items.map((item)=> (
            <div className={item.className} key={item.name}>
              {item.value}
            </div>
          ))}
          </div>
        ))}
      </div>
    )
  }
}

export default FieldView