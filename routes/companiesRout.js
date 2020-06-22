//require useful module
const express = require("express");
const router = express.Router();
const path = require("path");
const companyObj = require("../models/companyObj.js");

/**
 * first check conditions
 * second search in db and send result to client
 */
router.get("/:filter/:ID", function (req, res) {

    if(req.params.filter === "NoFilter" && req.params.ID === "all")
    {
        companyObj.find({}, function (err, companiesListData) {
            if(err)
            {
                res.status(500).render( path.join(__dirname, "../views/pages/companiesList.ejs"), {error: ("خطا هنگام جست و جو برای لیست کمپانی ها: \n" + err), nothing: "", findResult: ""} );
            }
            else if(!companiesListData.length)
            {
                res.status(404).render( path.join(__dirname, "../views/pages/companiesList.ejs"), {error: "", nothing: "هیچ کمپانی وجود ندارد.", findResult: ""} );
            }
            else
            {
                res.render( path.join(__dirname, "../views/pages/companiesList.ejs"), {error: "", nothing: "", findResult: companiesListData} );
            }
        });
    }
});



//filter date
router.post("/DateFilter", function (req, res) {

    companyObj.find({$and: [{created_at: {$gte: req.body.from}}, {created_at: {$lte: req.body.to}}]}, function (err, companiesFiltered) {
        if(err)
        {
            res.status(500).render( path.join(__dirname, "../views/pages/companiesList.ejs"), {error: ("خطا هنگام جست و جو برای لیست کمپانی ها: \n" + err), nothing: "", findResult: ""} );
        }
        else
        {
            res.render( path.join(__dirname, "../views/pages/companiesList.ejs"), {error: "", nothing: "", findResult: companiesFiltered} );
        }
    })
})



router.post("/", function (req, res) {

    //check empty field
    let checkFieldResult = isEmptyFields(req.body);
    if(checkFieldResult === true)
    {
        res.status(400).send("پر کردن فیلد های خالی الزامی میباشد.")
    }
    else
    {
        //create a new company 
        const NEW_COMPANY = new companyObj({
            name: req.body.name,
            shomareSabt: req.body.shomareSabt,
            country: req.body.country,
            city: req.body.city,
            created_at: new Date(req.body.created_at).toLocaleDateString(),
            phoneNumber: req.body.phoneNumber
        });

        // save new company
        NEW_COMPANY.save(function (err, saveResult) {
            if(err)
            {
                res.status(500).send("خطا در هنگام سیو کمپانی .")
            }
            else
            {
                res.redirect("/companies/NoFilter/all")
            }
        })
    }
});



//update
router.put("/", function (req, res) {
    
    let indentID = req.body.id;
    companyObj.findById(indentID, function (err, thisCompany) {
        if(err)
        {
            res.status(500).send("خطا هنگام اپدیت" + err)
        }
        else
        {

            thisCompany.name = req.body.name;
            thisCompany.shomareSabt = req.body.shomareSabt;
            thisCompany.country = req.body.country;
            thisCompany.city = req.body.city;
            thisCompany.phoneNumber = req.body.phoneNumber;
            thisCompany.created_at = req.body.created_at;

            thisCompany.save(function (err1, saveUpdateResult) {
                if(err1)
                {
                    res.status(500).send("خطا هنگام سیو اپدیت" + err1)
                }
                else
                {
                    res.send({status: true, url: "/companies/NoFilter/all"});
                }
            })
        }
        
    })
})



//delete
router.delete("/:companyID", function (req, res) {
    //check exist this company
    companyObj.findByIdAndDelete(req.params.companyID, function (err, deleteCompany) {
        if(err)
        {
            res.status(500).send("خطا هنگام حذف کمپانی" + err);
        }
        else if(!deleteCompany)
        {
            res.status(404).send("این کمپانی وجود ندارد" + err);
        }
        else
        {
            res.send({status: true, url: "/companies/NoFilter/all"});
        }
    })
})

//check empty field
function isEmptyFields(bodyRequest)
{
    if(!bodyRequest.name || !bodyRequest.shomareSabt || !bodyRequest.country || !bodyRequest.city || !bodyRequest.created_at || !bodyRequest.phoneNumber)
    {
        return true;
    }
    return false;
}

module.exports = router;