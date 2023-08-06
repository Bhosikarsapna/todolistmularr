let cl = console.log;

const toDoForm = document.getElementById('toDoForm');
// cl(toDoForm)

const toDoItem = document.getElementById('toDoItem');
// cl(toDoItem)

const toDoList = document.getElementById('toDoList');
// cl(toDoList)

const addBtn = document.getElementById('addBtn')
const UpdateBtn = document.getElementById('UpdateBtn')


// ########################### LOCAL STORAGE ##############################

// const toDoListMulArr = JSON.parse(localStorage.getItem("toDoListMulArr")) || []; // multiple list purpose

// let val = toDoItem.value;
// toDoItem.value = 'checking'
let toDoListMulArr = [];

if((localStorage.getItem("toDoListMulArr"))){
    toDoListMulArr = JSON.parse(localStorage.getItem("toDoListMulArr"))
}


//################################ UID FUNCTION ##############################

function uuid() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


  //########################################## GET ATTRIBUTE VALUE ############################################

  const onItemEdit = (ele) => {
    // cl(ele, "editted!!!")
    let editId = ele.getAttribute('data-id')
    localStorage.setItem('editId', JSON.stringify(editId)); // editid is string thats why no need of editid convert into json.stringify.
    // cl(editId)

    
  let editObj = toDoListMulArr.find((todo) => {
    return todo.skillId = editId
   }) 
   localStorage.setItem('editObj', JSON.stringify(editObj))
//    cl(editObj)
UpdateBtn.classList.remove('d-none');
   addBtn.classList.add('d-none');
   toDoItem.value = editObj.skillName;
}

const onItemDelete = (ele) => {
    cl(ele)
    // let deleteId = ele.getAttribute('data-id')
    cl(ele.dataset.deletid)
    let deleteId = ele.dataset.deletid;
    let deletedValue = document.getElementById(deleteId).firstElementChild.innerHTML
    toDoListMulArr = toDoListMulArr.filter(item => {
        return item.skillId != deleteId
    })
    
    localStorage.setItem('toDoListMulArr', JSON.stringify(toDoListMulArr));
    // templating(toDoListMulArr)

    document.getElementById(deleteId).remove()

    Swal.fire({
        icon: 'success',
        title: `${deletedValue} is deleted from todo list`,
        timer : 3000
      })
}
 

  //########################################## ARRAY ITERATING ############################################ 

  const templating = (arr) => {
    // cl(arr)
    let result = '';
arr.forEach(list => {
    result += `
    <li class="list-group-item align-items-center font-weight-bold mb-2 text-uppercase d-flex justify-content-between" id="${list.skillId}">
    <span class="span">${list.skillName}</span>
    <span>
        <i class="mr-2 edit fas fa-edit"
        onclick ="onItemEdit(this)"
         data-id="${list.skillId}"></i>
        <i class="delete fas fa-trash-alt"
        onclick ="onItemDelete(this)"
        data-deletId="${list.skillId}"></i>
    </span>
</li>       
              `
})
toDoList.innerHTML = result; // ul id is todolist
}

templating(toDoListMulArr)

//######################################## EVENT FUNCTION ###########################################

const onToDoAdd = (eve) => {
    eve.preventDefault(); // does not reload
    // cl('hello')
    let getTodoItem = toDoItem.value; // to get values from input
    // cl(getTodoItem);
    // toDoListMulArr.push(getTodoItem) // make array of lists
    let toDoObj = {
        skillName : getTodoItem,
        skillId :uuid()
    }
    toDoListMulArr.unshift(toDoObj)

    //############ LOCAL STORAGE ########################

    localStorage.setItem('toDoListMulArr', JSON.stringify(toDoListMulArr))

    // cl(toDoListMulArr)
    eve.target.reset(); // used for reset input

    // templating(toDoListMulArr)
    
    let li = document.createElement('li');
    li.id = toDoObj.skillId
    li.className = "list-group-item align-items-center font-weight-bold mb-2 text-uppercase d-flex justify-content-between"
    li.innerHTML = `
    <span class="span">${toDoObj.skillName}</span>
    <span>
        <i class="mr-2 edit fas fa-edit"
        onclick ="onItemEdit(this)"
         data-id="${toDoObj.skillId}"></i>
        <i class="delete fas fa-trash-alt"
        onclick ="onItemDelete(this)"
        data-deletId="${toDoObj.skillId}"></i>
    </span>
                   `
                   toDoList.prepend(li)

                   Swal.fire({
                    icon: 'success',
                    title: `${toDoObj.skillName} is added to todo list`,
                    timer : 3000
                  })
}

const onItemUpdate = () => {
    let updatedValue = toDoItem.value;
    // cl(updatedValue);
    let editedObj = JSON.parse(localStorage.getItem("editObj")) // 
    // cl(editedObj)

    // toDoListMulArr.forEach(item => {
    //     if(item.skillId === updateId){
    //         item.skillName = updatedValue
            
    //     }
    // })

    for(let i = 0; i < toDoListMulArr.length; i++){
        if(toDoListMulArr[i].skillId === editedObj.skillId){
          toDoListMulArr[i].skillName = updatedValue
          break;
      }
    }

    localStorage.setItem("toDoListMulArr", JSON.stringify(toDoListMulArr))

    // templating(toDoListMulArr)
    let targetLi = document.getElementById(editedObj.skillId);
    targetLi.firstElementChild.innerHTML = updatedValue;

    Swal.fire({
        icon: 'success',
        title: `${editedObj.skillName} is updated to ${updatedValue}`,
        timer : 3000
      })

    toDoForm.reset();

    UpdateBtn.classList.add('d-none')
    addBtn.classList.remove('d-none')
}

toDoForm.addEventListener('submit', onToDoAdd)
UpdateBtn.addEventListener('click', onItemUpdate)