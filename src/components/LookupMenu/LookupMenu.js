import React from 'react';
import styled from 'styled-components';
import { map, includes, lowerCase, filter } from 'lodash';

import Input from '../Input';

const List = styled.ul`
  list-style: none;
`;

const Item = styled.li``;

const Header = styled.div``;

const Styled = component => styled(component)`
  border: ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius};
`;

function filterItems(items, query) {
  if (!query) {
    return items;
  }

  const result = filter(items, i =>
    includes(lowerCase(i.label), lowerCase(query))
  );
  if (result.length === 0) {
    return [{ value: null, label: 'No items found' }];
  }
  return result;
}

// For keyboard navigation
function moveSoftSelect({ softSelectedIndex, items }, amt) {
  const next =
    typeof softSelectedIndex === 'number' ? softSelectedIndex + amt : 0;

  // Keep the index within the upper bound of the array
  if (next > items.length - 1) {
    return softSelectedIndex;
  }

  // lower bound of the array
  if (next < 0) {
    return 0;
  }

  return next;
}

/**
 * A searchable menu
 * ```javascript
 *  <LookupMenu items={items} value={this.state.selected} onChange={onChange}  />
 * ```
 */

export class LookupMenu extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      items: [],
      softSelectedIndex: null
    };

    this.filterItems = this.filterItems.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
  }

  componentDidMount() {
    this.filterItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.filterItems(nextProps);
  }

  filterItems({ items }, query) {
    this.setState({
      items: query ? filterItems(items, query) : items
    });
  }

  handleSearch(ev) {
    this.filterItems(this.props, ev.target.value);
  }

  handleChange(ev, value) {
    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  }

  handleKeyboardNavigation(ev) {
    switch (ev.key) {
      case 'ArrowDown':
        ev.preventDefault();
        this.setState(prevState => ({
          softSelectedIndex: moveSoftSelect(prevState, 1)
        }));
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.setState(prevState => ({
          softSelectedIndex: moveSoftSelect(prevState, -1)
        }));
        break;
      case 'Enter':
        ev.preventDefault();
        this.handleChange(
          ev,
          this.state.items[this.state.softSelectedIndex].value
        );
        break;
      case 'Escape':
        this.handleToggle();
        break;
      default:
    }
  }

  render() {
    const { className } = this.props;
    const { items, softSelectedIndex } = this.state;

    return (
      <div className={className}>
        <Header>
          <Input
            onChange={this.handleSearch}
            onClick={e => e.stopPropagation()}
            onKeyDown={this.handleKeyboardNavigation}
          />
        </Header>
        <List>
          {map(items, (item, index) => (
            <Item
              onClick={e => this.handleChange(e, item.value)}
              key={item.value}
              softSelected={index === softSelectedIndex}
            >
              {item.label}
            </Item>
          ))}
        </List>
      </div>
    );
  }
}

export default Styled(LookupMenu);
