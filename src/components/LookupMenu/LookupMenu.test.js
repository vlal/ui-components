import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-styled-components';

import { withTheme } from '../../utils/theme';

import { LookupMenu } from './LookupMenu';
import Input from '../Input';

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

describe('<LookupMenu />', () => {
  it('renders a list of items', () => {
    const menu = mount(withTheme(<LookupMenu items={items} />));
    expect(menu.find('ul').children().length).toEqual(items.length);
  });
  it('filters a list of items', () => {
    const menu = mount(withTheme(<LookupMenu items={items} />));
    menu.find('input').simulate('change', { target: { value: 'second' } });
    expect(menu.find('ul').children().length).toEqual(1);
  });
  it('selects an item', () => {
    const spy = jest.fn();
    const menu = mount(withTheme(<LookupMenu items={items} onChange={spy} />));
    menu
      .find('ul')
      .children()
      .at(1)
      .simulate('click');
    expect(spy.mock.calls[0][1]).toBe(items[1].value);
  });
  it('soft-selects an item', () => {
    const ev = { key: 'ArrowDown', preventDefault: () => {} };
    const menu = shallow(<LookupMenu items={items} />);
    const input = menu.find(Input);

    input.simulate('keyDown', ev);
    expect(menu.state('softSelectedIndex')).toEqual(0);

    input.simulate('keyDown', ev);
    expect(menu.state('softSelectedIndex')).toEqual(1);

    input.simulate('keyDown', ev);
    expect(menu.state('softSelectedIndex')).toEqual(2);
  });
  it('does not soft-select out of its range', () => {
    const ev = { key: 'ArrowDown', preventDefault: () => {} };

    let menu = shallow(<LookupMenu items={items} />);
    let input = menu.find(Input);
    // 4 key downs, only 3 elements; stay at the last element
    input.simulate('keyDown', ev);
    input.simulate('keyDown', ev);
    input.simulate('keyDown', ev);
    input.simulate('keyDown', ev);
    expect(menu.state('softSelectedIndex')).toEqual(2);

    // Don't move lower than 0 in the list
    menu = shallow(<LookupMenu items={items} />);
    input = menu.find(Input);
    input.simulate('keyDown', { ...ev, key: 'ArrowUp' });
    expect(menu.state('softSelectedIndex')).toEqual(0);
  });
});
