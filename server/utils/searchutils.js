function edgeNGrams(data, min = 2, separator = ' ') {
    function generateEdgeNGrams(str, min, separator) {
        if(!str) return ''
        if(str.length <= min) return str.trim()
    
        return str.split(separator)
            .filter(value => value.length >= min)
            .reduce((acc, value) => {
                if (value.length > min) {
                    for (let i = min; i <= value.length; i++) {
                        acc = [...acc, value.substr(0, i)]
                    }
                } else acc = [...acc, value]
    
                return acc
            }, []).join('||')
    }

    return generateEdgeNGrams(data, min, separator)
}

module.exports = {
    edgeNGrams
}