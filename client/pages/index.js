import React, { Component } from 'react';
import Link from 'next/link';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Link href="/depo">Depo</Link>
        <br />
        <Link href="/unspent">Unspent</Link>
        <br />
        <br />
        Home page
      </div>
    );
  }
}
