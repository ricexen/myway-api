module.exports = {
    Mongo: {
        Log: err => {
            if (err) {
                console.log("Error: %s", err.message)
            }
        }
    },
    Migration: {
        Log: filename => console.log('Migration: %s\t Done', filename)
    }
}