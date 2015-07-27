// slide
var Slide = React.createClass({
    render: function() {
    }
});


// 进度条
var Progress = React.createClass({
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
            <div className='progress'>
                <div className={barColor}
                    type='button'
                    title={info}
                    style={{width: percent}}>
                    {arr[0].toUpperCase()}
                </div>
            </div>
        );
    }
});

// 右侧状态
var Status = React.createClass({
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
            return <Progress obj={object} key={index} />;
        })
        return (
            <div>
                <h4>status:</h4>
                {Progresses}
                <h4>info: </h4>
                <ol>
                    <li>15分钟内，独占，红色走动条</li>
                    <li>1小时后，自动取消，绿色静止条</li>
                    <li>其间，黄色走动条，可抢占</li>
                </ol>
            </div>
        );
    }
});

React.render(
<Status url='status' pollInterval={3000}/>,
    document.getElementById('status')
);

// 联调ip port表单
var Form = React.createClass({
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
            <div></div>,
            document.getElementById('operate')
        );
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit} className='form-inline'>
                <h3>{this.props.module}</h3>
                <div className='form-group'>
                    <input className='form-control' type='hidden'
                        value={this.props.module} ref='type' />
                </div>
                <div className='form-group'>
                    <label htmlFor='form_ip'>IP</label>
                    <input className='form-control' type='text' id='form_ip'
                        placeholder='ip' ref='ip' />
                </div>
                <div className='form-group'>
                    <label htmlFor='form_port'>PORT</label>
                    <input className='form-control' type='text'
                        id='form_port' placeholder='port' ref='port' />
                </div>
                <button type="submit" className='btn btn-default'>开始接入</button>
            </form>
        );
    }
});

// 设置用户email
var Email = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var email = React.findDOMNode(this.refs.email).value.trim();
        localStorage.setItem('user', email);
        var i = (this.props.index);
        var modules = ['=', 'VUI', 'AS', 'HY'];
        if (modules[i] === '=') {
            React.render(
                <div></div>,
                document.getElementById('operate')
            );
        } else {
            React.render(
                <Form module={modules[i]}/>,
                document.getElementById('operate')
            );
        }
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit} className='form-inline'>
                <h3>请输入邮箱</h3>
                <div className='form-group'>
                    <label htmlFor='form_email'>邮箱前缀</label>
                    <input className='form-control' type='text' id='form_email'
                        placeholder='email' ref='email' />
                </div>
                <button type="submit" className='btn btn-default'>确定</button>
            </form>
        )
    }
});

// 设置as_stub桩数据的表单
var Stubform= React.createClass({
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
            <form className='form-inline stubform' onSubmit={this.handleSubmit}>
                <div className='form-group'>
                    <input type='text' className='form-control col-sm-2'
                        placeholder='id' ref='stub_id'/>
                </div>
                <button type='submit' className='btn btn-default'>提交</button>
            </form>
        );
    }
});


// 导航栏
var Nav = React.createClass({
    handleClick: function(i) {
        if (!localStorage.user) {
            React.render(
                <Email index={i}/>,
                document.getElementById('operate')
            );
        } else {
            var modules = ['=', 'VUI', 'AS', 'HY'];
            if (modules[i] === '=') {
                React.render(
                    <div></div>,
                    document.getElementById('operate')
                );
            } else {
                React.render(
                    <Form module={modules[i]}/>,
                    document.getElementById('operate')
                );
            }
        }
    },
    render: function() {
        var modules = ['=', 'VUI', 'AS', 'HY'];
        var modules = modules.map(function(module, index) {
            return (
                <span onClick={this.handleClick.bind(this, index)}>{module}</span>
            );
        }, this);
        return (
            <nav>
                {modules}
                <Stubform />
            </nav>
        );
    }
});

//nav
React.render(
    <Nav />,
    document.getElementById('nav')
);

//footer
React.render(
    <p>使用css3和html5一些标签属性，不考虑兼容性，请使用chrome浏览器...</p>,
    document.getElementById('footer')
);

