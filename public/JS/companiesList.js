var cities;
var selector;
$(document).ready(function () {

    //call get date and clock mathod
    setInterval(getMoment, 1000);

    //check condition for color text title
    if($("#resultText").text().trim() === "هیچ کمپانی وجود ندارد."  || $("#resultText").text().trim() === "خطا")
    {
        $("#resultText").css("color","red")
    }


    //create fields in creator pannel
    $("#creator").click(function () { 

        $(".createParent").toggle(500);

        let  sabteCompany = false;
        if( $("#creator").text().trim() === "ثبت کمپانی جدید" )// creator company fields
        {
            sabteCompany = true;
            
            $(".createParent .labels").html("");
            $(".createParent .labels").append(`<div class="fields" onkeyup="checkValidation(this)"> <label for="name">نام کمپانی:</label> <input type="text" class="form-control hvr" id="name" placeholder="نام کمپانی"> <div class="feedback"> </div> </div>`);
            $(".createParent .labels").append(`<div class="fields" onkeyup="checkValidation(this)"> <label for="sabt">شماره ثبت:</label> <input type="text" class="form-control hvr" id="sabt" placeholder="شماره ثبت"> <div class="feedback"> </div> </div>`);
            $(".createParent .labels").append(`<div class="fields" onclick="checkValidation(this)"> <label for="keshvar">انتخاب کشور:</label> <div class="dropdown"> <button value="" id="keshvar" class="btn btn-secondary dropdown-toggle" type="button" id="kesvar" data-toggle="dropdown"aria-haspopup="true" aria-expanded="false" >  ....انتخاب کشور </button> <div class="dropdown-menu" id="dropDownCountry" aria-labelledby="dropdownMenuButton"></div> </div> <div class="feedback"> </div> </div>`);
            $(".createParent .labels").append(`<div class="fields" onclick="checkValidation(this)"><label for="shahr">انتخاب شهر:</label> <div class="dropdown"> <button value="" class="btn btn-secondary dropdown-toggle"  id="shahr" data-toggle="dropdown" > ....ابتدا کشور را انتخاب کنید </button> <div class="dropdown-menu" id="dropDownCity" aria-labelledby="dropdownMenuButton"></div> </div> <div class="feedback"> </div> </div></div>`);
            $(".createParent .labels").append(`<div class="fields" onkeyup="checkValidation(this)"><label for="tel">شماره تلفن :</label><div id="telParent"><div id="countryCode"></div><input type="tel" class="form-control hvr" id="tel" placeholder="شماره تلفن"></div><div class="feedback"> </div></div>`);
            $(".createParent .labels").append(`<div class="fields" onkeyup="checkValidation(this)"><label for="tarikhSabt">تاریخ ثبت :</label><div id="sabtParent"><div id="taghvimIcon"> <i class="fas fa-calendar-alt"></i> </div><input type="text" class="observer-example" id="tarikhSabt" /></div><div class="feedback"> </div></div>`);
            $(".createParent .labels").append(`<script type="text/javascript">$('.observer-example').persianDatepicker({observer: true,format: 'YYYY/MM/DD',altField: '.observer-example-alt'});</script>`);
        }


        //get countries and set to drop down
        $.ajax({
            type: "GET",
            url: "https://api.jsonbin.io/b/5e99cdd22940c704e1da0856",
            success: function (countriesData) {
                //set to drop down
                $("#dropDownCountry").html("");
                for(let i=1; i<countriesData.length; i++)
                {
                    $("#dropDownCountry").append(`<p onclick="getCity(this)" class="${countriesData[i].Code}"> ${countriesData[i].Name} </p>`)
                }

                //then get all cities
                $.ajax({
                    type: "GET",
                    url: "https://api.jsonbin.io/b/5e99cbc35fa47104cea269b6",
                    success: function (citiesData) {
                        cities = citiesData;
                    }
                });

                //get flags and number code
                $.ajax({
                    type: "GET",
                    url: "https://restcountries.eu/rest/v2",
                    success: function (countriesInfo) {
                        falgs = countriesInfo;
                    }
                });
            }
        });

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
                if(sabteCompany === true) // send date for create company
                {
                    //first create object of company input
                    obj = new companyObject($("#name").val(), $("#sabt").val(), $("#keshvar").text(), $("#shahr").text(), $("#tel").val(), $("#tarikhSabt").val());

                    obj.created_at = converter(obj.created_at);//convert persian number to latin
                    obj.created_at = moment.from(obj.created_at, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

                    $.ajax({
                        type: "POST",
                        url: "/companies",
                        data: obj,
                        success: function (createResult) {
                            alert("کمپانی با موفقیت ثبت شد");
                            $(".createParent").css("display","none");
                            $("body").html(createResult);
                        }
                    });
                }
                else // send date for create personnel
                {
                    $.ajax({
                        type: "method",
                        url: "url",
                        data: "data",
                        dataType: "dataType",
                        success: function (response) {
                        }
                    });
                }
            }
        });
    });

    //close of creator panel
    $("#closeIcon").click(function () 
    {
        $(".createParent").toggle(500);
        $(".createParent .labels").html("");
    });

    //req for delete company
    $(".delete").click(function () {
        $.ajax({
            type: "DELETE",
            url: `/companies/${$(this).attr("id")}`,
            success: function (deleteResult) {
                alert("این کمپانی حذف شد");
                window.location.href = deleteResult.url// change address bar to login page
                // $("body").html(deleteResult);
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
            if(selector[i].getElementsByTagName("i")[2].id === `${$(this).attr("id")}`)
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
                    else if(j===6)
                    {
                        columns[j].innerHTML = `<span title="تایید ویرایش"> <i class="hvr submit-edit far fa-check-circle" id="${selector[i].getElementsByTagName("i")[2].id}" ></i> </span> <span title="لغو ویرایش"> <i class ="hvr cancel-edit far fa-window-close" id="${selector[i].getElementsByTagName("i")[2].id}"></i> </span>`
                    }
                    else
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
                url: "/companies/NoFilter/all",
                success: function (cancelResult) {
                    $("body").html(cancelResult)
                }
            });
        });

        //update company
        $(".submit-edit").click(function () {
            selector = document.getElementById("myTable");
            selector = selector.getElementsByTagName("tr");

            let newObj = new companyObject(selector[indentTR].getElementsByTagName("input")[0].value, selector[indentTR].getElementsByTagName("input")[1].value, selector[indentTR].getElementsByTagName("input")[2].value, selector[indentTR].getElementsByTagName("input")[3].value, selector[indentTR].getElementsByTagName("input")[4].value, selector[indentTR].getElementsByTagName("input")[5].value)
            newObj.id = selector[indentTR].getElementsByTagName("i")[0].id;//set id for search

            //convert to miladi
            newObj.created_at = converter(newObj.created_at);
            newObj.created_at = moment.from(newObj.created_at, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

            $.ajax({
                type: "PUT",
                url: "/companies",
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

    //filter date
    $("#dateFilter").click(function () {
        
        let from = $(".filter-panel #from").val();
        let to = $(".filter-panel #to").val();

        from = converter(from);
        from = moment.from(from, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

        to = converter(to);
        to = moment.from(to, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');//convet date to miladi

        $.ajax({
            type: "POST",
            url: "/companies/DateFilter",
            data: {from: from, to: to},
            success: function (filterResult) {
                $("body").html(filterResult)
            }
        });
    });

    $(".read").click(function () {
        let companyID = $(this).attr("id");

        $.ajax({
            type: "GET",
            url: `/personnel/${companyID}`,
            success: function (getPersonnel) {
                window.location.href = window.location.origin + `/personnel/${companyID}`;// change address bar to login page
            }
        });
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

//after select country get this city
function getCity(selected) {
    let currentCountryCode = $(selected).attr("class")// get country code for get this city

    $("#keshvar").html($(selected).text());//set text for this button
    $("#keshvar").val($(selected).text());//set value for this button

    $("#shahr").html("شهر مورد نظر را انتخاب کنید");

    let findAnyCity = false;
    $("#dropDownCity").html("")
    for(let i=0 ;i<cities.length; i++)
    {
        if(cities[i].Country_Code == currentCountryCode)
        {
            findAnyCity = true;
            $("#dropDownCity").append(`<p onclick="setVal(this)" id="${cities[i].Code}"> ${cities[i].Name} </p>`)
        }
    }
    if(findAnyCity === false)
    {
        $("#dropDownCity").html("هیچ شهری یافت نشد")
    }

    //set flag and number code
    let findInfo = false;
    for(let j=0; j<falgs.length && findInfo === false; j++)
    {
        if(falgs[j].translations.fa == selected.innerHTML.trim())
        {
            findInfo = true;
            $("#countryCode").html("+" + falgs[j].callingCodes[0]);
            $("#flag").html(`<img src="${falgs[j].flag}" alt="parcham">`);
        }
    }
    if(findInfo === false)
    {
        $("#countryCode").html("");
        $("#flag").html("");
    }
}

//after select city estval to button
function setVal(selectedCity) {
    $("#shahr").html($(selectedCity).text());
    $("#shahr").val($(selectedCity).text());
}

//get date and time
function getMoment() {
    $(".child-date .showDate").html(new Date().toLocaleDateString("fa-IR"));
    $(".child-clock .showClock").html(new Date().toLocaleTimeString("fa-IR"));
}

//company constructor
function companyObject(name, shomareSabt, keshvar, shahr, tel, tarikhSabt) {
    this.name = name,
    this.shomareSabt = shomareSabt,
    this.country = keshvar,
    this.city = shahr,
    this.phoneNumber = tel,
    this.created_at = tarikhSabt
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

function a(params) {
    console.log(params.id);
    
}