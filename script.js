
let regForm = document.querySelector(".register-form");
let allInp = document.querySelectorAll(".modal .modal-body input");
let allBtn = regForm.querySelectorAll("BUTTON");
let btnClose = document.querySelector(".btn-close");
let regList = document.querySelector(".reg-list");
let addBtn = document.querySelector(".add-btn");
let searchInp = document.querySelector(".search");
let deleteAllBtn = document.querySelector(".delete-all-btn");
let paginationBox = document.querySelector(".pagination-box");
let btnPrev = document.querySelector(".btn-prev");
let btnNext = document.querySelector(".btn-next");
let allRegData = [];
let url = "";

let data = localStorage.getItem("allData");

if(data != null){
    allRegData = JSON.parse(localStorage.getItem("allData"));
}

// console.log(allRegData);

// add data to localStorage on Submit
regForm.onsubmit = (e)=>{
    e.preventDefault();
    // console.log("Submit");
    
    // performing Validations on email it is already exist or not 
    let checkEmail = allRegData.find((data)=> data.email == allInp[1].value);
    // let checkMobile = allRegData.find((data)=> data.mobile == allInp[2].value);

    if(checkEmail  == undefined){
        allRegData.unshift({
            name : allInp[0].value,
            email : allInp[1].value,
            mobile : allInp[2].value,
            dob : allInp[3].value,
            password : allInp[4].value,
            profile : url == "" ? "./dummy.png" : url
        })
    
        // Pushing Data to Local Storage 
        localStorage.setItem("allData", JSON.stringify(allRegData));

        // closing the modal after submitting data.
        btnClose.click();

        // for success message 
        swal("Data Added", "Successfully..!", "success");

        
        // fomr field should be empty after submit 
        regForm.reset('') 

        // This will reload the webpage to show the latest data which was added recently.
        getRegData(0,5);

    }
    else{
        // swal(`${checkMobile}Data Already Exists`, "failed", "warning");
        swal("Email Already Exists", "failed", "warning");
        
    }
   
    
}

//  Show Data on Webpage.
const getRegData = (from, to) =>{

    // if Data repeat while loading than we can run folowing line to avoid duplication. 
    regList.innerHTML = "";
    
    // for pagination  
    let filterData = allRegData.slice(from,to);
    // console.log(filterData)

    filterData.forEach((data,index) =>{
        // converting data into string formate for edit btn 
        let dataInString = JSON.stringify(data);
        // replacing double quot and adding single quotes.
        let finalData = dataInString.replace(/"/g,"'");
        // let index = finalData.length -1;
        regList.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>
                <img src= ${data.profile} width="35" height= "35" alt="profile-photo">
            </td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.mobile}</td>
            <td>${data.dob}</td>
            <td>
                <button data="${finalData}" index="${index}" class="edit-btn btn">
                    <i class="fa fa-edit"></i>
                </button>
                <button index="${index}" class="del-btn btn">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
        ` 
    })

    action();
};

// Perofrming Action on Individuals.
const action = () =>{

    let allDelBtn = regList.querySelectorAll(".del-btn");
    // console.log(allDelBtn);
    let allEditBtn = regList.querySelectorAll(".edit-btn");
    // console.log(allEditBtn)
    
    // 🚮 Delete BTn code 
    allDelBtn.forEach((btn)=>{

        btn.onclick = async()=>{
            // let isConfirmed = await confirm();
            // if(isConfirmed) {
            //     let index = btn.getAttribute("index");
            //     //to delete relevent item.
            //     allRegData.splice(index, 1);
            //     localStorage.setItem("allData",JSON.stringify(allRegData));
            //     // to display Updated Data on Webpage we have to reload webpage.
            //     getRegData();
                
            // }
            try {
                const isConfirmed = await confirm();
                if (isConfirmed) {
                  const index = btn.getAttribute("index");
                  allRegData.splice(index, 1);
                  localStorage.setItem("allData", JSON.stringify(allRegData));
                  getRegData(); // Update display efficiently
                }
            }catch (error) {
                console.log("deleting data: canceled", error);
                // Handling errors.
            }
            
       }

    })
    
    // 📝 Edit BTn COde 
    for(let btn of allEditBtn) {
        btn.onclick = () =>{
            let index = btn.getAttribute("index");
            let dataInString = btn.getAttribute("data");
            let finalData = dataInString.replace(/'/g,'"');
            let data = JSON.parse(finalData);
            // console.log(finalData)
            addBtn.click();
            allInp[0].value = data.name;
            allInp[1].value = data.email;
            allInp[2].value = data.mobile;
            allInp[3].value = data.dob;
            allInp[4].value = data.password;
            url = data.profile;
            allBtn[0].disabled = false;
            allBtn[1].disabled = true;

            // On Update Pussing code back to localStorage 
            allBtn[0].onclick = ()=>{
                allRegData[index] = {
                    name : allInp[0].value,
                    email : allInp[1].value,
                    mobile : allInp[2].value,
                    dob : allInp[3].value,
                    password : allInp[4].value,
                    profile : url == "" ? "./dummy.png" : url
                }
                // Pushing Data to Local Storage 
                localStorage.setItem("allData", JSON.stringify(allRegData));

                // closing the modal after submitting data.
                btnClose.click();

                // for success message 
                swal("Data Updated", "Successfully..!", "success");

                
                // fomr field should be empty after submit 
                regForm.reset('') 

                // This will reload the webpage to show the latest data which was added recently.
                getRegData(0,5);

                // resenting the button visibility
                allBtn[0].disabled = true;
                allBtn[1].disabled = false;
            }
        }
    }
}

getRegData(0, 5);

// reading Profile image 
allInp[5].onchange = ()=>{
    
    // to read file we will use FileReader() method.
    let fileReader = new FileReader();
    fileReader.readAsDataURL(allInp[5].files[0]);   // here we got file.

    // Now we need to store the file in url variable 
    fileReader.onload = (e)=>{
        url = e.target.result;
        // console.log(url);
    }
}

// Delete All Btn
deleteAllBtn.onclick = async () =>{
    let isConfirmed = await confirm();

    if(isConfirmed){
        allRegData = []
        localStorage.removeItem('allData');
        getRegData();
    }
}

// COnfirm Action Modal 
const confirm = () =>{
    return new Promise((resolve, reject)=>{
        swal({
            title: "Are you sure you want to Delete this?",
            text: "Once deleted, you will not be able to recover this Data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                resolve(true);
              swal("Poof! Data has been deleted!", {
                icon: "success",
              });
            } else {
                reject(false)
              swal("Your Data is safe!");
            }
          });
    });


}

// Search Input Elment.
    searchInp.oninput = ()=>{
        searchData();
    }

// Search Function 
const searchData = () =>{

    let searchValue = searchInp.value.toLowerCase();
    let tr = regList.querySelectorAll("TR");

    for(let i=0; i<tr.length; i++){
        let allTd = tr[i].querySelectorAll("TD");
        let name = allTd[2].innerHTML;
        let email = allTd[3].innerHTML;
        let mobile = allTd[4].innerHTML;

        if(name.toLocaleLowerCase().indexOf(searchValue) !== -1){
            tr[i].style.display = "";
        }
        else if(email.toLocaleLowerCase().indexOf(searchValue) !== -1){
            tr[i].style.display = "";
        }
        else if(mobile.toLocaleLowerCase().indexOf(searchValue) !== -1){
            tr[i].style.display = "";
        }
        else{
            tr[i].style.display = "none";
        }
    }

}

// Pagination COde
    let length = Number(allRegData.length / 5);
    console.log(length)
    let skipData = 0;
    let loadData = 5;

    if(length.toString().indexOf(".") !== -1){
        length = Math.ceil(length);
    }
    console.log(length);

    for(let i = 1; i <= length; i++){

        paginationBox.innerHTML += `

            <button data-skip="${skipData}" data-load="${loadData}" class="btn paginate-btn"> ${i} </button>
        `
        skipData = skipData + 5;
        loadData = loadData + 5;
    }

    let allPaginateBtn = paginationBox.querySelectorAll(".paginate-btn");
    allPaginateBtn[0].classList.add("active");
        allPaginateBtn.forEach((btn,index)=>{
             btn.onclick = () =>{
                controlPrevandNext(allPaginateBtn,index);
                for(let elm of allPaginateBtn){
                    elm.classList.remove("active");
                }
                btn.classList.add("active");
                let skip = btn.getAttribute("data-skip");
                let load = btn.getAttribute("data-load");
                getRegData(skip, load);
            
            }
        })
  
// Next Button Code.
btnNext.onclick = ()=>{
    let currentIndex = 0;
    // console.log(allPaginateBtn.length);

    allPaginateBtn.forEach((btn, index)=>{
        if(btn.classList.contains("active")){
            currentIndex = index;
        }
    })
    allPaginateBtn[currentIndex + 1].click();
    controlPrevandNext(allPaginateBtn, currentIndex +1);
}

// Prev Button Code.
btnPrev.onclick = ()=>{
    let currentIndex = 0;
    allPaginateBtn.forEach((btn, index)=>{
        if(btn.classList.contains("active")){
            currentIndex = index;
        }
    })
    allPaginateBtn[currentIndex - 1].click();
    controlPrevandNext(allPaginateBtn, currentIndex -1);
}

// Prev and Next Btn Control fn 
const controlPrevandNext = (allPaginateBtn, currentIndex) =>{
    let length = allPaginateBtn.length -1;

    if(currentIndex === length){
        btnNext.disabled = true;
        btnPrev.disabled = false;

    }
    else if(currentIndex > 0){
        btnPrev.disabled = false;
        btnNext.disabled = false;
        console.log(currentIndex)
    }
    else {
        btnPrev.disabled = true;
        btnNext.disabled = false;

    }
   
}