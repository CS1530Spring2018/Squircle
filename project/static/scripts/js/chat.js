const Message = ({chat, user}) => (
	<li className={`chat ${user === chat.username ? "right" : "left"}`}>
		{user !== chat.username
			&& <img src={chat.img} alt={`${chat.username}'s profile pic`} />
		}
		{chat.content}
	</li>
);

class Chatroom extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			chats: [//{
				// username: "username",
				// content: <p>usernameusernames</p>,
				// img: "http://i.imgur.com/Tj5DGiO.jpg", // 
			// }, {
				// username: "user1",
				// content: <p>user1</p>,
				// img: "http://i.imgur.com/Tj5DGiO.jpg",
			// }, {
				// username: "user2",
				// content: <p>user2</p>,
				// img: "http://i.imgur.com/Tj5DGiO.jpg",
			// }, {
				// username: "user3",
				// content: <p>user3</p>,
				// img: "http://i.imgur.com/ARbQZix.jpg",
			//}
			]
		};

		this.submitMessage = this.submitMessage.bind(this);
	}

	componentDidMount() {
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

		this.setState({
			chats: this.state.chats.concat([{
				username: "username",
				content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
				//img: "http://i.imgur.com/Tj5DGiO.jpg",
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