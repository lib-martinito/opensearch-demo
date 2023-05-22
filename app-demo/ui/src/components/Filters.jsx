import { useState } from "react"

const FilterItem = (props) => {
    const [isSelected,setIsSelected] = useState(false)
    
    const { filter, groupName, handleUserFilterChange } = props

    const handleClick = () => {
        setIsSelected(!isSelected)
        handleUserFilterChange(filter, groupName)
    }

    return (
        <p
            className='dropdown-item'
            style={{cursor: 'pointer'}}
            onClick={handleClick}
        >
            {filter}
            <span className={`icon ${isSelected ? '' : 'is-hidden'}`}>
                <i className='fa-solid fa-check'></i>
            </span>
        </p>
    )
}

const Filter = (props) => {
    const [isVisible, setIsVisible] = useState(false)
    const { filterGroup, handleUserFilterChange } = props

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    return (
        <div className='dropdown is-active mr-4' key={filterGroup.name}>
            <div className='dropdown-trigger'>
                <button className='button' onClick={toggleVisibility}>
                    <span>{filterGroup.name}</span>
                    <span className='icon'>
                        <i className='fa-solid fa-chevron-down fa-sm'></i>
                    </span>
                </button>
            </div>
            <div className={`dropdown-menu ${isVisible ? '' : 'is-hidden'}`} id='dropdown-menu' role='menu'>
                <div className='dropdown-content'>
                    {filterGroup.filters.length !== 0 && filterGroup.filters.map(filter =>
                        <FilterItem 
                            key={filter} 
                            groupName={filterGroup.name}
                            filter={filter} 
                            handleUserFilterChange={handleUserFilterChange}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

const Filters = (props) => {
    const { filterGroups, handleUserFilterChange } = props

    return (
        <div>
            {filterGroups.length !== 0 && filterGroups.map(filterGroup =>
                <Filter 
                    key={filterGroup.name} 
                    filterGroup={filterGroup} 
                    handleUserFilterChange={handleUserFilterChange}
                />
            )}
        </div>
    )
}

export default Filters
