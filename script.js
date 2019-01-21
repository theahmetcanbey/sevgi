root = new Vue({
	el: "#root",
	data: {
		selectedUser: "",
		allMessages: [],
		password: ""
	},
	watch:{
		allMessages: function(){
			root.nUpdate();
		}
	},
	computed: {
		users: {
			cache: false,
			get: function() {
				var from = _.keys(_.groupBy(root.allMessages, function(o){return o.from}));
				var to = _.keys(_.groupBy(root.allMessages, function(o){return o.to}));
				var merged = _.merge(from, to);
				return merged.sort() || [];
			}
		},
		messages: {
			cache: false,
			get: function() {
				return _.filter(root.allMessages, function(o) {
					return o.to == root.selectedUser || o.from == root.selectedUser;
				});
			}
		}
	},
	methods: {
		get: function(a){
			root.allMessages = [];
			var config = {
				apiKey: "U2FsdGVkX1+J9bg8LAqQngaMhzXNqy88odnuWIPZ/VMv3BqJj2FUAPWBN5kCfkBd1QWjA5yqJkdNz8x4IDyJzA==",
				authDomain: "U2FsdGVkX18Eabyut5AuMWc5urXXWEkK/hWesQpqVUW8gIPqOiDEvxicvzmhue42",
				databaseURL: "U2FsdGVkX1/YSncCv772D6JXYpqqR1PVObIxt5DxcCJLXyuA6LGmS8i7zwaIWcTC",
				projectId: "U2FsdGVkX1+Wzng8QbJtShWx8tljsf/tpQDFT8G8a1A=",
				storageBucket: "U2FsdGVkX1+Kdf+l9DRuh5Cs7x/eyb3ZUoiP0LUHUCUg87J+dkZyvXGMDrkK3C/p",
				messagingSenderId: "U2FsdGVkX1+IYhCI1MEUZWzwWfiMmK6oU14gXLzS2CQ=",
				identity: "U2FsdGVkX197B8HN4+80SMRr4H/Twgl23xoYsoBrUfM="
			};
			var temp = {};
			for(i in config){
				temp[i] = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(config[i], a));
			}
			config = temp;
			insert = function(id, data) {
				firebase.database().ref(id).set(data);
			}
			firebase.initializeApp(config);
			firebase.database().ref("nMessages").orderByChild("time").on("child_added", function(data) {
				root.allMessages.push(data.val());
			});
			root.selectedUser = config.identity;
			root.nUpdate();
		},
		repl: function(a){
			a = a.replace(/\[image\]/ig,"<img onclick=\"$(this).css('width', 350);\" src=\"https://ribony.com/photos/chat/").replace(/\[\/image\]/ig,"\" width=\"150\">");
			a = a.replace(/..\/images/ig,"http://ribony.com/images");
			return a;
		},
		nUpdate: function(){
			root.$forceUpdate();
		}
	}
});
