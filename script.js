socket = io.connect("http://34.73.72.105:9999");

socket.name = get("myNameIs") || "Anonim";
socket.emit("setName", socket.name);

socket.emit("getUsers");

socket.on('connect', function(){
	console.log("Connected (:");
	socket.on('listen', function(a){
		a.n == "users" ? rootContent.users = a.users : 1;
		a.n == "message" ? addMessage(a) : 1;
		// console.log(JSON.stringify(a, 2, 2));
	});
});

function set(a,b){
	localStorage.setItem(a,JSON.stringify(b));
}

function get(a){
	return JSON.parse(localStorage.getItem(a));
}

function focusBottom(id){
	$('#' + id).animate({
		scrollTop: document.getElementById(id).scrollHeight
	}, 300);
}

function addMessage(a){
	a.time = new Date(a.time) / 1000 | 0;
	db = get("db") || {};
	otherUser = socket.name != a.from ? a.from : a.to;
	if(db[otherUser] == undefined){
		db[otherUser] = [];
	}
	db[otherUser].push(a);
	set("db", db);
	rootContent.messages.push(a);
	if(rootContent.selectedUser != otherUser){
		status = rootContent.users[_.findIndex(rootContent.users, {"name": otherUser})].status;
		status = isNaN(status) ? 0 : status == undefined ? 0 : status;
		rootContent.users[_.findIndex(rootContent.users, {"name": otherUser})].status = ++status;
	}
	focusBottom("messages");
}

function generateMessage(username){
	a = {
		from: socket.name,
		to: rootContent.selectedUser,
		content: rootContent.newMessage,
		time: new Date() / 1000 | 0 + ""
	}
	addMessage(a);
	rootContent.newMessage = "";
	return a;
}

function selectUser(username){
	db = get("db") || {};
	rootContent.selectedUser = username;
	rootContent.messages = db[username] || [];
	rootContent.users[_.findIndex(rootContent.users, {"name": username})].status = 0;
	setTimeout(function(){
		$('.newMessage').focus();
		$('.newMessage').select();
		focusBottom("messages");
	}, 100);
}

rootContent = new Vue({
	el: "#rootContent",
	data: {
		messages: [],
		users: [],
		socket: socket,
		newMessage: "",
		selectedUser: "",
		myNameIs: socket.name
	},
	methods: {
		userClick: function(username){
			selectUser(username);
		},
		send: function(){
			socket.emit("send", generateMessage());
		},
		defineMyNameIs: function(){
			if(!(_.findIndex(this.users, {"name": this.myNameIs}) > -1)){
				set("myNameIs", this.myNameIs);
				socket.name = this.myNameIs;
				socket.emit("setName", socket.name);
			}else alert("İsim değiştirilemedi.");
		},
		getHi: function (a){
			//console.log(a);
			a *= 1;
			//console.log(a);
			return date("H:i", a);
		}
	}
});

$(document).ready(function(){
	setInterval(function(){
		$('.blink').css({"color": "#000"});
		setTimeout(function(){
			$('.blink').css({"color": "#f00"});
		}, 1e3);
	}, 2e3);
});
