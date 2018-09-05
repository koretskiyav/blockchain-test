import React, { Fragment } from 'react'
import Link from 'next/link'
import Head from 'next/head';
import Inspector from 'react-object-inspector';

import api from '../api';
import { download } from '../utils';

export default class Depo extends React.Component {
  state = {
    unspent: null,
  };

  async componentDidMount() {
    const unspent = await api.unspent.list();
    this.setState({ unspent });
  }

  handleGenerate = () => {
    const tx = {
      inputs: this.state.unspent.map(u => ({
        index: u.tx_pos,
        rawTx: u.rawtx,
        height: u.height,
        txHash: u.tx_hash,
        amount: u.value,
      }))
    }

    download(tx, 'tx.json');
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
        {unspent ?
          <Fragment>
            <table>
              <thead>
                <tr>
                  <td><b>Addres</b></td>
                  <td><b>Balance</b></td>
                </tr>
              </thead>
              <tbody>
                <tr><td>.</td></tr>
                {unspent.map(i =>
                  <tr key={`${i.tx_hash}-${i.tx_pos}`}>
                    <td>{i.address}</td>
                    <td>{i.value / 10 ** 8}</td>
                  </tr>
                )}
                <tr><td>.</td></tr>
                <tr>
                  <td><b>Total</b></td>
                  <td><b>{unspent.reduce((acc, next) => acc + next.value, 0) / 10 ** 8}</b></td>
                </tr>
              </tbody>
            </table>
            <p>Details:</p>
            <Inspector data={unspent} name="unspent" initialExpandedPaths={['unspent']} />
            <br />
            <br />
            <button onClick={this.handleGenerate}>generate tx</button>
          </Fragment>
          : 'loading...'}
      </div>
    )
  }
}