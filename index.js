const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express')

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Exchange rates api is up and running"
    })
})

app.get("/api/rates", async (req, res) => {
    const data = await axios.get("https://www.bot.go.tz/ExchangeRate/excRates");

    //load html
    const $ = cheerio.load(data.data)

    //grab the table
    const table$ = $('tbody').html();
    const tableRows$ = $('tbody').children();
    // const rows = cheerio.load(table$);
    const rates = [];
    const columns = ["Sn","Currency","Buying","Selling","Mean","Date"];
    for(let i = 0; i<tableRows$.length;i++) {
        let _row = {}
        index = 0;
        tableRows$[i].childNodes.forEach(child => {
            if(child.childNodes) {
                // console.log(child.childNodes[0].data)
                _row[columns[index]] = child.childNodes[0].data
                index = index+1;
            }
        })
        rates.push(_row)
        // console.log("---------------------")
    }
    // console.log(rates)
    // console.log(tableRows$[0].childNodes)
    res.json(rates)
})




app.listen(8005, () => {
    console.log("Exchange rate listens on port 8005")
})