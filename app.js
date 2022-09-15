const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const port = 3000
const https = require("https")

const app = express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})


app.post("/", function(req,res){
    const query = JSON.parse(req.body.objectInput);
    const type = req.body.typepayment

    var promoPayment
    var promoNoACH
    var paydownWACH = ""
    var paydownWOACH = ""
    var goToPayment
    var goToNoACH

    if(type === "min"){
      promoPayment = query.discountedInterestRatePaymentPeriods[0].monthlyPayment
      promoNoACH = query.introductoryPeriod.monthlyPayment
      paydownWACH = query.discountedInterestRateMinimumPaymentPeriods[1].monthlyPayment
      paydownWOACH = query.minimumPaymentPeriods[1].monthlyPayment
      goToPayment = query.discountedInterestRatePaymentPeriods[1].monthlyPayment
      goToNoACH = query.paymentPeriods[1].monthlyPayment
    }else{
      promoPayment = query.discountedInterestRatePaymentPeriods[0].monthlyPayment
      promoNoACH = query.introductoryPeriod.monthlyPayment
      paydownWACH = query.discountedInterestRatePaymentPeriods[0].monthlyPayment
      paydownWOACH = query.introductoryPeriod.monthlyPayment
      goToPayment = query.discountedInterestRatePaymentPeriods[1].monthlyPayment
      goToNoACH = query.goToPeriod.monthlyPayment
    }

    res.setHeader("Content-type", "text/html");



    res.write("<ul><li>Loan Amount: $" + query.amount + "</li>");
    res.write("<li>Loan type: " + type + "</li>");
    res.write("<li>AvgAPR: " + query.averageAPR + "%</li>");
    res.write("<li>Promo Payment: $" + promoPayment + "</li>");
    res.write("<li>Promo Payment no ACH: $" + promoNoACH + "</li>");
    if(paydownWACH){
      res.write("<li>Paydown Payments w/ ACH: $" + paydownWACH + "</li>");
      res.write("<li>Paydown Payments w/o ACH: $" + paydownWOACH + "</li>");
    }
    res.write("<li>GoTo Payments w/ ACH: $" + goToPayment + "</li>");
    res.write("<li>GoTo Payments w/o ACH: $" + goToNoACH + "</li></ul>");
    res.write("<a href='/'>Go Back</a>")

    res.write(`
      <table>
        <thead>
          <tr>
            <th>Loan Amount</th>
            <th>Type</th>
            <th>Avg Apr</th>
            <th>Promo Payment</th>
            <th>Promo Payment w/o ACH</th>
            <th>Paydown Payments w/ ACH</th>
            <th>Paydown Payments w/o ACH</th>
            <th>GoTo Payments w/ ACH</th>
            <th>GoTo Payments w/o ACH</th>
          </tr>
        </thead>
        <tr>
          <td>$` + query.amount + `</td>
          <td>` + type + `</td>
          <td>` + query.averageAPR + `%</td>
          <td>$` + promoPayment + `</td>
          <td>$` + promoNoACH + `</td>
          <td>$` + paydownWACH + `</td>
          <td>$` + paydownWOACH + `</td>
          <td>$` + goToPayment + `</td>
          <td>$` + goToNoACH + `</td>
        </tr>
      </table>

      `);




    res.send();

});//app post




app.listen(port, () => {
  console.log("App listening on port " + port)
})
