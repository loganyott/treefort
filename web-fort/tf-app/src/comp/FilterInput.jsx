import React from 'react'

const FilterInput = React.createClass({
  propTypes: {
    handleInput: React.PropTypes.func
  },

  getInitialState () {
    return { searchTerm: '' }
  },

  render () {
    const handleInput = this.props.handleInput
    return (
      <div className='container'>
        <div className='input-group'>
          <span className='input-group-addon' id='filter-label'>Search</span>
          <input className='form-control' placeholder='Begin typing to filter results' type='text' aria-describedby='filter-label' onChange={(e) => handleInput(e)} />
        </div>
      </div>
    )
  }
})

export default FilterInput
