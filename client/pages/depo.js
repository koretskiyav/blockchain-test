import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Inspector from 'react-object-inspector';

import api from '../api';

export default class Depo extends React.Component {
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
  }

  render () {
    const { depos } = this.state;
    return (
      <div>
        <Link href="/"><a>Home</a></Link>
        <br />
        <Link href="/unspent"><a>Unspent</a></Link>
        <br />
        <br />
        Deposits:
        <br />
        <br />
        {depos ? <Inspector data={depos} name="depos" initialExpandedPaths={['depos']} /> : 'loading...'}
        <br />
        <br />
        <button onClick={this.handleAdd}>generate new address</button>
      </div>
    )
  }
}