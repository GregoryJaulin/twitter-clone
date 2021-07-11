/*
https://stackoverflow.com/questions/20351959/how-to-keep-javascript-array-sorted-without-sorting-it

 - Added a 'reversed' parameter (default false) to permit binary search on reversed arrays.
    (Still need to be sorted, ascending or descending)
 - Added an optional 'property' parameter, allowing us to perform binary search on arrays of objects.
    (It slows down a little bit the process but we gain in modularity)

Note that if we provide property parameter, array need to be sorted by this property
*/
Array.prototype.binaryFind = function (searchElement, reversed, property) {
    'use strict';
    // We cannot use both 'use strict' and non-simple parameters
    if(!reversed) reversed = false 

    let minIndex = 0,
        maxIndex = this.length - 1,
        currentIndex,
        currentElement;

    while (minIndex <= maxIndex) {
        // Binary hack. Faster than Math.floor
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = property ? this[currentIndex][property] : this[currentIndex];

        if (currentElement < searchElement) reversed ? maxIndex = currentIndex - 1 : minIndex = currentIndex + 1
        else if (currentElement > searchElement) reversed ? minIndex = currentIndex + 1 : maxIndex = currentIndex - 1
        else return { found: true, index: currentIndex }
    }

    return { found: false, index: (currentElement < searchElement ? (reversed ? currentIndex - 1 : currentIndex + 1) : (reversed ? currentIndex + 1 : currentIndex)) || 0}
}

Array.prototype.addSorted = function(element, {reversed = false, property}) {
  let { found, index } = this.binaryFind(property ? element[property] : element, reversed, property);
  if (!found) this.splice(index, 0, element);
}

Array.prototype.upsertSorted = function(element, {reversed = false, property}) {
  let { found, index } = this.binaryFind(property ? element[property] : element, reversed, property);
  if (!found) this.splice(index, 0, element)
  // Spread operator is similar to Object.assign, but could sometimes be faster
  else this[index] = {...this[index], ...element}
}

Array.prototype.updateSorted = function(element, {reversed = false, property}) {
  let { found, index } = this.binaryFind(property ? element[property] : element, reversed, property);
  if (found) this[index] = {...this[index], ...element}
}