$(function () {
    $(".datepicker").datepicker({
        autoclose: true
    });

    $('input[type="checkbox"], input[type="radio"]').iCheck({
        checkboxClass: "icheckbox_minimal-green",
        radioClass: "iradio_minimal-green"
    });

    $("#datemask").inputmask("dd/mm/yyyy", { "placeholder": "dd/mm/yyyy" });
    $("#datemask2").inputmask("mm/dd/yyyy", { "placeholder": "mm/dd/yyyy" });
    $("[data-mask]").inputmask();

    let scatter = null;
    let eos = null;
    let account = null;
    let accountname = '';
    var code = 'chinesegamer';
    var table = 'account';
    var mainnet = "https://api.eoslaomao.com";
    var mainnetport = '443';
    var protocol = 'https';
    var mainnetlist = {
        'starteosiobp': { name: 'startEOS', link: 'api-mainnet.starteos.io', port: 80, protocol: 'http' },
        'zbeosbp11111': { name: 'ZB EOS', link: 'node1.zbeos.com', port: 443, protocol: 'https' },
        'eoslaomaocom': { name: 'EOS LaoMao', link: 'api.eoslaomao.com', port: 443, protocol: 'https' },
        'eosnewyorkio': { name: 'EOS New York', link: 'api.eosnewyork.io', port: 80, protocol: 'http' },
        //'bitfinexeos1': { name: 'BITFINEXEOS1', link: 'eos-bp.bitfinex.com', port: 9876, protocol: 'http' },
        //'eosiosg11111': { name: 'EOSIO.SG', link: 'mainnet.eosio.sg', port: 443, protocol: 'https' },
        'eosswedenorg': { name: 'Sw/eden', link: 'api.eossweden.se', port: 443, protocol: 'https' },
        'jedaaaaaaaaa': { name: 'JEDA', link: 'api.jeda.one', port: 443, protocol: 'https' }
        
    };
    detectScatterExtension("", function (sign) {
        if (!sign)
            $('#errorModal').modal('show');
    });
    //var nodeurl;
    if (Cookies.get('supernode') != null) {
        $('#supernodelist').val(Cookies.get('supernode'));

    }
    else {
        $('#supernodelist').val('eoslaomaocom');
    }
    console.log($('#supernodelist').val());
    
    var nodeurl = mainnetlist[$('#supernodelist').val()].protocol + '://' + mainnetlist[$('#supernodelist').val()].link + ':' +  mainnetlist[$('#supernodelist').val()].port;
    
    const localNet = Eos({ httpEndpoint: nodeurl, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' });
    const eosNetwork = {
        blockchain: 'eos',
        host: mainnetlist[$('#supernodelist').val()].link,//'127.0.0.1', // ( or null if endorsed chainId )
        port: mainnetlist[$('#supernodelist').val()].port, // ( or null if defaulting to 80 )
        protocol: mainnetlist[$('#supernodelist').val()].protocol,
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    }

    $('#delegate').on('click', function () {
        var $btn = $(this).button('loading');
        var creator = $("#stacksend").val();
        var receiveree = $("#stackreceiv").val();
        var cpu = changeDecimalBuZero($("#stackcpu").val(), 4) + ' EOS';
        var net = changeDecimalBuZero($("#stacknet").val(), 4) + ' EOS';
        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            const amount = "0.0001 EOS";
            eos.transaction(
                tr => {
                    tr.delegatebw({
                        from: creator,
                        receiver: receiveree,
                        stake_net_quantity: net,
                        stake_cpu_quantity: cpu,
                        transfer: 0
                    })
                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $('#SuccessModal').modal('show');
                    $btn.button('reset');

                }).catch(
                    e => {
                        console.log("error", e);
                        $btn.button('reset');
                        $('#FailModal').modal('show');
                    })
        })
    });

    $("#supernodelist").change(function () {
        // this.val();
        Cookies.set('supernode', $(this).val(), { expires: 7 });
        window.location.reload();
    });

    $('#undelegate').on('click', function () {
        var $btn = $(this).button('loading');

        var creator = $("#stakeowner").val();
        var receiveree = $("#stakeholder").val();
        var cpu = changeDecimalBuZero($("#cpuclaim").val(), 4) + ' EOS';
        var net = changeDecimalBuZero($("#netclaim").val(), 4) + ' EOS';


        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction(
                tr => {
                    tr.undelegatebw({
                        from: creator,
                        receiver: receiveree,
                        unstake_net_quantity: net,
                        unstake_cpu_quantity: cpu
                    })
                    // business logic...

                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log("error", e);
                        $btn.button('reset');
                        $('#FailModal').modal('show');
                    })
        })
    });

    $('#buyram').on('click', function () {
        var $btn = $(this).button('loading');

        var creator = $("#rambuyer").val();
        var receiveree = $("#ramuser").val();
        var ram = $("#buyingram").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction(
                tr => {
                    tr.buyrambytes({
                        payer: creator,
                        receiver: receiveree,
                        bytes: parseInt(ram)
                    })
                    // business logic...

                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log("error", e);
                        $btn.button('reset');
                        $('#FailModal').modal('show');
                    })
        })
    });

    $('#transfer').on('click', function () {
        var $btn = $(this).button('loading');

        var amount = $("#transferamount").val();
        var transto = $("#transferto").val();
        var memo = $("#tag").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            };
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            };
            eos.transaction(
                tr => {
                    tr.transfer({
                        from: account.name,
                        to: transto,
                        quantity: changeDecimalBuZero(amount, 4) + ' EOS',
                        memo: memo
                    });
                    // business logic...

                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log("error", e);
                        $btn.button('reset');
                        $('#FailModal').modal('show');
                    });
        });
    });

    $('#sellram').on('click', function () {
        var $btn = $(this).button('loading');

        var creator = $("#ramseller").val();
        var ram = $("#ramtosell").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction(
                tr => {
                    tr.sellram({
                        account: creator,
                        bytes: parseInt(ram)
                    })
                    // business logic...

                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log("error", e);
                        $btn.button('reset');
                        $('#FailModal').modal('show');
                    })
        })
    });

    $('#refund').on('click', function () {
        var $btn = $(this).button('loading');

        var creator = account.name;
        //var ram = $("#refundeos").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction(
                tr => {
                    tr.refund({
                        owner: creator
                    })
                    // business logic...
                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log(JSON.parse(e));
                        $btn.button('reset');
                        $('#failinfo').text(JSON.parse(e).error.details[0].message);
                        $('#FailModal').modal('show');
                    })
        })
    });

    $('#startgame').on('click', function () {
        var $btn = $(this).button('loading')
        var creator = account.name;
        var bet = changeDecimalBuZero($("#betpool").val(), 4) + ' EOS';
        var hour = $("#gametime").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info " + account.name);
            var creator = account.name;
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction({

                actions: [
                    {
                        account: 'chinesegamer',
                        name: 'startgame',
                        authorization: [{
                            actor: creator,
                            permission: 'active'
                        }],
                        data: {
                            host: account.name,
                            bet: bet,
                            lasthour: parseInt(hour)
                            //quantity: amount 
                        }
                    }
                ]
                    // business logic...
                }).then(trx => {
                    console.log("get siged transaction data: ", trx);
                    console.log('transfer completed.');
                    $btn.button('reset');
                    $('#SuccessModal').modal('show');
                }).catch(
                    e => {
                        console.log(e);
                        $btn.button('reset');
                        $('#failinfo').text("something happenned.");
                        $('#FailModal').modal('show');
                    })
        })
    });

    $('#register').on('click', function () {
        var $btn = $(this).button('loading')
        var creator = account.name;
        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info " + account.name);
            var creator = account.name;
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction({

                actions: [
                    {
                        account: 'chinesegamer',
                        name: 'hi',
                        authorization: [{
                            actor: account.name,
                            permission: 'active'
                        }],
                        data: {
                            user: account.name
                        }
                    }
                ]
                // business logic...
            }).then(trx => {
                console.log("get siged transaction data: ", trx);
                console.log('transfer completed.');
                $btn.button('reset');
                $('#SuccessModal').modal('show');
                $('#register').hide();
            }).catch(
                e => {
                    console.log(e);
                    $btn.button('reset');
                    $('#failinfo').text("something happenned.");
                    $('#FailModal').modal('show');
                })
        })
    });

    $('#deposit').on('click', function () {
        var $btn = $(this).button('loading')
        var creator = account.name;
        var amount = changeDecimalBuZero($("#depositamount").val(), 4) + ' EOS';
        //var hour = $("#gametime").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info " + account.name);
            var creator = account.name;
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction({
                actions: [
                    {
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: account.name,
                            permission: 'active'
                        }],
                        data: {
                            from: account.name,
                            to: 'chinesegamer',
                            quantity: amount,
                            memo: 'deposit ' + 3 + ':' + amount + ':' + account.name
                        }
                    }
                ]
                // business logic...
            }).then(trx => {
                console.log("get siged transaction data: ", trx);
                console.log('transfer completed.');
                $btn.button('reset');
                $('#SuccessModal').modal('show');
            }).catch(
                e => {
                    console.log(e);
                    $btn.button('reset');
                    $('#failinfo').text("something happenned.");
                    $('#FailModal').modal('show');
                })
        })
    });

    $('#withdraw').on('click', function () {
        var $btn = $(this).button('loading')
        var creator = account.name;
        var amount = changeDecimalBuZero($("#withdramount").val(), 4) + ' EOS';
        //var hour = $("#gametime").val();

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info " + account.name);
            var creator = account.name;
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction({
                actions: [
                    {
                        account: 'chinesegamer',
                        name: 'withdraw',
                        authorization: [{
                            actor: account.name,
                            permission: 'active'
                        }],
                        data: {
                            to: account.name,
                            quantity: amount
                        }
                    }
                ]
                // business logic...
            }).then(trx => {
                console.log("get siged transaction data: ", trx);
                console.log('transfer completed.');
                $btn.button('reset');
                $('#SuccessModal').modal('show');
            }).catch(
                e => {
                    console.log(e);
                    $btn.button('reset');
                    $('#failinfo').text("something happenned.");
                    $('#FailModal').modal('show');
                })
        })
    });

    $("body").on("click", "#closegame", function () {
    //$('#closegame').on('click', function () {
        var $btn = $(this).button('loading')
        //var creator = account.name;
        //var bet = changeDecimalBuZero($("#betpool").val(), 4) + ' EOS';
        var gameid = parseInt($btn.attr("code"));

        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            const account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
            console.log("identity info " + account.name);
            var creator = account.name;
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            //get EOS instance
            const eos = scatter.eos(eosNetwork, Eos, options, "https");
            const requiredFields = {
                accounts: [eosNetwork]
            }
            eos.transaction({
                actions: [
                    {
                        account: 'chinesegamer',
                        name: 'closegame',
                        authorization: [{
                            actor: account.name,
                            permission: 'active'
                        }],
                        data: {
                            gameid: gameid
                            //quantity: amount
                        }
                    }
                ]
                // business logic...
            }).then(trx => {
                console.log("get siged transaction data: ", trx);
                console.log('transfer completed.');
                $btn.button('reset');
                $('#SuccessModal').modal('show');
                
            }).catch(
                e => {
                    console.log(e);
                    $btn.button('reset');
                    $('#failinfo').text("something happenned.");
                    $('#FailModal').modal('show');
                })
        })
    });

    $('#SuccessModal').on('hidden.bs.modal', function () {
        window.location.reload();
    })

   
    $("body").on("click", "#gamedetails", function () {
    //$('#gamedetails').on('click', function () {
        var $btn = $(this).button('loading')
        localNet.getTableRows(true, code, account.name, 'happyitems', 3, 0, 600, 600).then(function (value) {
            
            var html = "";
            html += '<div class="col-xs-12 col-md-12">';
            html += '<table id="detailtableform" class="table table-bordered table-dark table-striped">' +
                '<thead class="bg-blue"><tr><th scope="col">#</th><th scope="col">Player Account</th><th scope="col">Stars</th><th scope="col">Cards (R/P/S)</th></tr></thead><tbody>';
            for (var j = 0; j < value.rows.length; j++) {
                console.log($btn.attr("code"));
                if (value.rows[j].game_id == $btn.attr('code')) {
                    html += '<tr><th scope = "row">' + value.rows[j].id + '</th><td>' + value.rows[j].owner + '</td><td>' + value.rows[j].star + '</td><td>' + value.rows[j].rockcard + '/' + value.rows[j].papercard + '/' + value.rows[j].scissorscard + '</td></tr>';
                    //html += '<tr><th scope = "row">' + value.rows[j].id + '</th><td>' + value.rows[j].owner + '</td><td>' + value.rows[j].star+1 + '</td><td>' + value.rows[j].rockcard+2 + '/' + value.rows[j].papercard + '/' + value.rows[j].scissorscard + '</td></tr>';
                }
            }

            html += '</tbody ></table ></div>';
            //console.log('the item', html);
            //$("#gamedetails").appendTo("body");
            $("#detailtable").html(html);
            $btn.button('reset');
        })

    });

    $("body").on("click", 'th', function () {
    //$('th').click(function () {
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) { rows = rows.reverse() }
        for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
    })

    document.addEventListener('scatterLoaded', scatterExtension => {

        scatter = window.scatter;
        // It is good practice to take this off the window once you have
        // a reference to it.
        window.scatter = null;

        // If you want to require a specific version of Scatter
        scatter.requireVersion(6.0);

        //const eosNetwork = {
        //    blockchain: 'eos',
        //    host: 'api.eoslaomao.com',//'127.0.0.1', // ( or null if endorsed chainId )
        //    port: 443, // ( or null if defaulting to 80 )
        //    protocol: 'https',
        //    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
        //}

        //window.scatter = null;
        //scatter.suggestNetwork(eosNetwork);
        scatter.requireVersion(6.0);
        scatter.getIdentity({ accounts: [eosNetwork] }).then((identity) => {
            //1. get EOS account name
            account = scatter.identity.accounts.find(acc => acc.blockchain === 'eos');

            //get EOS instance

            console.log("identity info" + identity);
            const options = {
                authorization: [{ actor: account.name, permission: 'active' }],//'user@active',
                broadcast: true,//,
                sign: true
            }
            eos = scatter.eos(eosNetwork, Eos, options, "https");
            //const amount = "16.0000 SYS";
            $("#username").text(account.name);
            $("#username2").text(account.name);
            $("#stacksend").val(account.name);
            $("#stakeowner").val(account.name);
            $("#rambuyer").val(account.name);
            $("#ramseller").val(account.name);


            //console.log("account name " + account.name);

            // json, code, scope, table, table_key
            localNet.getTableRows(true, code, account.name, table, 3).then(function (value) {
                //console.log(value);
                var html = "";
                for (var j = 0; j < value.rows.length; j++) {
                    console.log(value.rows[j].owner);
                    console.log(account.name);

                    if (value.rows[j].owner == account.name) {
                        $("#joined").text("SP Member");
                        $("#gamebalance").text(value.rows[j].eos_balance);
                        $("#gamebalance2").text(value.rows[j].eos_balance);
                        $("#gamenum").text(value.rows[j].open_games);
                        $("#gameoffer").text(value.rows[j].open_offers);
                        //$("#register").;
                        //$('#register').removeAttr("disabled");
                        $('#register').hide();
                        //$('#register').text("");
                    }
                }
            });

            t1 = new Date().getTime();
            //get the games
            localNet.getTableRows(true, code, code, 'happygames', 3, 0, 600, 600).then(function (value) {
                //console.log(value);
                var html = "";
                for (var j = 0; j < value.rows.length; j++) {
                    //console.log(value.rows[j].owner);
                    console.log(account.name);
                    if (value.rows[j].organizer == account.name && value.rows[j].status == 1) {
                        var timestamp1 = moment.utc(value.rows[j].deadline);
                        var timestamp2 = moment.utc();
                        var timegap = timestamp1 - timestamp2;
                        var hour = parseInt(timegap / 3600000); var remaining = timegap % 3600000;
                        var minute = parseInt(remaining / 60000); remaining = remaining % 60000
                        var second = parseInt(remaining / 1000);

                        var thelefttime;
                        if (timegap <= 0)
                            thelefttime = 'No';
                        else
                            thelefttime = pad(hour, 2) + ":" + pad(minute, 2) + ":" + pad(second, 2);

                        html += '<div class="col-xs-12 col-md-3" >';
                        html += '<div class="box box-solid  box-primary">';
                        html += '<div class="box-header with-border">';
                        html += '<h3 class="box-title">' + 'Game ID #' + value.rows[j].id + '</h3>';
                        html += '<div class="box-tools pull-right">';
                        if (thelefttime == 'No')
                            html += '<span class="label label-warning">Over</span>';
                        else
                            html += '<span class="label label-success">Active</span>';
                        html += '</div></div>';
                        html += '<div class="box-body">';
                        html += 'Players Number: ' + value.rows[j].playernum + '<br />';
                        html += 'Total Bets: ' + value.rows[j].bet;// + '<br />';
                        //html += 'Total cards:' + value.rows[j].bet + '<br />';
                        html += '</div>';
                        html += '<div class="form-group col-xs-12 col-lg-12"><div class="progress" style = "height: 10px;">';
                        html += '<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 70%" aria-valuemin="0" aria-valuemax="100"></div>';
                        html += '</div><span class="progress-description">';
                        html += '<span id="timeused">' + thelefttime + '</span> time left.';
                        html += '</span></div>';
                        html += '<div class="box-footer">';
                        html += '<button class="btn btn-primary"  type="button" id="gamedetails"' + ' code="' + value.rows[j].id + '">DETAILS</button> ';
                        html += '<button class="btn btn-primary" type="button" id="closegame"' + ' code="' + value.rows[j].id + '">CLOSE</button>';
                        html += '</div></div></div>';
                    }
                }

                $("#gamecontainer").html(html);
            });
            t2 = new Date().getTime();
            console.log('load time', (t2 - t1) + 'ms');

            localNet.getTableRows(true, 'eosio.token', account.name, 'accounts', 3).then(res => {
                console.log(res);
            });

            //t1 = new Date().getTime();
            localNet.getAccount(account.name)
                .then(
                    result => {
                        console.log(result);
                        $("#balance").text(result.core_liquid_balance);
                        $("#balance2").text(result.core_liquid_balance);
                        $("#realbalance2").text(result.core_liquid_balance);
                        $("#headercpu").text(nFormatterCpu(result.cpu_limit.max, 2));
                        $("#headernet").text(nFormatter(result.net_limit.max, 2));
                        $("#headerram").text(nFormatter(result.ram_quota, 2));
                        $(".ramdata").text(nFormatter(result.ram_quota, 3));
                        $(".cpudata").text(nFormatterCpu(result.cpu_limit.max, 3));
                        $(".netdata").text(nFormatter(result.net_limit.max, 3));

                        $("#cpupersent").text(nFormatter(result.cpu_limit.used * 100 / result.cpu_limit.max, 2));
                        $("#netpersent").text(nFormatter(result.net_limit.used * 100 / result.net_limit.max, 2));
                        $("#rampersent").text(nFormatter(result.ram_usage * 100 / result.ram_quota, 2));

                        $("#ramstyle").css('width', nFormatter(result.ram_usage * 100 / result.ram_quota, 2) + '%');
                        $("#netstyle").css('width', nFormatter(result.net_limit.used * 100 / result.net_limit.max, 2) + '%');
                        $("#cpustyle").css('width', nFormatter(result.cpu_limit.used * 100 / result.cpu_limit.max, 2) + '%');

                        if (result.refund_request != null) {
                            $('#refund').removeAttr("disabled");
                            $('#refundeos').val((parseFloat(result.refund_request.cpu_amount) + parseFloat(result.refund_request.net_amount)).toFixed(4));
                        }


                    }

                )
                .catch(error => console.error(error));
            //t2 = new Date().getTime();
            //console.log('load time', (t2 - t1) + 'ms');

        }

        ).catch(
            e => {
                console.log("error", e);
            })
    });
});

