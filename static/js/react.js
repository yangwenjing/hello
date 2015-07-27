// slide
var Slide = React.createClass({displayName: "Slide",
    render: function() {
    }
});


// 进度条
var Progress = React.createClass({displayName: "Progress",
    render: function() {
        var arr = this.props.obj.split('#');
        var data = JSON.parse(arr[1])
        var percent;
        var period = Date.now() - data.update_t;
        var barColor;
        var info;

        if (period > 60 * 60 * 1000) {
            percent = '100%';
            barColor = 'progress-bar-success progress-bar';
        } else if (period > 15 * 60 * 1000) {
            percent = (period - 15 * 60 * 1000) / (45 * 60 * 10) + '%';
            barColor = 'progress-bar-warning progress-bar progress-bar-striped active';
        } else {
            percent = period / (15 * 60 * 10) + '%';
            barColor = 'progress-bar-danger progress-bar progress-bar-striped active';
        }

        if (data.user === '') {
            percent = '100%';
            barColor = 'progress-bar-success progress-bar';
            info = '闲置' + parseInt(period / 1000 / 60) + 'min';
        } else {
            info = data.user + ' : ' + parseInt(period / 1000 / 60) + 'min';
        }

        return (
            React.createElement("div", {className: "progress"}, 
                React.createElement("div", {className: barColor, 
                    type: "button", 
                    title: info, 
                    style: {width: percent}}, 
                    arr[0].toUpperCase()
                )
            )
        );
    }
});

// 右侧状态
var Status = React.createClass({displayName: "Status",
    loadFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
        type: 'POST',
        success: function(data) {
             this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, error) {
                console.error(this.props.url, status, error.toString())
        }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadFromServer();
        setInterval(this.loadFromServer, this.props.pollInterval);
    },
    render: function() {
        var objects = this.state.data;
        var arr = [];
        for (var key in objects) {
            arr.push(key + '#' + objects[key]);
        }
        var Progresses = arr.map(function(object, index) {
            return React.createElement(Progress, {obj: object, key: index});
        })
        return (
            React.createElement("div", null, 
                React.createElement("h4", null, "status:"), 
                Progresses, 
                React.createElement("h4", null, "info: "), 
                React.createElement("ol", null, 
                    React.createElement("li", null, "15分钟内，独占，红色走动条"), 
                    React.createElement("li", null, "1小时后，自动取消，绿色静止条"), 
                    React.createElement("li", null, "其间，黄色走动条，可抢占")
                )
            )
        );
    }
});

React.render(
React.createElement(Status, {url: "status", pollInterval: 3000}),
    document.getElementById('status')
);

// 联调ip port表单
var Form = React.createClass({displayName: "Form",
    handleSubmit: function(e) {
        e.preventDefault();
        var type = React.findDOMNode(this.refs.type).value.trim();
        var ip   = React.findDOMNode(this.refs.ip).value.trim();
        var port = React.findDOMNode(this.refs.port).value.trim();
        var user = localStorage.getItem('user');
        if (ip && port && type && user) {
        // 判断时间，用户
            $.ajax({
                url: 'changeConn',
                type: 'POST',
                data: $.param({type: type, ip: ip, port: port, user: user}),
                success: function(data) {
                    console.log(data);
                }
            });
        }
        console.log(user);
        React.render(
            React.createElement("div", null),
            document.getElementById('operate')
        );
    },
    render: function() {
        return (
            React.createElement("form", {onSubmit: this.handleSubmit, className: "form-inline"}, 
                React.createElement("h3", null, this.props.module), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", type: "hidden", 
                        value: this.props.module, ref: "type"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {htmlFor: "form_ip"}, "IP"), 
                    React.createElement("input", {className: "form-control", type: "text", id: "form_ip", 
                        placeholder: "ip", ref: "ip"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {htmlFor: "form_port"}, "PORT"), 
                    React.createElement("input", {className: "form-control", type: "text", 
                        id: "form_port", placeholder: "port", ref: "port"})
                ), 
                React.createElement("button", {type: "submit", className: "btn btn-default"}, "开始接入")
            )
        );
    }
});

// 设置用户email
var Email = React.createClass({displayName: "Email",
    handleSubmit: function(e) {
        e.preventDefault();
        var email = React.findDOMNode(this.refs.email).value.trim();
        localStorage.setItem('user', email);
        var i = (this.props.index);
        var modules = ['=', 'VUI', 'AS', 'HY'];
        if (modules[i] === '=') {
            React.render(
                React.createElement("div", null),
                document.getElementById('operate')
            );
        } else {
            React.render(
                React.createElement(Form, {module: modules[i]}),
                document.getElementById('operate')
            );
        }
    },
    render: function() {
        return (
            React.createElement("form", {onSubmit: this.handleSubmit, className: "form-inline"}, 
                React.createElement("h3", null, "请输入邮箱"), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {htmlFor: "form_email"}, "邮箱前缀"), 
                    React.createElement("input", {className: "form-control", type: "text", id: "form_email", 
                        placeholder: "email", ref: "email"})
                ), 
                React.createElement("button", {type: "submit", className: "btn btn-default"}, "确定")
            )
        )
    }
});

// 设置as_stub桩数据的表单
var Stubform= React.createClass({displayName: "Stubform",
    handleSubmit: function(e) {
        e.preventDefault();
        var stub_id = React.findDOMNode(this.refs.stub_id).value.trim();
        if (stub_id) {
            $.ajax({
                url: 'setStub',
                type: 'POST',
                data: $.param({id: stub_id}),
                success: function(data) {
                    console.log(data);
                }
            });
        }
        React.findDOMNode(this.refs.stub_id).value = '';
    },
    render: function() {
        return (
            React.createElement("form", {className: "form-inline stubform", onSubmit: this.handleSubmit}, 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {type: "text", className: "form-control col-sm-2", 
                        placeholder: "id", ref: "stub_id"})
                ), 
                React.createElement("button", {type: "submit", className: "btn btn-default"}, "提交")
            )
        );
    }
});


// 导航栏
var Nav = React.createClass({displayName: "Nav",
    handleClick: function(i) {
        if (!localStorage.user) {
            React.render(
                React.createElement(Email, {index: i}),
                document.getElementById('operate')
            );
        } else {
            var modules = ['=', 'VUI', 'AS', 'HY'];
            if (modules[i] === '=') {
                React.render(
                    React.createElement("div", null),
                    document.getElementById('operate')
                );
            } else {
                React.render(
                    React.createElement(Form, {module: modules[i]}),
                    document.getElementById('operate')
                );
            }
        }
    },
    render: function() {
        var modules = ['=', 'VUI', 'AS', 'HY'];
        var modules = modules.map(function(module, index) {
            return (
                React.createElement("span", {onClick: this.handleClick.bind(this, index)}, module)
            );
        }, this);
        return (
            React.createElement("nav", null, 
                modules, 
                React.createElement(Stubform, null)
            )
        );
    }
});

//nav
React.render(
    React.createElement(Nav, null),
    document.getElementById('nav')
);

//footer
React.render(
    React.createElement("p", null, "使用css3和html5一些标签属性，不考虑兼容性，请使用chrome浏览器..."),
    document.getElementById('footer')
);

