import React from 'react'
import TopBar from './navigation/top-bar'
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import MetadataTabs from './metadata/metadata-tabs'
import Button from 'react-bootstrap/lib/Button'

export default class RepoPage extends React.Component {
  render() {
    return <Grid>
        <TopBar/>
        <Col lg={10} md={11}><MetadataTabs/></Col><Col lg={2} md={1}>
        <Button bsStyle="primary">Primary</Button></Col>
      </Grid>
  }
}
