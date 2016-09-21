import React from 'react';
import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';
import TablePreview from './table-preview'

export default class MetadataTabs extends React.Component{
  render() {
    return <Tabs defaultActiveKey={1} id="metadata-tab">
      <Tab eventKey={1} title="Table Preview"><TablePreview/></Tab>
      <Tab eventKey={2} title="Metadata">Here is Metadata</Tab>
      <Tab eventKey={3} title="Data Dictionary">Here is Data Dictionary</Tab>
    </Tabs>
  }
}


