# What the simple List component does
-   Detailed : 

    the `List` component is a memoized copy of the component `SingleListItem` using Memo hook, and the latter gets an items property which is an array of objects of this shape `{text: 'some string'}`, and it will render a `SingleListItem` component for each item or object in the array, so before doing so its creating a state to save the seleted item's index and on each rerender it resets the selected index to null,
    and also there is a clickhander function defined inside it which will be passed in the props to the `SingleListItem` components so the child can update the state when clicked also the parent `List` component passes some other props to the children componenet like text and index and isSelected and also the key prop for rendreing purposes

-   Simple :

    the `List` get an array of objects wich are data to display and renders childrens `SingleListItem` components and pass them the data they need to display and also the click handler to update the state to know which list item is selected

# Warnings and Errors
-   syntax error that resulted in weird erros in the console that make no sense
which is :
`Calling PropTypes validators directly is not supported by the 'prop-types' package.
Use PropTypes.checkPropTypes() to call them.`

    In:
    ```
    WrappedListComponent.propTypes = {
            items: PropTypes.array(PropTypes.shapeOf({
            text: PropTypes.string.isRequired,
        })),
    };
    ```
    problem is in `array` and `shapeof` 

    The fix is to change them to : `arrayOf` and `shape`
---------------
-   TypeError when using setSelectedIndex to update state 
    
    ```const [setSelectedIndex, selectedIndex] = useState();```

    the naming in the desctructured array is reversed `setSelectedIndex` should be the second value in the array and `selectedIndex` the first

    when trying to update the state in useEffect

    ``` 
    useEffect(() => {
        setSelectedIndex(null);
    }, [items]);
    ```
    we get an error that is not a function

    also when passing the selected id here it passes actually the function which raises a proptype error since its expecting a boolean
    ```
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex}
        />
    ```
    Current fix is to reverse usestate namings
    ```
    const [selectedIndex, setSelectedIndex] = useState();
    ```
---------------

-   Each child should have a unique key
The fix is to add the key prop with a unique value i choose here the index
    ```
        {items.map((item, index) => (
            <SingleListItem
            onClickHandler={() => handleClick(index)}
            text={item.text}
            index={index}
            isSelected={selectedIndex}
            key={index}
            />
        ))}
        ```
---------------

-   Invalid prop type passing num instead of bool in `isSelected`
    ```
        {items.map((item, index) => (
            <SingleListItem
            onClickHandler={() => handleClick(index)}
            text={item.text}
            index={index}
            isSelected={selectedIndex}
            key={index}
            />
        ))}
    ```

    The Fix is

    ```isSelected={selectedIndex === index}```
---------------

-   Rendering problem warning in `WrappedSingleListItem` produced because of calling a function inside an onClick event instead of passing it a function reference or defining one using arrow functions 
    ```
    onClick={onClickHandler(index)}
    ```
    The fix is to not call the function and no need to pass the index its alredy in the function definition passed from the parent `WrappedListComponent`

# Other Updates and changes
-   Removed the index property from the `SingleListItem` component and from its proTypes because it's not used
-   Add an initial value in the state as null `const [selectedIndex, setSelectedIndex] = useState(null);`


# Updated Code Check:
## [List.js](./src/List.js)
```
import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

// Single List Item
const WrappedSingleListItem = ({
  isSelected,
  onClickHandler,
  text,
}) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? 'green' : 'red'}}
      onClick={onClickHandler}
    >
      {text}
    </li>
  );
};

WrappedSingleListItem.propTypes = {
  isSelected: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const SingleListItem = memo(WrappedSingleListItem);

// List Component
const WrappedListComponent = ({
  items,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [items]);

  const handleClick = index => {
    setSelectedIndex(index);
  };

  return (
    <ul style={{ textAlign: 'left' }}>
      {items.map((item, index) => (
        <SingleListItem
          onClickHandler={() => handleClick(index)}
          text={item.text}
          isSelected={selectedIndex === index}
          key={index}
        />
      ))}
    </ul>
  )
};

WrappedListComponent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
  })),
};

WrappedListComponent.defaultProps = {
  items: null,
};

const List = memo(WrappedListComponent);

export default List;
```
