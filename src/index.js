/** @jsx createVirtualNode */
function createVirtualNode(type, props, ...children) {
    return { type, props: props || {}, children };
}
//TODO change structure code

function createElement(node) {
   if (typeof node === 'string') {
       return document.createTextNode(node);
   }

   const $element = document.createElement(node.type);

   setPropertys($element, node.props);
   addEventListeners($element, node.props);
   node.children.map(createElement)
                .forEach($element.appendChild.bind($element));

   return $element;
}

function updateElement(parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
      parent.appendChild(createElement(newNode));
    }
    else if (!newNode) {
      parent.removeChild(parent.childNodes[index]);
    }
    else if (isChanged(newNode, oldNode)) {
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
    else if (newNode.type) {
      updatePropertys(parent.childNodes[index], newNode.props, oldNode.props);

      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;

      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
      }
    }
}

function isChanged(node1, node2) {
    return typeof node1 !== typeof node2
        || typeof node1 === 'string' && node1 !== node2
        || node1.type !== node2.type
        || node1.props && node1.props.forceUpdate;
}

function setProperty(target, name, value) {
    if (isCustomProperty(name)){
        return;
    }
    else if (name === 'classname') {
        target.setAttribute('class', value);
    }
    else if (typeof value === 'boolean') {
        setBooleanProperty(target, name, value);
    }
    else {
        target.setAttribute(name, value);
    }
}

function removeProperty(target, name, value) {
  if (isCustomProperty(name)){
      return;
  }
  else if (name === 'classname') {
      target.removeAttribute('class', value);
  }
  else if (typeof value === 'boolean') {
      removeBooleanProperty(target, name, value);
  }
  else {
      target.removeAttribute(name, value);
  }
}

function setPropertys(target, props) {
    Object.keys(props).forEach(name => {
       setProperty(target, name, props[name]);
    })
}

function updateProperty(target, name, newValue, oldValue) {
  if(!newValue) {
    removeProperty(target, name, oldValue);
  }
  else if (!oldValue || newValue !== oldValue) {
    setProperty(target, name, newValue);
  }
}

function updatePropertys(target, newProps, oldProps = {}) {
  const props = Object.assign({}, newProps, oldProps);

  Object.keys(props).forEach(name => {
    updateProperty(target, name, newProps[name], oldProps[name]);
  })
}

function setBooleanProperty(target, name, value) {
   if (value) {
      target.setAttribute(name, value);
      target[name] = true;
   }
   else {
      target[name] = false;
   }
}

function removeBooleanProperty(target, name) {
   target.removeAttribute(name);
   target[name] = false;
}

function isCustomProperty (name) {
   return isEventProps(name) || name === 'forceUpdate';
}

function isEventProps (name) {
    return /^on/.test(name);
}

function extractEventName (name) {
    return name.slice(2).toLowerCase();
}

function addEventListeners(target, props) {
    Object.keys(props).forEach(name => {
        if (isEventProps(name)) {
            target.addEventListener(extractEventName(name), props[name]);
        }
    });
}

const dom1 = (
    <ul style="list-style: none;">
        <li className="item">item 1</li>
        <li className="item">
          <input type="checkbox" checked={true} />
          <input type="text" disabled={false} />
        </li>
    </ul>
);

const dom2 = (
    <ul style="list-style: none;">
        <li className="item item2">item 1</li>
        <li style="background: grey;">
          <input type="checkbox" checked={false} />
          <input type="text" disabled={true} />
        </li>
    </ul>
);
const $root = document.getElementById('root');
//$root.appendChild(createElement(dom1));
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
  updateElement($root, dom2, dom1);
});
