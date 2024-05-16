//imports the necessary libraries, schemas and functions
const express = require("express")
const router = express.Router()

//get all from db
router.get('/', async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_TABLENAME}`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
})

//insert into db
router.post("/", async (req, res) => {
    const { name, email } = req.body;

    // Check if name or email is missing or empty
    if (!name || !email || name === '' || email === '') {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if the user already exists
        const [checkResults] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE email = ?`, [email]);
        if (checkResults[0].count > 0) {
            return res.status(409).send('User already exists');
        }

        // Insert the new user
        const [insertResults] = await req.pool.query(`INSERT INTO ${process.env.DB_TABLENAME} (name, email) VALUES (?, ?)`, [name, email]);

        // Send a success response
        res.status(201).json({ id: insertResults.insertId, name, email });
    } catch (error) {
        console.error("Error inserting data: ", error);
        res.status(500).send("Internal server error");
    }
});

//update in db
router.put("/", async (req, res) => {
    const { id, name, email } = req.body;

    //check if the id exists in the database
    if (!id || !name || !email || id === "" || name === "" || email === "") {
        return res.status(400).send('All fields are required')
    }

    try {
        //check if the user exists
        const [checkIfUserExists] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

        if (checkIfUserExists[0].count === 0) {
            return res.status(404).send("User does not exist.")
        }

        //update the user
        await req.pool.query(`UPDATE ${process.env.DB_TABLENAME} SET name = ?, email = ? where id = ?`, [name, email, id])

        //send a success response
        res.status(200).json({ id, name, email })
    } catch (error) {
        console.error("Error updating data: ", error)
        res.status(500).send("Internal server error")
    }

})

//delete from db
router.delete("/", async (req, res) => {
    const { id } = req.body;

    //check if the id exists in the database
    if (!id || id === "") {
        return res.status(400).send('All fields are required')
    }

    try {
        //check if the user exists
        const [checkIfUserExists] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

        if (checkIfUserExists[0].count === 0) {
            return res.status(404).send("User does not exist.")
        }

        //delete the user
        await req.pool.query(`DELETE FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id])

        //send a success response
        res.status(200).send(`id ${id} deleted successfuly`)
    } catch (error) {
        console.error("Error updating data: ", error)
        res.status(500).send("Internal server error")
    }

})


module.exports = router;