var cities;
var selector;
$(document).ready(function () {

    //call get date and clock mathod
    setInterval(getMoment, 1000);

    //create fields in creator pannel
    $("#creator").click(function () { 

        $(".createParent").toggle(500);

        $(".buttons #sabt").click(function () {
            
            let letSendRequest = true;
            //checking for empty field and alert
            selector = document.getElementsByClassName("fields");
            for(let i=0; i<selector.length; i++)
            {
                if(selector[i].getElementsByClassName("form-control")[0])
                {
                    if(selector[i].getElementsByClassName("form-control")[0].value === "")
                    {
                        letSendRequest = false;
                        selector[i].getElementsByClassName("feedback")[0].innerHTML = "الزامی *";
                        selector[i].getElementsByClassName("feedback")[0].style.color = "red";
                        selector[i].getElementsByClassName("feedback")[0].style.display = "block";
                        selector[i].getElementsByTagName("input")[0].style.border = "solid 1px red";
                    }
                }
                else if(selector[i].getElementsByTagName("button")[0])
                {
                    if(selector[i].getElementsByTagName("button")[0].value === "")
                    {
                        letSendRequest = false;
                        selector[i].getElementsByClassName("feedback")[0].innerHTML = "الزامی *";
                        selector[i].getElementsByClassName("feedback")[0].style.color = "red";
                        selector[i].getElementsByClassName("feedback")[0].style.display = "block";
                        selector[i].getElementsByTagName("button")[0].style.border = "solid 1px red";
                    }
                }
            }

            //check if not any field any empty
            let obj;
            if(letSendRequest === true)
            {
                
                obj = new userObject($("#firstName").val(), $("#lastName").val(), $("#codeMelli").val(), $('input[name = gender]:checked').val(), $("#tavallod").val(), $("#myID").text())

                //set role
                if($('input[name = isManager]:checked').val().trim() === "مدیر")
                {
                    obj.isManager = true;
                }
                else
                {
                    obj.isManager = false;
                }

                obj.tavallod = converter(obj.tavallod);//convert persian number to latin
                obj.tavallod = moment.from(obj.tavallod, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

                // send data for create personnel
                $.ajax({
                    type: "POST",
                    url: "/personnel",
                    data: obj,
                    success: function (createUserResult) {
                        alert("کارمند جدید برای این شرکت ثبت شد");
                        $(".createParent").css("display","none");
                        $("body").html(createUserResult);
                    }
                });
            }
        });
    });

    //close of creator panel
    $("#closeIcon").click(function () 
    {
        $(".createParent").toggle(500);
    });

    //req for delete user
    $(".delete").click(function () {
        $.ajax({
            type: "DELETE",
            url: `/personnel/${$(this).attr("id")}`,
            success: function (deleteResult) {
                alert("این کاربر حذف شد");
                window.location.href = deleteResult.url// change address bar to login page
            }
        });
    });

    //req for update
    $(".edit").click(function () {
        let indentTR;

        selector = document.getElementById("myTable");
        selector = selector.getElementsByTagName("tr");
        
        let find = false;
        for(let i=1; i<selector.length && find === false; i++)
        {
            if(selector[i].getElementsByTagName("i")[1].id === `${$(this).attr("id")}`)
            {
                indentTR = i;
                find = true
                let columns = selector[i].getElementsByTagName("td");
                for(let j=0; j<columns.length; j++)
                {
                    if(j===5)
                    {
                        columns[j].innerHTML = `<input type="text" placeholder="YYYY/MM/DD"/>`
                    }
                    else if(j===7)
                    {
                        columns[j].innerHTML = `<span title="تایید ویرایش"> <i class="hvr submit-edit far fa-check-circle" id="${selector[i].getElementsByTagName("i")[0].id}" ></i> </span> <span title="لغو ویرایش"> <i class ="hvr cancel-edit far fa-window-close" id="${selector[i].getElementsByTagName("i")[1].id}"></i> </span>`
                    }
                    else if(j!==6)
                    {
                        columns[j].innerHTML = `<input type="text" placeholder="${columns[j].innerText}" />`
                    }
                }
            }
        };

        //when click cancel button create table
        $(".cancel-edit").click(function () {
            $.ajax({
                type: "GET",
                url: `/personnel/${$("#myID").text()}`,
                success: function (cancelResult) {
                    window.location.href = window.location.origin + `/personnel/${$("#myID").text()}`;// change address bar to login page
                }
            });
        });

        //update company
        $(".submit-edit").click(function () {
            selector = document.getElementById("myTable");
            selector = selector.getElementsByTagName("tr");

            let setRole = selector[indentTR].getElementsByTagName("input")[4].value;
            if(setRole === "مدیر")
            {
                setRole = true;
            }
            else
            {
                setRole = false;
            }
            

            let newObj = new userObject(selector[indentTR].getElementsByTagName("input")[0].value, selector[indentTR].getElementsByTagName("input")[1].value, selector[indentTR].getElementsByTagName("input")[2].value, selector[indentTR].getElementsByTagName("input")[3].value, selector[indentTR].getElementsByTagName("input")[5].value, $("#myID").text())
            newObj.id = selector[indentTR].getElementsByTagName("i")[0].id;//set id for search
            newObj.isManager = setRole;

            //convert to miladi
            newObj.tavallod = converter(newObj.tavallod);
            newObj.tavallod = moment.from(newObj.tavallod, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

            $.ajax({
                type: "PUT",
                url: "/personnel",
                data: newObj,
                success: function (updateResult) {
                    if(updateResult.status === true)
                    {
                        window.location.href = updateResult.url// change address bar to login page
                    }
                }
            });
        })
    });

});

//when key down on any in put will hide this feed back
function checkValidation(input) {
    if(input.getElementsByClassName("form-control")[0])
    {
        if(input.getElementsByClassName("form-control")[0].id === "tel" || input.getElementsByClassName("form-control")[0].id === "codeMelli" || input.getElementsByClassName("form-control")[0].id === "sabt")
        {
            input.getElementsByClassName("form-control")[0].style.textAlign = "left";
            const NUMBERS = /[^0-9]/g;//if not number err
            if(input.getElementsByClassName("form-control")[0].value.match(NUMBERS))
            {
                letSendRequest = false;
                input.getElementsByClassName("feedback")[0].innerHTML = "این فیلد فقط باید عددی باشد.";
                input.getElementsByClassName("feedback")[0].style.color = "red";
                input.getElementsByClassName("feedback")[0].style.display = "block";
                input.getElementsByTagName("input")[0].style.border = "solid 1px red";
            }
            else
            {
                letSendRequest = true;
                input.getElementsByClassName("feedback")[0].style.display = "none";
                input.getElementsByTagName("input")[0].style.border = "none";
            }
        }
        else
        {
            input.getElementsByClassName("feedback")[0].style.display = "none";
            input.getElementsByTagName("input")[0].style.border = "none";
        }
    }
    else if(input.getElementsByTagName("button")[0])
    {
        input.getElementsByClassName("feedback")[0].style.display = "none";
        input.getElementsByTagName("button")[0].style.border = "none";
    }
}

//get date and time
function getMoment() {
    $(".child-date .showDate").html(new Date().toLocaleDateString("fa-IR"));
    $(".child-clock .showClock").html(new Date().toLocaleTimeString("fa-IR"));
}

//user constructor
function userObject(firstName, lastName, codeMelli, gender, tavallod, companyName) {
    this.firstName = firstName,
    this.lastName = lastName,
    this.codeMelli = codeMelli,
    this.gender = gender,
    this.tavallod = tavallod
    this.company = companyName
}

//convert created at numbers to latin
function converter(dateInput) {
    let converted = "";
    for(let i=0; i<dateInput.length; i++)
    {
        if(dateInput.charCodeAt(i) === 1776)
        {
            converted = converted + "0";
        }
        else if(dateInput.charCodeAt(i) === 1777)
        {
            converted = converted + "1";
        }
        else if(dateInput.charCodeAt(i) === 1778)
        {
            converted = converted + "2";
        }
        else if(dateInput.charCodeAt(i) === 1779)
        {
            converted = converted + "3";
        }
        else if(dateInput.charCodeAt(i) === 1780)
        {
            converted = converted + "4";
        }
        else if(dateInput.charCodeAt(i) === 1781)
        {
            converted = converted + "5";
        }
        else if(dateInput.charCodeAt(i) === 1782)
        {
            converted = converted + "6";
        }
        else if(dateInput.charCodeAt(i) === 1783)
        {
            converted = converted + "7";
        }
        else if(dateInput.charCodeAt(i) === 1784)
        {
            converted = converted + "8";
        }
        else if(dateInput.charCodeAt(i) === 1785)
        {
            converted = converted + "9";
        }
        else
        {
            converted = converted + dateInput[i];
        }
    }
    return converted;
}