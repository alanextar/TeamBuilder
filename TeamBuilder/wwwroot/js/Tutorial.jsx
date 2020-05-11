class Toggle extends React.Component {
    state = {
        show: false,
    }

    toggle = () => this.setState((currentState) => ({ show: !currentState.show }));

    render() {
        const imgStyle = {
            width: '300',
        };

        return (
            <div className="wrapper">
                <div>
                    <button onClick={this.toggle} className="btn-success btn-pineapple">
                        {this.state.show ? 'Скрыть шишку' : 'Показать шишку'}
                    </button>
                </div>
                {this.state.show && <div><img src="/img/pineapple.png" style={imgStyle} /> </div>}
            </div>
        );
    }
}

ReactDOM.render(<Toggle />, document.getElementById('app'));