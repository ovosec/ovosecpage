
const baseUrl = 'https://api.ovosec.com'


function remoteRequest() {
    const loginButton = document.getElementById('loginButton')
    loginButton && (loginButton.addEventListener('click', login))
    const registerButton = document.getElementById('registerButton')
    registerButton && (registerButton.addEventListener('click', register))

    if (localStorage.getItem('goUserAdminLogin')) {
        return
    }

    if (localStorage.getItem("useradminGetTime") && (Date.now() - parseInt(localStorage.getItem("useradminGetTime"))) < 1000 * 60) {
        setLayoutData(JSON.parse(localStorage.getItem("user")))
    } else {
        getUser()
        getOrder()
    }
}
remoteRequest()


function setLayoutData(data) {
    console.log(data)
    data = data.data
    const email = document.getElementById('email')
    email && (email.innerHTML = data.email)
    const classType = document.getElementById('classType')
    const classExpire = document.getElementById('classExpire')
    if (classExpire) {
        const t = new Date(data.expired_at * 1000);
        classExpire.innerHTML = t < new Date() ? 'Expired' : `Expire date: ${t.getFullYear()}/${(t.getMonth()+1).toString().padStart(2,'0')}/${t.getDate().toString().padStart(2,'0')} ${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;
        classType && (classType.innerHTML = 'member')
    }else{
        classType && (classType.innerHTML = 'non-member')
    }

    const email2 = document.getElementById('email2')
    email2 && (email2.innerHTML = data.email)
    const classType2 = document.getElementById('classType2')
    classType2 && (classType2.innerHTML = (data.plan_name))
    const classExpire2 = document.getElementById('classExpire2')
    if (classExpire2) {
        const t = new Date(data.expired_at * 1000);
        classExpire2.innerHTML = t < new Date() ? 'Expired' : `Expire date: ${t.getFullYear()}/${(t.getMonth()+1).toString().padStart(2,'0')}/${t.getDate().toString().padStart(2,'0')} ${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;
    }

    const kefuHelp = document.getElementById('kefuHelp')
    kefuHelp && (kefuHelp.src = data.chat_url)

    const productContain = document.getElementById('productContain')
    let productHtml = ''
    if (data.plan_list) {
        data.plan_list.forEach(item => {
            let cleanName = item.name;
            if (cleanName.toLowerCase().indexOf('month') !== -1 || cleanName.indexOf('月') !== -1 || cleanName.indexOf('月') !== -1) {
                cleanName = 'OVOSEC Personal Utility License (Monthly Subscription)';
            } else if (cleanName.toLowerCase().indexOf('year') !== -1 || cleanName.indexOf('年') !== -1 || cleanName.indexOf('年') !== -1) {
                cleanName = 'OVOSEC Enterprise Relay License (Annual Plan)';
            } else {
                cleanName = cleanName.replace(/vpn/gi, 'Relay License')
                                      .replace(/proxy/gi, 'Relay')
                                      .replace(/vip/gi, 'Enterprise')
                                      .replace(/v2ray/gi, 'Encrypted Relay')
                                      .replace(/shadowsocks/gi, 'Encrypted Relay');
                if (cleanName.toLowerCase().indexOf('license') === -1 && cleanName.toLowerCase().indexOf('relay') === -1) {
                    cleanName = cleanName + ' Relay License';
                }
            }
            item.cleanName = cleanName;

            productHtml = productHtml + `
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header text-center">
                        <h4 class="card-title" style="font-size: 1.1rem; line-height: 1.4;">${cleanName}</h4>
                    </div>
                    <h1 class="price">$${item.month_price/100}</h1>
                    <ul>
                        <li>${item.content}</li>
                    </ul>
                    <div class="card-footer">
                        <button onclick='selectPlanAndPay(${JSON.stringify(item).replace(/'/g, "\\'")})'
                            class="btn btn-primary btn-block">Order Now</button>
                    </div>
                </div>
            </div>
        `
        })
    }
    productContain && (productContain.innerHTML = productHtml)

    const deviceContain = document.getElementById('deviceContain')
    let deviceHtml = ''
    data.device_list.forEach(item => {
        deviceHtml = deviceHtml + `
        <div class="col-md-2">
            <div class="card">
                <div class="card-body">
                    <div class="top "><span class="col-10 text-truncate">${item.platform}</span>
                        <span class="col-md-2 text-center" style="cursor: pointer;"><i class="bi bi-trash bi-info"></i></span>
                    </div>
                    <div class="middle">
                        <div class="device-info text-center"><span>${item.platform == 'web' || item.platform == 'macos' ? '<i class="bi bi-tv"></i>' : '<i class="bi bi-phone"></i>'}</span></div>
                    </div>
                    <div id="deveiceId" style="display: none;">${item.id}</div>
                    <div class="text-center">ID:${item.device_id}</div>
                </div>
            </div>
        </div>
    `
    })
    deviceContain && (deviceContain.innerHTML = deviceHtml.length == 0 ?
        `<div style="text-align: center;height: 300px;line-height: 300px;color: var(--bs-heading-color);">
            Your device list is empty, log in to OVOSEC and give it a try!
        </div>`: deviceHtml)
    
    const elements = document.querySelectorAll('.bi-info');
    
    elements.forEach(function (element) {
        element.addEventListener('click', function () {
            
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2e7eed",
                cancelButtonColor: "#666",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteDevice()
                }
            });
        });
    });

    let order = []
    if (localStorage.getItem("order") ) {
        order = JSON.parse(localStorage.getItem("order")).data
        console.log(order)
    } 
    const orderContain = document.getElementById('orderContain')
    let ordertHtml = ''
    order.forEach(item => {
        const t = new Date(item.created_at * 1000);
        ordertHtml = ordertHtml + `
        <tr>
            <td class="text-bold-500">${item.trade_no}</td>
            <td class="text-bold-500">${item.plan?.name}</td>
            <td class="text-bold-500">$ ${item.total_amount/100}</td>
            <td class="text-bold-500">${item.status=='0'?"unpaid":item.status=='3'?"paid":item.status=='2'?"cancelled":"unknown"}</td>
            <td class="text-bold-500">${t.getFullYear()}/${(t.getMonth()+1).toString().padStart(2,'0')}/${t.getDate().toString().padStart(2,'0')} ${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}</td>
        </tr>
    `
    })
    orderContain && (orderContain.innerHTML = ordertHtml.length == 0 ?
        `<div style="text-align: center;width: 100%;position: absolute;top: 85px;color: var(--bs-heading-color);">
            You have not purchased any products yet
        </div>` : ordertHtml)

    translate.language.setLocal('deutsch'); 
    
    if (localStorage.getItem("language")) {

        translate.ignore.id.push('topbarUserDropdown');
        translate.service.use('client.edge');
        translate.changeLanguage(localStorage.getItem("language"));
    }
    var liElements = document.querySelectorAll('#topbarUserDropdown li');
    for (var i = 0; i < liElements.length; i++) {
        liElements[i].addEventListener('click', function () {
            var dataValue = this.getAttribute('data-value');
            translate.ignore.id.push('topbarUserDropdown');
            localStorage.setItem('language', dataValue);
            translate.service.use('client.edge');
            translate.changeLanguage(dataValue);
            document.getElementById('curLangShow').innerText = this.innerText
        });
    }
}


function getUser() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', baseUrl + '/api/v1/user/allInfo', true);
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText)
            if (data.data) {
                localStorage.setItem("useradminGetTime", Date.now());
                localStorage.setItem('user', this.responseText)
                setLayoutData(data)
            }
            return
        }else{
            intercept()
        }
        failDialog()
    }
    xhr.send()
}
function getOrder() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', baseUrl + '/api/v1/user/order/fetch', true);
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText)
            if (data.data) {
                localStorage.setItem('order', this.responseText)
                setLayoutData(data)
            }
            return
        }
    }
    xhr.send()
}

function deleteDevice() {
    const deveiceId = document.getElementById('deveiceId').innerText
    const xhr = new XMLHttpRequest();
    xhr.open('POST', baseUrl + '/api/v1/user/removeDevice', true);
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    const formData = new URLSearchParams();
    formData.append('id', deveiceId);
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText)
            
            if (!data.data) {
                failDialog(data.msg)
                return
            }
            successDialog("Your devices has been deleted.")
            getUser()
            return
        }
        failDialog()
    }
    xhr.send(formData.toString())
}



function login() {
    const email = document.getElementById('loginEmail').value
    const passwd = document.getElementById('loginPasswd').value
    if (email.trim().length < 6 || passwd.trim().length < 6) {
        failDialog("Account or password with a minimum of 6 digits")
        return
    }
    document.getElementById('loaderContainer').style.display = 'none'
    document.getElementById('loader').style.display = 'block'
    
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', passwd);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', baseUrl + '/api/v1/passport/auth/login', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    
    xhr.onload = function () {
        if (this.status === 200) {
            try {
                const data = JSON.parse(this.responseText);
                if (!data.data) {
                    failDialog('Login failed');
                    return;
                }
                
                localStorage.setItem('token', data.data.auth_data);
                localStorage.removeItem('goUserAdminLogin');
                window.location.href = 'layout-renew.html';
            } catch (e) {
                failDialog('Invalid response format');
            }
            return;
        }
        failDialog();
    };
    xhr.send(formData.toString());
}



function register() {
    const email = document.getElementById('registerEmail').value
    const name = document.getElementById('registerName').value
    const passwd1 = document.getElementById('registerPasswd1').value
    const passwd2 = document.getElementById('registerPasswd2').value
    if (email.trim().length < 6 || passwd1.trim().length < 6) {
        failDialog("Account or password with a minimum of 6 digits")
        return
    }
    if (name.trim().length < 2) {
        failDialog("Nicknames must have at least two characters")
        return
    }
    if (passwd1 != passwd2) {
        failDialog("Inconsistent password input")
        return
    }
    document.getElementById('loaderContainer').style.display = 'none'
    document.getElementById('loader').style.display = 'block'
    const xhr = new XMLHttpRequest();
    xhr.open('POST', baseUrl + '/register' + '?email=' + email + '&passwd=' + passwd1 + '&name=' + name, true);
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText)
            if (data.ret == '0') {
                failDialog(data.msg)
                return
            }
            localStorage.setItem('token', data.token)
            localStorage.removeItem('goUserAdminLogin')
            window.location.href = 'layout-renew.html'
            return
        }
        failDialog()
    }
    xhr.send()
}



function intercept() {
    window.location.href = 'auth-login.html'
    localStorage.setItem('goUserAdminLogin', 'true')
}



function successDialog(text = "success!") {
    document.getElementById('loaderContainer').style.display = 'block'
    document.getElementById('loader').style.display = 'none'
    Swal.fire({
        title: "request success",
        text: text,
        confirmButtonColor: "#2e7eed",
        icon: "success"
    });
}



function failDialog(text = "Possible network error or server abnormality.") {
    document.getElementById('loaderContainer').style.display = 'block'
    document.getElementById('loader').style.display = 'none'
    Swal.fire({
        title: "request failure",
        text: text,
        confirmButtonColor: "#2e7eed",
        icon: "error"
    });
}

function selectPlanAndPay(plan) {
    localStorage.setItem('selected_plan', JSON.stringify(plan));
    window.location.href = 'layout-device-pay.html';
}
