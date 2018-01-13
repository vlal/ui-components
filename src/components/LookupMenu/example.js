import React from 'react';

import LookupMenu from '.';

const items = [
  {
    value: 'first-thing',
    label: 'First Thing'
  },
  {
    value: 'second-thing',
    label: 'Second Thing'
  },
  {
    value: 'third-thing',
    label: 'Super long thing, this should get truncated'
  }
];

export default class LookupMenuExample extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: items[0].value
    };
  }

  render() {
    const onChange = (ev, value) => this.props.clickHandler('onChange', value);
    return (
      <div style={{ maxWidth: 400 }}>
        <LookupMenu
          items={items}
          value={this.state.selected}
          onChange={onChange}
        />
      </div>
    );
  }
}
