
export default class Conclusion extends React.Component {
  render() {
    return <section className="conclusion">
      <input className="conclusion-entry" type="text" placeholder="Set conclusion here" value={this.props.conclusion} />
    </section>;
  }
}