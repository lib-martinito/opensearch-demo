const Resources = (props) => {
    const { fullResources } = props
    return (
        <>
            {Object.keys(fullResources).length !== 0 && fullResources.resources.map(resource =>
                <div key={resource.id} className='block card'>
                    <div className='card-content'>
                        <div>id: {resource.id}</div>
                        <div>name: {resource.name}</div>
                        <div>subjects: {resource.subjects?.join(',')}</div>
                        <div>curriculums: {resource.curriculums?.join(',')}</div>
                        <div>year levels: {resource.year_levels?.join(',')}</div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Resources
