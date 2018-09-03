import React from 'react'
import Link from 'next/link'
import Head from 'next/head';
import Inspector from 'react-object-inspector';

import api from '../api';

export default class Depo extends React.Component {
  state = {
    unspent: null,
  };

  async componentDidMount() {
    const unspent = await api.unspent.list();
    this.setState({ unspent });
  }

  render () {
    const { unspent } = this.state;
    return (
      <div>
        <Link href="/"><a>Home</a></Link>
        <br />
        <Link href="/depo"><a>Depo</a></Link>
        <br />
        <br />
        Unspent:
        <br />
        <br />
        {unspent ? <Inspector data={unspent} name="unspent" initialExpandedPaths={['unspent']} /> : 'loading...'}
      </div>
    )
  }
}