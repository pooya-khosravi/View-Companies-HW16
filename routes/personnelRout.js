const express = require("express");
const router = express.Router();
const path = require("path");
const personnelObj = require("../models/personnelObj.js");
const companyObj = require("../models/companyObj.js");

var indentID;
//get personnel
router.get("/:ID", async function (req, res) {

    indentID = req.params.ID;

    //get this company name
    let thisCompanyObj
    try 
    {
        thisCompanyObj = await companyObj.findById(indentID)   
    } 
    catch (error) 
    {
        console.log("err: " + error);
    }

    personnelObj.find({company: indentID}).populate("company", {name: 1}).exec(function (err, allPersonnel) {
        if(err)
        {
            res.status(500).render( path.join(__dirname, "../views/pages/personnelList.ejs"), {error: ("خطا هنگام جست و جو برای کارمندان این شرکت: \n" + err), nothing: "", findResult: "", ID: thisCompanyObj._id} );
        }
        else if(!allPersonnel.length)
        {
            res.render( path.join(__dirname, "../views/pages/personnelList.ejs"), {error: "", nothing: `هیچ کارمندی برای شرکت: ${thisCompanyObj.name} وجود ندارد`, findResult: "", ID: thisCompanyObj._id} );
        }
        else
        {
            res.render( path.join(__dirname, "../views/pages/personnelList.ejs"), {error: "", nothing: "", findResult: allPersonnel, ID: thisCompanyObj._id} );
        }
    })

});



//create new user
router.post("/", function (req, res) {

    const NEW_USER = new personnelObj({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        codeMelli: req.body.codeMelli,
        gender: req.body.gender,
        isManager: req.body.isManager,
        tavallod: req.body.tavallod,
        company: req.body.company,
    });

    NEW_USER.save(function (err, saveResult) {
        if(err)
        {
            res.status(500).send("خطا هنگام سیو کاربر")
        }
        else
        {
            res.redirect(`/personnel/${indentID}`)
        }
    })
});


//delete
router.delete("/:id", function (req, res) {
    let thisUserID = req.params.id;
    personnelObj.findByIdAndDelete(thisUserID, function (err, deleteResult) {
        if(err)
        {
            res.status("500").send("خطا هنگام حذف کاربر")
        }
        else
        {
            res.send({status: true, url: `/personnel/${indentID}`});
        }
    })
});



//update
router.put("/", function (req , res) {
    let userID = req.body.id;
    personnelObj.findById(userID, function (err, userData) {
        if(err)
        {
            res.status(500).send("خطا هنگام سرچ برای اپدیت کاربر")
        }
        else
        {
            userData.firstName = req.body.firstName;
            userData.lastName = req.body.lastName;
            userData.codeMelli = req.body.codeMelli;
            userData.gender = req.body.gender;
            userData.isManager = req.body.isManager;
            userData.tavallod = req.body.tavallod;
            userData.company = req.body.company;

            userData.save(function (err1, updateResult) {
                if(err1)
                {
                    res.status(500).send("خطا هنگام اپدیت")
                }
                else
                {
                    res.send({status: true, url: `/personnel/${userData.company}`})
                }
            })
        }
    })
});

module.exports = router;