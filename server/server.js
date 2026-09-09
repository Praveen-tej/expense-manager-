const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const db = require("./db")
const app = express()

const PORT = 5000;

app.use(cors())
app.use(express.json());

app.get("/api/expenses", (req, res) => {
    console.log("Get data")

    let sql = `SELECT * FROM expenses`

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Failed to fetch"
            })
        }
        res.status(200).json(result)
    })
})


app.post("/api/expenses", (req, res) => {

    const { amount, category, description, expense_date } = req.body

    let sql = `insert into expenses (amount, category, description, expense_date) values(?,?,?,?)`

    const values = [amount, category, description, expense_date]

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "post request failed"
            })
        }

        const expenseId = result.insertId
        let getsql = `SELECT * FROM expenses WHERE id = ?`
        const values = [expenseId]

        db.query(getsql,values, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Failed to get the latest expense"
                })
            }
            res.status(200).json(result)
        })

    })
})

app.put("/api/expenses/:id", (req, res) => {

    const expenseid = req.params.id

    const { amount, category, description, expense_date } = req.body

    let sql = `UPDATE expenses SET amount = ? , category = ?, description = ?, expense_date = ? WHERE id = ?`

    const values = [amount, category, description, expense_date, expenseid]

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Failed to update the data"
            })
        }
        res.status(200).json(result)
    })

})

app.delete("/api/expenses/:id", (req, res) => {

    const expenseid = req.params.id
    
    let sql = `DELETE FROM expenses WHERE id = ?`

    const values = [expenseid]

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Expense data deletion is failed"
            })
        }
        res.status(200).json(result)
    })
})

app.listen(PORT, () => {
    console.log(`Server running on the port: ${PORT}`)
})