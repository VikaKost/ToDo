const toDoData = [];

class TasksView {
    constructor(compl, uncompl) {
        this.tasks = compl;
        this.finished = uncompl;
    }

    dateTransform(date){
        let dateTr;
        if (date.getDate.length < 2){
            dateTr = `${'0'+date.getDate()} `;
        }
        else{
            dateTr = `${date.getDate()}`;
        }
        if (date.getMonth() < 10){
            dateTr +=  `0${date.getMonth()+1}<br>`;
        }
        else{
            dateTr += `${date.getMonth()}<br>`;
        }
        dateTr += `${date.getFullYear()}`;
        return dateTr;
    }

    display(tasks){
        let toDoData = document.getElementById(this.tasks);
        let toDoDataFin = document.getElementById(this.finished);
        let list = "";
        let listFin = "";
        let date;
        tasks.forEach(item =>{
            date = this.dateTransform(new Date(item.date));
            if (item.isActive === false){
                list += `<div class="taskWrapper"><div class="task" id=${item.id}><div class="check">
<span class="iconify mark" id = "mark" data-icon="ant-design:check-outlined" data-inline="false"></span>
</div><span>${item.text}</span><div class="editBox"><span class="iconify" id="toEdit" data-icon="bx:bxs-edit" data-inline="false"></span>
<span class="iconify" id="toDelete" data-icon="ant-design:delete-outlined" data-inline="false"></span>
</div></div><span class="dateBox">${date}</span></div>`
            }
            else{
                listFin += `<div class="taskWrapper"><div class="task" id=${item.id}><div class="check">
<span class="iconify" id = "mark" data-icon="ant-design:check-outlined" data-inline="false"></span>
</div><span>${item.text}</span><div class="editBox"><span class="iconify" id="toEdit" data-icon="bx:bxs-edit" data-inline="false"></span>
<span class="iconify" id="toDelete" data-icon="ant-design:delete-outlined" data-inline="false"></span>
</div></div><span class="dateBox">${date}</span></div>`
            }

        });
      toDoData.innerHTML = list;
      toDoDataFin.innerHTML = listFin;
    }
}


class Controller {
    constructor() {
        this.tasksView = new TasksView('compl', 'uncompl');
        let filters;
        const editBtn = document.getElementById('compl');
        const editBtnfin = document.getElementById('uncompl');
        const loginBtn = document.getElementById('loginButton');
        const regLink = document.getElementById('regL');
        const loginLink = document.getElementById('reg');
        editBtn.addEventListener('click', this.Edit);
        editBtnfin.addEventListener('click', this.Edit);
        loginBtn.addEventListener('click', this.toLogin);
        regLink.addEventListener('click', this.toReg);
        loginLink.addEventListener('click', this.toLoginR);
    }

    userCheck(){
        let input = document.getElementById('addInput');

        if (localStorage.getItem('user') === null){
            input.disabled = 1;
            let btn = document.getElementById('loginButton');
            btn.innerHTML = 'Вход';
        }
        else {

            let user = document.getElementById('name');
            user.innerHTML = `Привет, ${localStorage.getItem('user')}`
            input.disabled = 0;
            let btn = document.getElementById('loginButton');
            btn.innerHTML = 'Выход';
        }
    }

    toLogin(){
        controller.changeForm('formMain', 'login-form');
         localStorage.removeItem('user');
    }

    toReg(){
        controller.changeForm('login-form', 'reg-form');
    }

    toLoginR(){
        controller.changeForm('reg-form', 'login-form');
    }

    registration(event){
        if (event.srcElement[1].value !==  event.srcElement[2].value) {
            alert("Пароли не совпадают");
        }
            localStorage.setItem('user', event.srcElement[0].value);
        controller.userCheck();
        controller.changeForm('reg-form', 'formMain');

    }

    login(event){
        let user = document.getElementById('name');
        user.innerHTML = `Привет, ${event.srcElement[0].value}`
    localStorage.setItem('user', event.srcElement[0].value);
        controller.userCheck();
    controller.changeForm('login-form', 'formMain');
    }

    addTask(text){
        let check = document.getElementById('addTask');
        let taskDate = new Date;
        let task = {};
        if (check.value === ""){
            task.id = taskDate.getMilliseconds();
            task.text = text.srcElement[0].value;
            task.date = taskDate;
            task.isActive = false;
            this.sendTask(task);
            console.log(task);
        }
        else{
            this.toEdit(check.value, text.srcElement[0].value);
            check.value = "";
        }
    }

    filter(){
        const textFil = document.getElementById('textFil');
        const dateFil = document.getElementById('dateFil');
        let filterObj = {};
        if(textFil.value){
            filterObj.text = textFil.value;
        }
        if(dateFil.value){
            filterObj.date = new Date (dateFil.value);
        }
        controller.filters = filterObj;
        controller.showList()
        return filterObj;
    }

    toEdit(id, text){
        toDoData.forEach(item => {
            if (id === item.id.toString()){
                item.text = text;
            }
        })
        this.tasksView.display(toDoData);
    }

    getTask(id){
        let task = {};
        toDoData.forEach(item => {
            if (item.id.toString() === id){
                task.id = item.id;
                task.text = item.text;
            }
        })
        return task;
    }

    Edit(){
        let task = {};
        let target = event.target;
        let idBtn = target.id;
        let id = target.parentNode.parentNode.id;
        let field = document.getElementById('addInput');
        let send = document.getElementById('addTask');
        console.log(id);
        task = controller.getTask(id);
        if (idBtn === 'toEdit'){
            field.value = task.text;
            send.value = task.id;
        }
        if (idBtn === 'toDelete'){
            if (confirm('Удалить задачу?')) {
                controller.toDelete(id);
            }
        }

        if (idBtn === 'mark'){
            controller.toFinish(id);
        }

    }

    toFinish(id){
        toDoData.forEach(item => {
            if (item.id.toString() === id){
                if (item.isActive === false){
                    item.isActive = true;
                }
                else{
                    item.isActive = false;
                }
            }
        })
        this.showList();
        console.log(toDoData);
    }

    toDelete(id){
        toDoData.forEach((item, index )=> {
            if (item.id.toString() === id){
                toDoData.splice(index, 1);
                this.tasksView.display(toDoData);
            }
        })
    }

    sendTask(task){
        toDoData.push(task);
        this.tasksView.display(toDoData);
    }

    showList(){
        this.getData(controller.filters)
    }

    getData(filters) {
        const filterObj = {
            text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
            date: (item, date) => item.date.getFullYear() === date.getFullYear() && item.date.getMonth() === date.getMonth()
            && item.date.getDate() === date.getDate(),
        };
        let list = [];
        let p =   Promise.resolve(toDoData);
        //console.log(p);
        p.then((response) => {
            return {
                result: response
            }
        }).then(response => {
            //if (response.status === 200 || response.status === 201) {
                return response.result;

        }).then((data) => {
            if (filters){
                Object.keys(filters).forEach((key) => {
                    data = data.filter((item) => filterObj[key](item, filters[key]));
                })
            }
                        return data;
                    }).then((data) => {
                        return data.map(list => {
                            return {id: list.id,
                                date: list.date,
                                text: list.text,
                                isActive: list.isActive
                            }
                        })}).then((Viewed) => {
                this.tasksView.display(Viewed)
        })
        };

    changeForm(formFrom, formTo){
        let from = document.getElementById(formFrom);
        let to = document.getElementById(formTo);
        from.style.display = 'none';
        to.style.display = 'block';
    }


}


const controller = new Controller();
controller.getData();
controller.userCheck();
