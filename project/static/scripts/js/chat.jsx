const Message = ({chat, user}) => (
	<div>
		<p className="um">{`${user === chat.username ? "":chat.username}`}</p>
		
		<li className={`chat ${user === chat.username ? "right" : "left"}`}>
			{user !== chat.username
			}
			{chat.content}
		</li>
	</div>
);
class Chatroom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {chats:[]};
		this.submitMessage = this.submitMessage.bind(this);
		this._handleNewMessage = this._handleNewMessage.bind(this);
	}
	getInitialState() {
		return {chats:[]};
	}
	_handleNewMessage(m, sender) {
		if (sender != username) {
			this.setState({
				chats: this.state.chats.concat([{
					username: sender,
					content: <p>{m}</p>
				}])
			}, () => {
				ReactDOM.findDOMNode(this.refs.msg).value = "";
			});
		}
	}
	componentDidMount() {
		socket.on('new message', this._handleNewMessage);
		this.scrollToBot();
	}

	componentDidUpdate() {
		this.scrollToBot();
	}

	scrollToBot() {
		ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
	}

	submitMessage(e) {
		e.preventDefault();
		socket.emit('new message', {"username":username, "room":lobbycode, "message":ReactDOM.findDOMNode(this.refs.msg).value});
		this.setState({
			chats: this.state.chats.concat([{
				username: "username",
				content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>
			}])
		}, () => {
			ReactDOM.findDOMNode(this.refs.msg).value = "";
		});
	}
	
	
	
	render() {
		const username = "username";
		const { chats } = this.state;
		return (
			<div className="chatroom">
				<h3>Squircle</h3>
				<ul className="chats" ref="chats">
					{
						chats.map((chat) => 
							<Message chat={chat} user={username} />
						)
					}
				</ul>
				<form className="input" onSubmit={(e) => this.submitMessage(e)}>
					<input type="text" ref="msg" />
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}
	
ReactDOM.render(
	<Chatroom />,
	document.getElementById('Chat')
);