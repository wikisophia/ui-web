
export default class Conclusion extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.props.onChange(ev.target.value);
  }

  render() {
    return <section className="conclusion">
      <input className="conclusion-entry" type="text" placeholder="Set conclusion here" onChange={this.handleChange} value={this.props.conclusion} />
    </section>;
  }
}