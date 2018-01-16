import React from 'react';
import styled from 'styled-components';
import { map, includes, lowerCase, filter } from 'lodash';

import Input from '../Input';

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  overflow-y: auto;
`;

const Item = styled.li`
  padding: 8px 16px;
  line-height: 36px;
  height: 36px;
  border-bottom: 1px solid ${props => props.theme.colors.neutral.lightgray};
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: ${props => props.theme.border};

  ${Input} {
    width: 100%;
    padding: 0;
    overflow: hidden;

    & > div {
      margin: 4px;
    }

    & > span {
      display: none;
    }
  }
`;

const Styled = component => styled(component)`
  border: ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.white};

  overflow: hidden;
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

class LookupMenu extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      items: [],
      query: '',
      softSelectedIndex: null
    };

    this.filterItems = this.filterItems.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.filterItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.filterItems(nextProps, this.state.query);

    // `props.children` should be a function or undefined.
    // Warn the user that they probably aren't using the component correctly.
    if (nextProps.children && typeof nextProps.children !== 'function') {
      console.warn(
        '<LookupMenu /> children should be a function or undefined. Using the `items` prop instead'
      );
    }
  }

  filterItems({ items }, query) {
    this.setState({
      items: query ? filterItems(items, query) : items
    });
  }

  handleSearch(ev) {
    this.setState({ query: ev.target.value });
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

  useChildRender() {
    const collection = map(this.state.items, item => ({
      ...item,
      onClick: e => this.handleChange(e, item.value)
    }));
    return this.props.children(collection, Item);
  }

  renderList() {
    const { items, softSelectedIndex } = this.state;

    return map(items, (item, index) => (
      <Item
        onClick={e => this.handleChange(e, item.value)}
        key={item.value}
        softSelected={index === softSelectedIndex}
      >
        {item.label}
      </Item>
    ));
  }

  render() {
    const { className, children } = this.props;

    return (
      <div className={className}>
        <Header>
          <Input
            placeholder="Search"
            onChange={this.handleSearch}
            onKeyDown={this.handleKeyboardNavigation}
            message="Search"
          />
        </Header>
        <List>
          {children && typeof children === 'function'
            ? this.useChildRender()
            : this.renderList()}
        </List>
      </div>
    );
  }
}

export default Styled(LookupMenu);
