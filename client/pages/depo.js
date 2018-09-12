import React, { Component } from 'react';
import Link from 'next/link';
import Inspector from 'react-object-inspector';

import api from '../api';

export default class Depo extends Component {
  state = {
    depos: null,
  };

  async componentDidMount() {
    const depos = await api.depo.list();
    this.setState({ depos });
  }

  handleAdd = async () => {
    const depo = await api.depo.create();
    this.setState(({ depos }) => ({ depos: [...depos, depo] }));
  };

  render() {
    const { depos } = this.state;
    return (
      <div>
        <Link href="/">Home</Link>
        <br />
        <Link href="/unspent">Unspent</Link>
        <br />
        <br />
        Deposits:
        <br />
        <br />
        {depos ? (
          <Inspector
            data={depos}
            name="depos"
            initialExpandedPaths={['depos']}
          />
        ) : (
          'loading...'
        )}
        <br />
        <br />
        <button type="button" onClick={this.handleAdd}>
          generate new address
        </button>
      </div>
    );
  }
}
